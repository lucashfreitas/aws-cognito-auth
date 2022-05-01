import crypto from "crypto";

export const getPublicKeys = () => {};

export const hashClientSecret: (options: {
  userName: string;
  clientSecret: string;
  clientId: string;
}) => string = (options) => {
  return crypto
    .createHmac("SHA256", options.clientSecret)
    .update(options.userName + options.clientId)
    .digest("base64");
};
