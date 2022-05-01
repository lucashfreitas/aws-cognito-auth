import { CognitoErrorTypes } from "../../src/cognito/cognito-errors";
import { CognitoLoginParams } from "../../src/cognito/login";
import { cognitoInstance } from "../test-utils";

const validUser: CognitoLoginParams = {
  email: "contact+login@lucasfsantos.com",
  password: "A13asd!2313@3",
};

const notExistentUser: CognitoLoginParams = {
  email: "justadumbemail@abc.def",
  password: "aaa",
};

const invalidInputs: CognitoLoginParams = {
  email: "",
  password: "",
};

describe("Cognito Signing Tests", () => {
  afterAll(async () => {
    await cognitoInstance.deleteUser(validUser);
  });

  it("should return not found if user doesn't exists ", async () => {
    try {
      await cognitoInstance.login(notExistentUser);
    } catch (e) {
      expect(e.code).toBe(CognitoErrorTypes.UserNotFound);
    }
    expect.assertions(1);
  });

  it("should return invalid input if the inputs are not valid ", async () => {
    try {
      await cognitoInstance.login(invalidInputs);
    } catch (e) {
      expect(e.code).toBe(CognitoErrorTypes.InvalidParameter);
    }

    expect.assertions(1);
  });

  it("should log in with valid user", async () => {
    const user = {
      ...validUser,
      firstName: "first_name",
      lastName: "last_name",
    };

    const signupUserResult = await cognitoInstance.signup(user);
    expect(signupUserResult.success).toBe(true);

    const result = await cognitoInstance.login(validUser);

    expect(result.success).toBe(true);
    expect(result.result.accessToken).toBeDefined();
    expect(result.result.idToken).toBeDefined();
    expect(result.result.refreshToken).toBeDefined();
  });
});
