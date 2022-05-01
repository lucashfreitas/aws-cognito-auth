export { Cognito } from "./cognito/cognito";
export { CognitoError, CognitoErrorTypes } from "./cognito/cognito-errors";
export { CognitoVerifyTokenErrors } from "./cognito/verifyToken";

/* https://github.com/microsoft/TypeScript/issues/28481 */
export type CognitoClient = import("./cognito/cognito").CognitoClient;
export type CognitoClientInstance =
  import("./cognito/cognito").CognitoClientInstance;
