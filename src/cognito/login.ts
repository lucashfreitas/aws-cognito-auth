// Using ES6 modules

import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoConfig } from "./cognito";
import { cognitoErrorHandler } from "./cognito-errors";
import { hashClientSecret } from "./cognito-utils";

/**
 * ReferenceS:
 *
 * https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html
 * https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminGetUser.html
 */

/**
 * @types
 */
export interface CognitoLoginParams {
  email: string;
  password: string;
}

export type CognitoLogin = (input: CognitoLoginParams) => Promise<{
  success: boolean;
  result:
    | {
        accessToken: string;
        idToken: string;
        refreshToken: string;
      }
    | undefined;
}>;

/**
 * Cognito Login
 * @param email
 * @param password
 * @returns
 */

export const cognitoLogin: (
  config: CognitoConfig,
  provider: CognitoIdentityProvider
) => CognitoLogin = (config, provider) => async (input) => {
  try {
    const initiateAuth = await provider.initiateAuth({
      ClientId: config.ClientId,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: input.email,
        PASSWORD: input.password,
        SECRET_HASH: hashClientSecret({
          userName: input.email,
          clientId: config.ClientId,
          clientSecret: config.ClientSecret,
        }),
      },
    });

    const result = {
      accessToken: initiateAuth.AuthenticationResult.AccessToken,
      idToken: initiateAuth.AuthenticationResult.IdToken,
      refreshToken: initiateAuth.AuthenticationResult.RefreshToken,
    };

    return {
      result,
      error: undefined,
      success: true,
    };
  } catch (err) {
    throw cognitoErrorHandler(err);
  }
};
