import { invalidLogin, confirmEmail } from "./errorMessages";
import { User } from "../../entity/User";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { getConnection } from "typeorm";
import { TestClient } from "../../tests/utils/TestClient";

const email = "testing@testing.com";
const password = "password123";
const client = new TestClient(process.env.TEST_HOST!);

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
    const res = await client.login(e, p);

    expect(res.data.data).toEqual({
        login: [
            {
                path,
                message
            }
        ]
    });
};

describe("Login user", () => {
    test("Successfully sends back correct errors", async () => {
        // Incorrect email
        await loginExpectError(
            "bob@bob.com",
            "whatever",
            invalidLogin,
            "email"
        );

        // Email has not been confirmed
        await client.register(email, password);
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
        const res = await client.login(email, password);

        expect(res.data.data).toEqual({ login: null });
    });
});
