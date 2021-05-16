import Redis from "ioredis";

let redis: Redis.Redis;
if (process.env.NODE_ENV === "production") {
    redis = new Redis({
        password: process.env.REDIS_PASSWORD,
        port: 18652,
        host: process.env.REDIS_HOST
    });
} else {
    redis = new Redis();
}
export default redis;
