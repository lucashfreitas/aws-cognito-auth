import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoConfig } from "./cognito";
import { cognitoErrorHandler } from "./cognito-errors";

export interface CognitoRevokeTokenParams {
  refreshToken: string;
}

export type CognitoRevokeToken = (input: CognitoRevokeTokenParams) => Promise<{
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
}>;

export const cognitoRevokeToken: (
  config: CognitoConfig,
  provider: CognitoIdentityProvider
) => CognitoRevokeToken = (config, provider) => async (input) => {
  try {
    await provider.revokeToken({
      Token: input.refreshToken,
      ClientId: config.ClientId,
      ClientSecret: config.ClientSecret,
    });

    return {
      success: true,
    };
  } catch (err: any) {
    throw cognitoErrorHandler(err);
  }
};
