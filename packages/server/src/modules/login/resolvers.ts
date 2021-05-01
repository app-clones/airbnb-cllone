import argon2 from "argon2";

import { User } from "../../entity/User";
import { MutationLoginArgs } from "../../types/graphql";
import { ResolverMap } from "../../types/graphql-utils";
import { invalidLogin, confirmEmail } from "./errorMessages";

export const resolvers: ResolverMap = {
    Query: {
        bugFix: () => "Fixes annoying bug"
    },
    Mutation: {
        login: async (_, { email, password }: MutationLoginArgs, { req }) => {
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

            return null;
        }
    }
};
