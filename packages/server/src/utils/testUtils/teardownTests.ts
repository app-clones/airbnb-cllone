import { getConnection } from "typeorm";

export default async () => {
    //@ts-ignore
    await global.__SERVER_APP__.close();
    //@ts-ignore
    await global.__REDIS__.disconnect();
    await getConnection().close();
};
