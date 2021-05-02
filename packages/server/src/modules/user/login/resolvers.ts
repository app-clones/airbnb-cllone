import argon2 from "argon2";

import { User } from "../../../entity/User";
import { MutationLoginArgs } from "../../../types/graphql";
import { ResolverMap } from "../../../types/graphql-utils";
import { userSessionIdPrefix } from "../../../utils/constants";
import {
    invalidLogin,
    confirmEmail,
    forgotPasswordLockedError
} from "./errorMessages";

export const resolvers: ResolverMap = {
    Mutation: {
        login: async (
            _,
            { email, password }: MutationLoginArgs,
            { req, redis }
        ) => {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return [
                    {
                        path: "email",
                        message: invalidLogin
                    }
                ];
            }

            if (!user.confirmed) {
                return [
                    {
                        path: "email",
                        message: confirmEmail
                    }
                ];
            }

            if (user.forgotPasswordLocked) {
                return [
                    {
                        path: "email",
                        message: forgotPasswordLockedError
                    }
                ];
            }

            const valid = await argon2.verify(user.password, password);
            if (!valid) {
                return [
                    {
                        path: "password",
                        message: invalidLogin
                    }
                ];
            }

            req.session.userId = user.id;
            if (req.sessionID) {
                await redis.lpush(
                    `${userSessionIdPrefix}${user.id}`,
                    req.sessionID
                );
            }

            return null;
        }
    }
};
