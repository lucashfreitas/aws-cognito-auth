import {
  AdminGetUserResponse,
  CognitoIdentityProvider,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoConfig } from "./cognito";
import { cognitoErrorHandler } from "./cognito-errors";

export interface CognitoGetUserParams {
  email: string;
}

export type CognitoUserResult = AdminGetUserResponse;

export type CognitoGetUser = (input: CognitoGetUserParams) => Promise<{
  user: CognitoUserResult | null;
  success: boolean;
}>;

export const cognitoGetUser: (
  config: CognitoConfig,
  provider: CognitoIdentityProvider
) => CognitoGetUser = (config, provider) => async (input) => {
  try {
    const getUserResult = await provider.adminGetUser({
      Username: input.email,
      UserPoolId: config.UserPoolId,
    });

    return {
      user: getUserResult,
      error: null,
      success: true,
    };
  } catch (err) {
    throw cognitoErrorHandler(err);
  }
};
