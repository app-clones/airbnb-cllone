import axios from "axios";
import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../entity/User";
import { getConnection } from "typeorm";

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

const logoutMutation = `
mutation {
    logout
}
`;

describe("Logout", () => {
    test("Successfully logs out user", async () => {
        // Login user
        await axios.post(
            process.env.TEST_HOST as string,
            {
                query: loginMutation(email, password)
            },
            {
                withCredentials: true
            }
        );

        // Get current user using me query
        let response = await axios.post(
            process.env.TEST_HOST as string,
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

        // Logout user
        await axios.post(
            process.env.TEST_HOST as string,
            {
                query: logoutMutation
            },
            {
                withCredentials: true
            }
        );

        // Get current user using me query (should be null)
        response = await axios.post(
            process.env.TEST_HOST as string,
            {
                query: meQuery
            },
            {
                withCredentials: true
            }
        );

        expect(response.data.data.me).toBeNull();
    });
});
