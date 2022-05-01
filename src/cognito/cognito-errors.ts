export enum CognitoErrorTypes {
  UserNotFound = "UserNotFoundException",
  UnexpectedError = "UnexpectedError",
  NotAuthorized = "NotAuthorizedException",
  InvalidPassword = "InvalidPasswordException",
  UsernameExists = "UsernameExistsException",
  InvalidParameter = "InvalidParameterException",
  RefreshTokenExpired = "RefreshTokenExpired",
  JsonWebTokenError = "JsonWebTokenError",
}

const messages = {
  JsonWebTokenError: "Invalid Token.",
  UserNotFound: "There is not user with the given email.",
  RefreshTokenExpired: "Your access has expired. Please log in again",
  UnexpectedError: `Oops. Something didn't work well. We are investigating the issue. Please try again or contact us`,
  NotAuthorizedError: `Incorrect username or password`,
  InvalidPasswordError: `Please verify your password. It should have at least 6 digits.`,
  UserAlreadyExistsError: "An account with the given email already exists",
  InvalidParameter: "Please inform a valid email and password",
};

export class CognitoError extends Error {
  code: CognitoErrorTypes;

  constructor(error: Error) {
    super(error.message);
    this.stack = error.stack;
  }
}
/**
 *
 * https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminCreateUser.html#CognitoUserPools-AdminCreateUser-request-UserAttributes
 *
 */

export const cognitoErrorHandler: (error: Error) => CognitoError = (error) => {
  const _err = new CognitoError(error);
  const errorName = error?.name;

  switch (errorName) {
    case CognitoErrorTypes.JsonWebTokenError: {
      _err.message = messages.JsonWebTokenError;
      _err.code = CognitoErrorTypes.JsonWebTokenError;
      break;
    }

    case CognitoErrorTypes.UsernameExists: {
      _err.message = messages.UserAlreadyExistsError;
      _err.code = CognitoErrorTypes.UsernameExists;
      break;
    }

    case CognitoErrorTypes.NotAuthorized: {
      const errorMessage = error?.message as any;
      if (errorMessage?.name === "RefreshTokenExpired") {
        _err.message = messages.RefreshTokenExpired;
        _err.code = CognitoErrorTypes.RefreshTokenExpired;
      } else {
        _err.message = messages.NotAuthorizedError;
        _err.code = CognitoErrorTypes.NotAuthorized;
      }

      break;
    }

    case CognitoErrorTypes.InvalidPassword:
      _err.message = messages.InvalidPasswordError;
      _err.code = CognitoErrorTypes.InvalidPassword;
      break;
    case CognitoErrorTypes.InvalidParameter:
      _err.message = messages.InvalidParameter;
      _err.code = CognitoErrorTypes.InvalidParameter;
      break;
    case CognitoErrorTypes.RefreshTokenExpired:
      _err.message = messages.RefreshTokenExpired;
      _err.code = CognitoErrorTypes.InvalidParameter;
      break;
    case CognitoErrorTypes.UserNotFound:
      _err.message = messages.UserNotFound;
      _err.code = CognitoErrorTypes.UserNotFound;
      break;
    default: {
      _err.message = messages.UnexpectedError;
      _err.code = CognitoErrorTypes.UnexpectedError;
    }
  }

  return _err;
};
