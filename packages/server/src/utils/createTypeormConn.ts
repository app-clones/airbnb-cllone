import { createConnection, getConnectionOptions } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { User } from "../entity/User";

export const createTypeormConn = async () => {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    return process.env.NODE_ENV === "production"
        ? createConnection({
              ...connectionOptions,
              url: process.env.DATABASE_URL,
              ssl: true,
              entities: [User],
              name: "default"
          } as PostgresConnectionOptions)
        : createConnection({ ...connectionOptions, name: "default" });
};
