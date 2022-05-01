import { CognitoErrorTypes } from "../../src/cognito/cognito-errors";
import { CognitoSignupParams } from "../../src/cognito/signup";
import { cognitoInstance } from "../test-utils";

const signupFixtures: CognitoSignupParams = {
  lastName: "aaaa",
  firstName: "bbbb",
  email: "contact+signup@lucasfsantos.com",
  password: "!312sdAsd13q2121D",
};

describe("Cognito Signup", () => {
  afterAll(async () => {
    await cognitoInstance.deleteUser({
      email: signupFixtures.email,
    });
  });

  it("should signup users", async () => {
    const result = await cognitoInstance.signup(signupFixtures);
    expect(result.success).toBe(true);
  });

  it("should return error if users already exists", async () => {
    try {
      await cognitoInstance.signup(signupFixtures);
    } catch (e) {
      expect(e.code).toBe(CognitoErrorTypes.UsernameExists);
    }

    expect.assertions(1);
  });

  it("should return error if the password is invalid", async () => {
    await cognitoInstance.deleteUser({
      email: signupFixtures.email,
    });
    const user = Object.assign({}, signupFixtures, {
      password: "121312131213",
    });

    try {
      await cognitoInstance.signup(user);
    } catch (e) {
      expect(e.code).toBe(CognitoErrorTypes.InvalidPassword);
    }

    expect.assertions(1);
  });
});
