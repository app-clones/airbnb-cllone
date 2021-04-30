import { request } from "graphql-request";
import { getConnection } from "typeorm";

import { User } from "../../entity/User";
import { createTypeormConn } from "../../utils/createTypeormConn";
import {
    duplicateEmail,
    invalidEmail,
    shortEmail,
    shortPassword
} from "./errorMessages";

const email = "testing@testing.com";
const password = "password123";

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
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

describe("Regiser user", () => {
    let users: Array<any> = [];

    test("Successfully registers user", async () => {
        const res = await request(
            "http://localhost:4000",
            mutation(email, password)
        );
        expect(res).toEqual({ register: null });
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
        const res = await request(
            "http://localhost:4000",
            mutation(email, password)
        );
        expect(res).toEqual({
            register: [
                {
                    path: "email",
                    message: duplicateEmail
                }
            ]
        });
    });

    test("Successfully catches bad email", async () => {
        const res = await request(
            "http://localhost:4000",
            mutation("b", password)
        );

        expect(res).toEqual({
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
        const res = await request(
            "http://localhost:4000",
            mutation(email, "b")
        );

        expect(res).toEqual({
            register: [{ path: "password", message: shortPassword }]
        });
    });

    test("Successfully catches bad password and email", async () => {
        const res = await request("http://localhost:4000", mutation("a", "b"));

        expect(res).toEqual({
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
