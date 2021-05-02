import "dotenv/config";
import "reflect-metadata";

import { GraphQLServer } from "graphql-yoga";
import fs from "fs";
import path from "path";
import { GraphQLSchema } from "graphql";
import session from "express-session";
import RateLimit from "express-rate-limit";
import RateLimitRedisStore from "rate-limit-redis";
import connectRedis from "connect-redis";

import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { mergeSchemas } from "@graphql-tools/merge";

import { createTypeormConn } from "./utils/createTypeormConn";
import redis from "./utils/redis";
import { confirmEmail } from "./routes/confirmEmail";
import { redisSessionPrefix } from "./utils/constants";
import { createTestConn } from "./tests/utils/createTestConn";

export const startServer = async () => {
    const schemas: GraphQLSchema[] = [];
    const folders = fs.readdirSync(path.join(__dirname, "modules"));

    folders.forEach((folder) => {
        if (folder === "shared") return;
        const { resolvers } = require(`./modules/${folder}/resolvers`);
        const typeDefs = loadSchemaSync(
            path.join(__dirname, `./modules/${folder}/schema.graphql`),
            {
                loaders: [new GraphQLFileLoader()]
            }
        );
        schemas.push(addResolversToSchema({ schema: typeDefs, resolvers }));
    });

    const server = new GraphQLServer({
        // @ts-ignore
        schema: mergeSchemas({ schemas }),
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
        }
    });
    console.log("Server is running on http://localhost:4000");

    server.express.get("/confirm/:id", confirmEmail);

    return { app, redis };
};
