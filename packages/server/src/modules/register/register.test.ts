import { request } from "graphql-request";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";

import { startServer } from "../../startServer";
import { User } from "../../entity/User";
import { getConnection } from "typeorm";

let app: HttpServer | HttpsServer;

beforeAll(async () => {
    app = await startServer();
});

afterAll(async () => {
    app.close();
    await getConnection().close();
});

const email = "testing@testing.com";
const password = "password123";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}") {
      path
      message
  }
}
`;

test("Register user", async () => {
    const response = await request("http://localhost:4000", mutation);
    expect(response).toEqual({ register: null });

    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);

    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const errorResponse = await request("http://localhost:4000", mutation);
    expect(errorResponse.register).toHaveLength(1);
    expect(errorResponse.register[0].path).toEqual("email");
});
