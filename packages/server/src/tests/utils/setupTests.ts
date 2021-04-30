import { AddressInfo } from "node:net";
import { startServer } from "../../startServer";

export default async () => {
    const { app, redis } = await startServer();
    // @ts-ignore
    global.__SERVER_APP__ = app;
    // @ts-ignore
    global.__REDIS__ = redis;
    process.env.TEST_HOST = `http://localhost:${
        (app.address() as AddressInfo)?.port
    }`;
};
