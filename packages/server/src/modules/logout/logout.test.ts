import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../entity/User";
import { getConnection } from "typeorm";
import { TestClient } from "../../tests/utils/TestClient";

let userId: string;
const email = "testing@testing.com";
const password = "password123";

beforeAll(async () => {
    await createTypeormConn();
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
    test("Successfully logs out user", async () => {
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
