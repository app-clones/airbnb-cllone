import { MiddlewareFunc, Resolver } from "../types/graphql-utils";

export const createMiddleware = (
    middlewareFunc: MiddlewareFunc,
    resolverFunc: Resolver
) => (parent: any, args: any, context: any, info: any) =>
    middlewareFunc(resolverFunc, parent, args, context, info);
