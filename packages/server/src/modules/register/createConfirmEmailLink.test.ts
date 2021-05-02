import Redis from "ioredis";
import axios from "axios";
import { getConnection } from "typeorm";

import { User } from "../../entity/User";
import { createTestConn } from "../../tests/utils/createTestConn";
import { createConfirmEmailLink } from "./createConfirmEmailLink";

let userId = "";
const redis = new Redis();

beforeAll(async () => {
    await createTestConn();
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

test("Create Confirm Email Link successfully works with correct ID", async () => {
    const url = await createConfirmEmailLink(
        process.env.TEST_HOST!,
        userId,
        redis
    );

    const res = await axios(url);
    expect(res.status).toEqual(200);

    const user = await User.findOne({ where: { id: userId } });
    expect((user as User).confirmed).toBeTruthy();

    const chunks = url.split("/");
    const key = chunks[chunks.length - 1];
    const value = await redis.get(key);
    expect(value).toBeNull();
});
