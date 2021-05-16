import "dotenv/config";
import "reflect-metadata";

import { GraphQLServer } from "graphql-yoga";
import fs from "fs";
import path from "path";
import session from "express-session";
import RateLimit from "express-rate-limit";
import RateLimitRedisStore from "rate-limit-redis";
import connectRedis from "connect-redis";
import glob from "glob";

import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { createTypeormConn } from "./utils/createTypeormConn";
import redis from "./utils/redis";
import { confirmEmail } from "./routes/confirmEmail";
import { redisSessionPrefix } from "./utils/constants";
import { createTestConn } from "./tests/utils/createTestConn";

export const startServer = async () => {
    const pathToModules = path.join(__dirname, "./modules");
    const graphqlTypes = glob
        .sync(`${pathToModules}/**/*.graphql`)
        .map((x) => fs.readFileSync(x, { encoding: "utf8" }));
    graphqlTypes.push("type Query { bugfix: String! }");

    const resolvers = glob
        .sync(`${pathToModules}/**/resolvers.?s`)
        .map((resolver) => require(resolver).resolvers);

    const server = new GraphQLServer({
        // @ts-ignore
        schema: makeExecutableSchema({
            typeDefs: mergeTypeDefs(graphqlTypes),
            resolvers: mergeResolvers(resolvers)
        }),
        context: ({ request }) => ({
            redis,
            url: request.protocol + "://" + request.get("host"),
            req: request
        })
    });

    server.express.use(
        RateLimit({
            store: new RateLimitRedisStore({
                client: redis
            }),
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs,
            message: "Too many requests from this IP, try again in 15 minutes"
        })
    );

    const RedisStore = connectRedis(session);

    server.express.use(
        session({
            store: new RedisStore({
                client: redis as any,
                prefix: redisSessionPrefix
            }),
            name: "qid",
            secret: process.env.SESSION_SECRET!,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            }
        })
    );

    if (process.env.NODE_ENV === "test") {
        await createTestConn(true);
    } else {
        await createTypeormConn();
    }

    const app = await server.start({
        cors: {
            credentials: true,
            origin:
                process.env.NODE_ENV === "test"
                    ? "*"
                    : process.env.FRONTEND_HOST!
        },
        port: process.env.PORT || 4000
    });
    console.log("Server is running on http://localhost:4000");

    server.express.get("/confirm/:id", confirmEmail);

    return { app, redis };
};
