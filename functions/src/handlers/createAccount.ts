import * as admin from "firebase-admin";

interface CreateAccountRequest {
  phoneNumber: string;
  userName: string;
  password: string;
}

const createAccount = async (req: any, res: any) => {
  // Validate request
  const request: CreateAccountRequest = req.body;
  if (!request.phoneNumber || !request.userName || !request.password) {
    res.status(400).send("Invalid request");
    return;
  }

  // Validate no existing phone number
  const existingUser = await admin
    .firestore()
    .collection("users")
    .doc(request.phoneNumber)
    .get();
  if (existingUser.exists) {
    res.status(400).send("User already exists");
    return;
  }

  // Create user
  await admin.firestore().collection("users").doc(request.phoneNumber).set({
    userName: request.userName,
    password: request.password,
  });
};

export { createAccount };
