import { CognitoVerifyTokenErrors } from "../..";
import { cognitoInstance } from "../test-utils";
import { expiredToken } from "./fixtures";

const user = {
  email: "contact+test+verify@lucasfsantos.com",
  password: "A13asd!2313@3",
  firstName: "Test",
  lastName: "Test Last",
};

describe("Cognito Verify Token", () => {
  beforeAll(async () => {
    const result = await cognitoInstance.signup(user);
    expect(result.success).toBe(true);
  });

  afterAll(async () => {
    await cognitoInstance.deleteUser(user);
  });
  it("should verify the access token", async () => {
    const loginResult = await cognitoInstance.login(user);

    const verifyAccessToken = await cognitoInstance.verifyAccessToken(
      loginResult.result.accessToken
    );
    expect(verifyAccessToken.success).toBe(true);
    expect(verifyAccessToken.result).toBeDefined();
    expect(verifyAccessToken.result.sub).toBeDefined();
    expect(verifyAccessToken.result.username).toBeDefined();
    expect(verifyAccessToken.result.auth_time).toBeGreaterThan(0);
  });

  /**
   * @todo every test/new infra deploy the key ID - issue JWS will be diferent. Find a way to decode the base64
   * and alter the expire date to test.
   */
  // it("should return error for expired token", async () => {
  //   const verifyAccessToken = await cognitoInstance.verifyAccessToken(
  //     expiredToken
  //   );
  //   expect(verifyAccessToken.success).toBe(false);
  //   expect(verifyAccessToken.error.code).toBe(CognitoVerifyTokenErrors.Expired);
  // });

  it("should verify the ID token", async () => {
    const loginResult = await cognitoInstance.login(user);

    const verifyIdToken = await cognitoInstance.verifyIdToken(
      loginResult.result.idToken
    );
    expect(verifyIdToken.success).toBe(true);
    expect(verifyIdToken.result.sub).toBeDefined();
    expect(verifyIdToken.result.name).toBeDefined();
    expect(verifyIdToken.result.family_name).toBeDefined();
    expect(verifyIdToken.result.email).toBeDefined();
    expect(verifyIdToken.success).toBe(true);
  });
});
