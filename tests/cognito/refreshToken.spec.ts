import { CognitoErrorTypes } from "../../src/cognito/cognito-errors";
import { CognitoUserResult } from "../../src/cognito/getUser";
import { cognitoInstance } from "../test-utils";

const userFixture = {
  email: "contact+test+refresh@lucasfsantos.com",
  password: "A13asd!2313@3",
  firstName: "Test",
  lastName: "Test Last",
};

let createdUserTokens: {
  accessToken: string;
  idToken: string;
  refreshToken: string;
} = null;

let createdUserResult: CognitoUserResult = null;

describe("Cognito Verify Token", () => {
  beforeAll(async () => {
    const result = await cognitoInstance.signup(userFixture);
    expect(result.success).toBe(true);
    const loginResult = await cognitoInstance.login(userFixture);
    expect(loginResult.success).toBe(true);

    createdUserTokens = loginResult.result;
    expect(createdUserTokens).toBeDefined();
    const userResult = await cognitoInstance.getUser({
      email: userFixture.email,
    });
    expect(userResult.success).toBe(true);
    createdUserResult = userResult.user;
    expect(createdUserResult).toBeDefined();
  });

  afterAll(async () => {
    await cognitoInstance.deleteUser(userFixture);
  });

  it("should generate token given a valid refresh token ", async () => {
    const refreshTokenResult = await cognitoInstance.refreshToken({
      refreshToken: createdUserTokens.refreshToken,
      userId: createdUserResult.Username,
    });

    expect(refreshTokenResult.success).toBe(true);
    expect(refreshTokenResult.result.accessToken).toBeDefined();
    expect(refreshTokenResult.result.idToken).toBeDefined();
  });

  it("should not refresh a token for a invalid token", async () => {
    const CognitoErrors: any = {};
    const revokeTokenResult = await cognitoInstance.revokeToken({
      refreshToken: createdUserTokens.refreshToken,
    });

    expect(revokeTokenResult.success).toBe(true);

    try {
      await cognitoInstance.refreshToken({
        refreshToken: createdUserTokens.refreshToken,
        userId: createdUserResult.Username,
      });
    } catch (e) {
      expect(e.code).toBe(CognitoErrorTypes.RefreshTokenExpired);
    }

    expect.assertions(2);
  });

  //  @todo how to test this case?
  /* it("should not refresh an expired token", () => {
    
});
*/
});
