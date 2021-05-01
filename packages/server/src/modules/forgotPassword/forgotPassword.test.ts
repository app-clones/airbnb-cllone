// something
import { createTypeormConn } from "../../utils/createTypeormConn";
import { User } from "../../entity/User";
import { getConnection } from "typeorm";
import { TestClient } from "../../tests/utils/TestClient";
import { createForgotPasswordLink } from "../../utils/createForgotPasswordLink";
import Redis from "../../utils/redis";
import { forgotPasswordLockAccount } from "../../utils/forgotPasswordLockAccount";
import { forgotPasswordLockedError } from "../login/errorMessages";
import { shortPassword } from "../shared/sharedErrorMessages";
import { expiredKeyError } from "./errorMessages";

let userId: string;
const email = "testing@testing.com";
const password = "password123";
const newPassword = "password321";
const client = new TestClient(process.env.TEST_HOST!);
const redis = Redis;

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

describe("Forgot Password", () => {
    test("Successfully changes user password", async () => {
        await forgotPasswordLockAccount(userId, redis);

        const url = await createForgotPasswordLink(
            process.env.FRONTEND_HOST!,
            userId,
            redis
        );
        const parts = url.split("/");
        const key = parts[parts.length - 1];

        expect(await (await client.login(email, password)).data.data).toEqual({
            login: [
                {
                    path: "email",
                    message: forgotPasswordLockedError
                }
            ]
        });

        expect(
            await (await client.forgotPasswordChange("a", key)).data.data
        ).toEqual({
            forgotPasswordChange: [
                {
                    path: "newPassword",
                    message: shortPassword
                }
            ]
        });

        const response = await client.forgotPasswordChange(newPassword, key);
        expect(response.data.data).toEqual({
            forgotPasswordChange: null
        });

        expect(
            await (await client.forgotPasswordChange("alksdjfalksdjfl", key))
                .data.data
        ).toEqual({
            forgotPasswordChange: [
                {
                    path: "key",
                    message: expiredKeyError
                }
            ]
        });

        expect(
            await (await client.login(email, newPassword)).data.data
        ).toEqual({
            login: null
        });
    });
});
