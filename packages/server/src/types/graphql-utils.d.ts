import { Redis } from "ioredis";
import { CustomRequest } from "../types/types";

export interface ResolverMap {
    [key: string]: {
        [key: string]: (
            parent: any,
            arguments: any,
            context: { redis: Redis; url: string; req: CustomRequest },
            info: any
        ) => any;
    };
}
