// Using ES6 modules

import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoGetUser, cognitoGetUser } from "./getUser";
import { CognitoLogin, cognitoLogin } from "./login";
import { CognitoRefreshToken, cognitoRefreshToken } from "./refreshToken";
import { CognitoRemoveUser, cognitoRemoveUser } from "./removeUser";
import { cognitoRevokeToken, CognitoRevokeToken } from "./revokeToken";
import { cognitonSignUp, CognitoSignup } from "./signup";
import {
  AccessTokenClaim,
  CognitoVerifyToken,
  cognitoVerifyToken,
  IdTokenClaim,
} from "./verifyToken";

export type CognitoClientInstance = (config: CognitoConfig) => CognitoClient;

export type CognitoClient = {
  refreshToken: CognitoRefreshToken;
  getUser: CognitoGetUser;
  login: CognitoLogin;
  signup: CognitoSignup;
  deleteUser: CognitoRemoveUser;
  revokeToken: CognitoRevokeToken;
  verifyIdToken: CognitoVerifyToken<IdTokenClaim>;
  verifyAccessToken: CognitoVerifyToken<AccessTokenClaim>;
};

export interface CognitoConfig {
  UserPoolId: string;
  ClientId: string;
  Region: string;
  ClientSecret: string;
}

export const Cognito: CognitoClientInstance = (config) => {
  const provider = new CognitoIdentityProvider({
    region: config.Region,
  });

  try {
    return {
      refreshToken: cognitoRefreshToken(config, provider),
      getUser: cognitoGetUser(config, provider),
      verifyIdToken: cognitoVerifyToken<IdTokenClaim>(config, "id"),
      verifyAccessToken: cognitoVerifyToken<AccessTokenClaim>(config, "access"),
      revokeToken: cognitoRevokeToken(config, provider),
      login: cognitoLogin(config, provider),
      signup: cognitonSignUp(config, provider),
      deleteUser: cognitoRemoveUser(config, provider),
    };
  } catch (err) {
    throw err;
  }
};
