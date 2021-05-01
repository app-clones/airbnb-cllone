import { getConnection } from "typeorm";

import { User } from "../../entity/User";
import { TestClient } from "../../tests/utils/TestClient";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { duplicateEmail, invalidEmail, shortEmail } from "./errorMessages";
import { shortPassword } from "../shared/sharedErrorMessages";

const email = "testing@testing.com";
const password = "password123";
const client = new TestClient(process.env.TEST_HOST!);

beforeAll(async () => {
    await createTypeormConn();
});

afterAll(async () => {
    await getConnection().close();
});

describe("Regiser user", () => {
    let users: Array<any> = [];

    test("Successfully registers user", async () => {
        const res = await client.register(email, password);
        expect(res.data.data).toEqual({ register: null });
    });

    test("Successfully finds user in database", async () => {
        users = await User.find({ where: { email } });
        expect(users).toHaveLength(1);
    });

    test("Successfully hashes password", async () => {
        const user = users[0];
        expect(user.email).toEqual(email);
        expect(user.password).not.toEqual(password);
    });

    test("Successfully returns duplicate email error", async () => {
        const res = await client.register(email, password);
        expect(res.data.data).toEqual({
            register: [
                {
                    path: "email",
                    message: duplicateEmail
                }
            ]
        });
    });

    test("Successfully catches bad email", async () => {
        const res = await client.register("b", password);

        expect(res.data.data).toEqual({
            register: [
                { path: "email", message: shortEmail },
                {
                    path: "email",
                    message: invalidEmail
                }
            ]
        });
    });

    test("Successfully catches bad password", async () => {
        const res = await client.register(email, "b");

        expect(res.data.data).toEqual({
            register: [{ path: "password", message: shortPassword }]
        });
    });

    test("Successfully catches bad password and email", async () => {
        const res = await client.register("a", "b");

        expect(res.data.data).toEqual({
            register: [
                { path: "email", message: shortEmail },
                {
                    path: "email",
                    message: invalidEmail
                },
                { path: "password", message: shortPassword }
            ]
        });
    });
});
