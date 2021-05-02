import faker from "faker";

import { User } from "../../../entity/User";
import { getConnection } from "typeorm";
import { TestClient } from "../../../tests/utils/TestClient";
import { createTestConn } from "../../../tests/utils/createTestConn";

let userId: string;
const email = faker.internet.email();
const password = faker.internet.password();

beforeAll(async () => {
    await createTestConn();
    const user = await User.create({
        email,
        password,
        confirmed: true
    }).save();
    userId = user.id;
});

afterAll(async () => {
    await getConnection().close();
});

describe("Logout", () => {
    test("Successfully logs out all users sessions", async () => {
        // Computer 1
        const sess1 = new TestClient(process.env.TEST_HOST!);

        // Computer 2
        const sess2 = new TestClient(process.env.TEST_HOST!);

        await sess1.login(email, password);
        await sess2.login(email, password);

        expect((await sess1.me()).data.data).toEqual(
            (await sess2.me()).data.data
        );
        await sess1.logout();
        expect((await sess1.me()).data.data).toEqual(
            (await sess2.me()).data.data
        );
    });

    test("Successfully logs out one user's session", async () => {
        const client = new TestClient(process.env.TEST_HOST!);

        await client.login(email, password);

        let response = await client.me();
        expect(response.data.data).toEqual({
            me: {
                id: userId,
                email
            }
        });

        await client.logout();

        response = await client.me();

        expect(response.data.data.me).toBeNull();
    });
});
