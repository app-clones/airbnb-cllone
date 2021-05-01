import { User } from "../../entity/User";
import { ResolverMap } from "../../types/graphql-utils";
import { createMiddleware } from "../../utils/createMiddleware";
import middleware from "./middleware";

export const resolvers: ResolverMap = {
    Query: {
        me: createMiddleware(middleware, (_, __, { req }) =>
            User.findOne({ where: { id: req.session.userId } })
        )
    }
};
