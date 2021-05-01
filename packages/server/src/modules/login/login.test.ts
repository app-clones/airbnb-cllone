import request from "graphql-request";
import { invalidLogin, confirmEmail } from "./errorMessages";
import { User } from "../../entity/User";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { getConnection } from "typeorm";

const email = "testing@testing.com";
const password = "password123";

const registerMutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

const loginMutation = (e: string, p: string) => `
mutation {
  login(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

beforeAll(async () => {
    await createTypeormConn();
});

afterAll(async () => {
    await getConnection().close();
});

const loginExpectError = async (
    e: string,
    p: string,
    message: string,
    path: string
) => {
    const response = await request(process.env.TEST_HOST!, loginMutation(e, p));

    expect(response).toEqual({
        login: [
            {
                path,
                message
            }
        ]
    });
};

describe("Login user", () => {
    test("Sends back correct errors", async () => {
        // Incorrect email
        await loginExpectError(
            "bob@bob.com",
            "whatever",
            invalidLogin,
            "email"
        );

        // Email has not been confirmed
        await request(
            process.env.TEST_HOST!,
            registerMutation(email, password)
        );

        await loginExpectError(email, password, confirmEmail, "email");

        await User.update({ email }, { confirmed: true });

        // Incorrect password
        await loginExpectError(
            email,
            "aslkdfjaksdljf",
            invalidLogin,
            "password"
        );
    });

    test("Successfully logs in user", async () => {
        const response = await request(
            process.env.TEST_HOST!,
            loginMutation(email, password)
        );

        expect(response).toEqual({ login: null });
    });
});
