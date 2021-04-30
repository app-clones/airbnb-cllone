import { startServer } from "../../startServer";

export default async () => {
    const { app, redis } = await startServer();
    // @ts-ignore
    global.__SERVER_APP__ = app;
    // @ts-ignore
    global.__REDIS__ = redis;
};
