import { cognitoInstance } from "../test-utils";

const user = {
  email: "contact+revoke@lucasfsantos.com",
  password: "A13asd!2313@3",
  firstName: "Test",
  lastName: "Test Last",
};

describe("Congito Revoke Token Test", () => {
  afterAll(async () => {
    await cognitoInstance.deleteUser(user);
  });
  it("should revoke the token", async () => {
    const signupResult = await cognitoInstance.signup(user);
    expect(signupResult.success).toBe(true);
    const loginResult = await cognitoInstance.login(user);
    expect(loginResult.success).toBe(true);
    const revokeTokenResult = await cognitoInstance.revokeToken({
      refreshToken: loginResult.result.refreshToken,
    });
    expect(revokeTokenResult.success).toBe(true);
  });
});
