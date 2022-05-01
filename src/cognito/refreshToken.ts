import {
  AuthFlowType,
  CognitoIdentityProvider,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoConfig } from "./cognito";
import { hashClientSecret } from "./cognito-utils";
import { cognitoErrorHandler } from "./cognito-errors";
/**
 * References
 *
 * https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html
 *
 */
export interface CognitoRefreshTokenParams {
  refreshToken: string;
  userId: string;
}

export type CognitoRefreshToken = (
  input: CognitoRefreshTokenParams
) => Promise<{
  success: boolean;
  result:
    | {
        accessToken: string;
        idToken: string;
      }
    | undefined;
  error:
    | {
        code: string;
        message: string;
      }
    | undefined;
}>;

export const cognitoRefreshToken: (
  config: CognitoConfig,
  provider: CognitoIdentityProvider
) => CognitoRefreshToken = (config, provider) => async (input) => {
  try {
    const initiateAuth = await provider.initiateAuth({
      ClientId: config.ClientId,

      AuthFlow: AuthFlowType.REFRESH_TOKEN,
      AuthParameters: {
        REFRESH_TOKEN: input.refreshToken,
        SECRET_HASH: hashClientSecret({
          userName: input.userId,
          clientId: config.ClientId,
          clientSecret: config.ClientSecret,
        }),
      },
    });

    const result = {
      accessToken: initiateAuth.AuthenticationResult.AccessToken,
      idToken: initiateAuth.AuthenticationResult.IdToken,
    };

    return {
      error: undefined,
      result,
      success: true,
    };
  } catch (err) {
    const _error = (err.message = "Refresh Token has been revoked"
      ? {
          name: "RefreshTokenExpired",
        }
      : err);
    throw cognitoErrorHandler(err);
  }
};
