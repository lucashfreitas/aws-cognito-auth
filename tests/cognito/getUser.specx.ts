import { cognitoInstance } from "../test-utils";

const user = {
  email: "contact+test+getuser@lucasfsantos.com",
  password: "A13asd!2313@3",
  firstName: "Test",
  lastName: "Test Last",
};

describe("Cognito Get User", () => {
  beforeAll(async () => {
    const result = await cognitoInstance.signup(user);
    expect(result.success).toBe(true);
  });

  afterAll(async () => {
    await cognitoInstance.deleteUser(user);
  });

  it("should get the user", async () => {
    const getUserResult = await cognitoInstance.getUser({
      email: user.email,
    });
    expect(getUserResult.success).toBe(true);
    expect(
      getUserResult.user.UserAttributes.find(
        (c) => c.Name === "Email" && c.Value === user.email
      )
    );
  });
});
