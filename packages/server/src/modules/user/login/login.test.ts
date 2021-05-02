import faker from "faker";

import { invalidLogin, confirmEmail } from "./errorMessages";
import { User } from "../../../entity/User";
import { getConnection } from "typeorm";
import { TestClient } from "../../../tests/utils/TestClient";
import { createTestConn } from "../../../tests/utils/createTestConn";

const email = faker.internet.email();
const password = faker.internet.password();
const client = new TestClient(process.env.TEST_HOST!);

beforeAll(async () => {
    await createTestConn();
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
