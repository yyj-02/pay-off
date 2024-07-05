const parseMessageBody = (input: string) => {
  // Define regular expressions to match phone number and amount
  const phoneRegex = /Recipient:\n\+(\d+)/;
  const amountRegex = /Amount:\n\$(\d+\.{0,1}\d*)/;

  // Extract phone number and amount using regex
  const phoneMatch = input.match(phoneRegex);
  const amountMatch = input.match(amountRegex);

  // Extracted values
  const phoneNumber = phoneMatch ? "+" + phoneMatch[1] : null;
  const amount = amountMatch ? amountMatch[1] : null;

  return {phoneNumber, amount};
};

export {parseMessageBody};
