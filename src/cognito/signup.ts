// Using ES6 modules

import {
  AttributeType,
  CognitoIdentityProvider,
  MessageActionType,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoConfig } from "./cognito";
import { cognitoErrorHandler } from "./cognito-errors";

/**
 * ReferenceS:
 *
 * https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_InitiateAuth.html
 * https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminGetUser.html
 */

/**
 * @types
 */

export interface CognitoSignupParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type CognitoSignup = (input: CognitoSignupParams) => Promise<{
  success: boolean;
}>;

export const cognitonSignUp: (
  config: CognitoConfig,
  provider: CognitoIdentityProvider
) => CognitoSignup = (config, provider) => async (input) => {
  try {
    const userAttributes: AttributeType[] = [
      {
        Name: "email",
        Value: input.email,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
      {
        Name: "name",
        Value: input.firstName,
      },
      {
        Name: "family_name",
        Value: input.lastName,
      },
    ];

    const createUserResult = await provider.adminCreateUser({
      Username: input.email,
      UserPoolId: config.UserPoolId,
      MessageAction: MessageActionType.SUPPRESS,
      DesiredDeliveryMediums: [],
      UserAttributes: userAttributes,
    });

    const setPasswordResult = await provider.adminSetUserPassword({
      Username: input.email,
      UserPoolId: config.UserPoolId,
      Password: input.password,
      Permanent: true,
    });

    return {
      success: true,
    };
  } catch (err: any) {
    const cognitoError = cognitoErrorHandler(err);
    throw cognitoError;
  }
};
