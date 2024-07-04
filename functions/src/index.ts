/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const twilio = require("twilio");
const bodyParser = require("body-parser");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

import "dotenv/config";

import { findUserByPhoneNumber, updateUserBalance } from "./models/User";

import { addTransfer } from "./models/Transaction";
import { onRequest } from "firebase-functions/v2/https";
import { parseMessageBody } from "./utils/parseMessageBody";

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

initializeApp();
const db = getFirestore();

export const handleTransaction = onRequest(async (req, res) => {
  // Parse the body
  bodyParser.json({
    verify: (req: { rawBody: any }, res: any, buf: any) => {
      req.rawBody = buf;
    },
  })(req, res, () => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
    }

    console.log("[BODY]", req.body);
    console.log("[MESSAGE]", req.body.Body);

    twilio.webhook(process.env.AUTH_TOKEN)(req, res, async () => {
      const { Phone, Body, SmsMessageSid } = req.body;

      const { phoneNumber, amount } = parseMessageBody(Body);

      if (
        !phoneNumber ||
        !amount ||
        !/^(?!-)\d*\.?\d{0,2}$/.test(amount) ||
        Phone === phoneNumber
      ) {
        const response = new MessagingResponse();
        response.message(
          "Please provide a valid recipient phone number and amount to transfer."
        );
        res.set("Content-Type", "text/xml");
        res.send(response.toString());
        return;
      }

      const sender = await findUserByPhoneNumber(db, Phone);
      const recipient = await findUserByPhoneNumber(db, phoneNumber);

      if (!sender || !recipient) {
        const response = new MessagingResponse();
        response.message("User not found.");
        res.set("Content-Type", "text/xml");
        res.send(response.toString());
        return;
      }

      const amountNum = parseFloat(amount);

      if (sender.data.balance < amountNum) {
        const response = new MessagingResponse();
        response.message("Insufficient balance.");
        res.set("Content-Type", "text/xml");
        res.send(response.toString());
        return;
      }

      await addTransfer(db, SmsMessageSid, sender.id, recipient.id, amountNum);
      await updateUserBalance(db, sender.id, sender.data.balance - amountNum);
      await updateUserBalance(
        db,
        recipient.id,
        recipient.data.balance + amountNum
      );

      // Twilio Messaging URL - receives incoming messages from Twilio
      const response = new MessagingResponse();
      response.message(
        `[Payoff Success]\n\nTransfer of $${amount} to ${recipient.data.phoneNumber} successful.`
      );
      res.set("Content-Type", "text/xml");
      res.send(response.toString());
    });
  });
});
