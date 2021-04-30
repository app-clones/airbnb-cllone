import Redis from "ioredis";
import phin from "phin";
import { getConnection } from "typeorm";

import { User } from "../entity/User";
import { createConfirmEmailLink } from "../utils/createConfirmEmailLink";
import { createTypeormConn } from "../utils/createTypeormConn";

let userId = "";
const redis = new Redis();

beforeAll(async () => {
    await createTypeormConn();
    const user = await User.create({
        email: "jest@testing.com",
        password: "jesttesting123"
    }).save();
    userId = user.id;
});

afterAll(async () => {
    await getConnection().close();
    redis.disconnect();
});

describe("Create Confirm Email Link", () => {
    test("Works with correct ID", async () => {
        const url = await createConfirmEmailLink(
            process.env.TEST_HOST!,
            userId,
            redis
        );

        const res = await phin(url);
        expect(res.statusCode).toEqual(200);

        const user = await User.findOne({ where: { id: userId } });
        expect((user as User).confirmed).toBeTruthy();

        const chunks = url.split("/");
        const key = chunks[chunks.length - 1];
        const value = await redis.get(key);
        expect(value).toBeNull();
    });

    test("Returns error when an invalid ID is given", async () => {
        const res = await phin(`${process.env.TEST_HOST}/confirm/3424`);
        expect(res.statusCode).not.toEqual(200);
    });
});
