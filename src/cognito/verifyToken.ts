import * as jsonWebToken from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { CognitoConfig } from "./cognito";
const jwkToPem = require("jwk-to-pem");
/**
 * Refs
 * https://github.com/awslabs/aws-support-tools/blob/master/Cognito/decode-verify-jwt/decode-verify-jwt.ts
 */

export enum CognitoVerifyTokenErrors {
  Expired = "TokenExpiredError",
  JsonWebTokenError = "JsonWebTokenError",
  InvalidToken = "InvalidToken",
  Exception = "Error",

  InvalidIssuer = "InvalidIssuer",
  InvalidTokenUse = "InvalidTokenUse",
  KeyIdMissmatch = "KeyIdMissmatch",
}
export interface TokenVerifyError {
  code: CognitoVerifyTokenErrors;
  message: string;
}

export type CognitoTokenUse = "id" | "access";

interface TokenHeader {
  kid: string;
  alg: string;
}
interface PublicKey {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}
interface PublicKeyMeta {
  instance: PublicKey;
  pem: string;
}

interface MapOfKidToPublicKey {
  [key: string]: PublicKeyMeta;
}

type CognitoUserGroups = string;

/**
 * https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-access-token.html
 */

export interface GenericClaimData {
  auth_time: number;
  exp: number;
  token_use: string;
  iss: string;
  iat: number;
  sub: string;
}

export interface AccessTokenClaim extends GenericClaimData {
  sub: string;
  device_key: string;
  "cognito:groups": Array<CognitoUserGroups>;
  origin_jt: string;
  jti: string;
  username: string;
  scope: string;
  client_id: string;
}

/*https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-id-token.html 
These are the claims we are using. Is important to add all of them as read attributes when creating the 
cognito app client.
*/
export interface IdTokenClaim extends GenericClaimData {
  aud: string;
  family_name: string;
  name: string;
  email_verified: boolean;
  token_use: string;
  iss: string;
  "cognito:username": string;
  email: string;
  jti: string;
  origin_jti: string;
}

export type CognitoVerifyToken<ClaimResult> = (token: string) => Promise<{
  error?: TokenVerifyError;
  result?: ClaimResult;
  success: boolean;
}>;

/* CACHE key */

let cacheKeys: MapOfKidToPublicKey | undefined;

/**
 * Utils
 */

/**
 * Get public keys for the cognito pool
 * @todo fetch the keys on api startup and save it in memory - if we run this api
 * inside a serverless context this will be called everytime
 * @param config
 * @returns
 */

const getPublicKeys = async (
  config: CognitoConfig
): Promise<MapOfKidToPublicKey> => {
  try {
    if (!cacheKeys) {
      const client = jwksClient({
        jwksUri: `https://cognito-idp.${config.Region}.amazonaws.com/${config.UserPoolId}/.well-known/jwks.json`,
        requestHeaders: {}, // Optional
        timeout: 30000, // Defaults to 30s
      });

      const keys = (await client.getKeys()) as any[];
      cacheKeys = keys.reduce((agg, current) => {
        const pem = jwkToPem(current);
        agg[current.kid] = { instance: current, pem };
        return agg;
      }, {} as MapOfKidToPublicKey);
      return cacheKeys;
    } else {
      return cacheKeys;
    }
  } catch (err) {
    if (cacheKeys) return cacheKeys;
    throw err;
  }
};

/**
 * Get the key pem based on the header KID
 * @param token
 * @returns PublicKeyMeta
 */
const getKeyPem: (input: { token: string; config: CognitoConfig }) => Promise<{
  error?: TokenVerifyError;
  key?: PublicKeyMeta;
}> = async (input) => {
  const tokenSections = (input.token || "").split(".");
  if (tokenSections.length < 2) {
    return {
      error: {
        code: CognitoVerifyTokenErrors.InvalidToken,
        message: "requested token is invalid",
      },
    };
  }

  const headerJSON = Buffer.from(tokenSections[0], "base64").toString("utf8");
  const header = JSON.parse(headerJSON) as TokenHeader;

  const keys = await getPublicKeys(input.config);

  const key = keys[header.kid];

  if (key === undefined) {
    return {
      error: {
        code: CognitoVerifyTokenErrors.KeyIdMissmatch,
        message: "claim made for unknown kid",
      },
    };
  }

  return {
    key,
  };
};

const verifyToken: <ClaimType>(options: {
  tokenType: CognitoTokenUse;
  token: string;
  config: CognitoConfig;
}) => Promise<{
  result?: ClaimType | null;
  error?: TokenVerifyError | null;
}> = async <ClaimType>(input) => {
  try {
    const { config, token, tokenType } = input;

    const keyGet = await getKeyPem({ token: token, config });

    if (keyGet.error) return { error: keyGet.error, result: null };

    const cognitoIssuer = `https://cognito-idp.us-east-1.amazonaws.com/${config.UserPoolId}`;

    const claim = jsonWebToken.verify(
      token,
      keyGet.key.pem
    ) as any as ClaimType & {
      iss: string;
      token_use: CognitoTokenUse;
      exp: number;
      auth_time: number;
    };

    const currentSeconds = Math.floor(new Date().valueOf() / 1000);
    if (currentSeconds > claim.exp) {
      return {
        error: {
          code: CognitoVerifyTokenErrors.Expired,
          message: "Token Expired",
        },
      };
    }

    if (claim.iss !== cognitoIssuer) {
      return {
        error: {
          code: CognitoVerifyTokenErrors.InvalidIssuer,
          message: "claim issuer is invalid",
        },
      };
    }

    if (claim.token_use !== tokenType) {
      return {
        error: {
          code: CognitoVerifyTokenErrors.InvalidTokenUse,
          message: "claim use is not access",
        },
      };
    }

    return {
      result: claim,
    };
  } catch (err: any) {
    if (err.name === CognitoVerifyTokenErrors.JsonWebTokenError) {
      return {
        success: false,
        error: {
          code: CognitoVerifyTokenErrors.JsonWebTokenError,
          message: "Invalid Token",
        },
      };
    }

    if (err.name === CognitoVerifyTokenErrors.Expired) {
      return {
        success: false,
        error: {
          code: CognitoVerifyTokenErrors.Expired,
          message: "Token Expired",
        },
      };
    }

    return {
      error: {
        code: CognitoVerifyTokenErrors.Exception,
        message: `Something wen't wrong. Please try again`,
      },
      success: false,
    };
  }
};

/*Finish utils*/

export const cognitoVerifyToken: <Claim>(
  config: CognitoConfig,
  tokenType: CognitoTokenUse
) => CognitoVerifyToken<Claim> =
  <Claim>(config, tokenType) =>
  async (token) => {
    try {
      const tokenValidated = await verifyToken<Claim>({
        config,
        token,
        tokenType: tokenType,
      });

      if (tokenValidated.error) {
        return {
          success: false,
          error: tokenValidated.error,
        };
      }

      return {
        success: true,
        result: tokenValidated.result,
      };
    } catch (err) {
      return {
        error: {
          code: CognitoVerifyTokenErrors.Exception,
          message: `Something wen't wrong. Please try again`,
        },
        success: false,
      };
    }
  };
