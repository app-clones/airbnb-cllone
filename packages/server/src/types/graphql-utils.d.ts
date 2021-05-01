import { Redis } from "ioredis";
import { CustomRequest } from "../types/types";

export interface Context {
    redis: Redis;
    url: string;
    req: CustomRequest;
}

export type Resolver = (
    parent: any,
    arguments: any,
    context: Context,
    info: any
) => any;

export type MiddlewareFunc = (
    resolver: Resolver,
    parent: any,
    arguments: any,
    context: Context,
    info: any
) => any;

export interface ResolverMap {
    [key: string]: {
        [key: string]: Resolver;
    };
}
