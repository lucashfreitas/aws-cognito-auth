import { getOutput } from "../infra/output";
import "dotenv/config";
export default async function () {

  // is running on CI environment, need to manually set environment variables from  cdk deploy
  const output = getOutput();
  process.env.AWS_SANDBOX_COGNITO_CLIENT_ID = output.CognitoUserClientId;
  process.env.AWS_SANDBOX_COGNITO_CLIENT_SECRET = output.CognitoClientSecret;
  process.env.AWS_SANDBOX_COGNITO_USERPPOL_ID = output.CognitoUserPoolId;

  if (
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY ||
    !process.env.AWS_SANDBOX_COGNITO_USERPPOL_ID ||
    !process.env.AWS_SANDBOX_COGNITO_USERPPOL_ID ||
    !process.env.AWS_SANDBOX_COGNITO_CLIENT_SECRET
  ) {
    throw new Error(`AWS_ACCESS_KEY_ID, 
    AWS_SECRET_ACCESS_KEY,
    AWS_SANDBOX_COGNITO_USERPPOL_ID,
    AWS_SANDBOX_COGNITO_CLIENT_ID,
    AWS_SANDBOX_COGNITO_CLIENT_SECRET
    must be set up for the cognito integration tests. `);
  }
}
