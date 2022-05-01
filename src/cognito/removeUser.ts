import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoConfig } from "./cognito";
import { cognitoErrorHandler } from "./cognito-errors";

export interface CognitoRemoveUserParams {
  email: string;
}

export type CognitoRemoveUser = (input: CognitoRemoveUserParams) => Promise<{
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
}>;

export const cognitoRemoveUser: (
  config: CognitoConfig,
  provider: CognitoIdentityProvider
) => CognitoRemoveUser = (config, provider) => async (input) => {
  try {
    await provider.adminDeleteUser({
      Username: input.email,
      UserPoolId: config.UserPoolId,
    });

    return {
      success: true,
    };
  } catch (err: any) {
    throw cognitoErrorHandler(err);
  }
};
