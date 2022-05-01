import { Cognito } from "..";

export const cognitoInstance = Cognito({
  Region: process.env.AWS_REGION,
  ClientId: process.env.AWS_SANDBOX_COGNITO_CLIENT_ID,
  UserPoolId: process.env.AWS_SANDBOX_COGNITO_USERPPOL_ID,
  ClientSecret: process.env.AWS_SANDBOX_COGNITO_CLIENT_SECRET,
});
