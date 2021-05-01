import axios from "axios";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../entity/User";
import { Connection } from "typeorm";

let userId: string;
let conn: Connection;
const email = "testing@testing.com";
const password = "password123";

beforeAll(async () => {
    conn = await createTypeormConn();
    const user = await User.create({
        email,
        password,
        confirmed: true
    }).save();
    userId = user.id;
});

afterAll(async () => {
    await conn.close();
});

const loginMutation = (e: string, p: string) => `
mutation {
    login(email: "${e}", password: "${p}") {
        path
        message
    }
}
`;

const meQuery = `
{
    me {
        id
        email
    }
}
`;

describe("Me query", () => {
    test("Successfully get currently logged in user", async () => {
        await axios.post(
            process.env.TEST_HOST!,
            {
                query: loginMutation(email, password)
            },
            {
                withCredentials: true
            }
        );

        const response = await axios.post(
            process.env.TEST_HOST!,
            {
                query: meQuery
            },
            {
                withCredentials: true
            }
        );

        expect(response.data.data).toEqual({
            me: {
                id: userId,
                email
            }
        });
    });
});
