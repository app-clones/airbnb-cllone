import * as yup from "yup";
import argon2 from "argon2";

import {
    MutationForgotPasswordChangeArgs,
    MutationSendForgotPasswordEmailArgs
} from "../../types/graphql";
import { ResolverMap } from "../../types/graphql-utils";
import { forgotPasswordLockAccount } from "../../utils/forgotPasswordLockAccount";
import { createForgotPasswordLink } from "../../utils/createForgotPasswordLink";
import { User } from "../../entity/User";
import { forgotPasswordPrefix } from "../../utils/constants";
import { expiredKeyError } from "./errorMessages";
import { registerPasswordValidation } from "../../utils/yupSchemas";
import { formatYupError } from "../../utils/formatYupError";

const schema = yup.object().shape({ newPassword: registerPasswordValidation });

export const resolvers: ResolverMap = {
    Query: {
        bugfix: () => "Annoying bug fix"
    },
    Mutation: {
        sendForgotPasswordEmail: async (
            _,
            { email }: MutationSendForgotPasswordEmailArgs,
            { redis }
        ) => {
            const user = await User.findOne({ where: { email } });
            if (!user) return true; // If you return false it allows attackers to guess emails and lock random accounts

            await forgotPasswordLockAccount(user.id, redis);

            await createForgotPasswordLink(
                process.env.FRONTEND_HOST!,
                user.id,
                redis
            );

            return true;
        },
        forgotPasswordChange: async (
            _,
            { newPassword, key }: MutationForgotPasswordChangeArgs,
            { redis }
        ) => {
            const redisKey = `${forgotPasswordPrefix}${key}`;

            const userId = await redis.get(`${forgotPasswordPrefix}${key}`);
            if (!userId) return [{ path: "key", message: expiredKeyError }];

            try {
                await schema.validate({ newPassword }, { abortEarly: false });
            } catch (err) {
                return formatYupError(err);
            }

            try {
                await schema.validate({ newPassword }, { abortEarly: false });
            } catch (err) {
                return formatYupError(err);
            }

            const hashedPassword = await argon2.hash(newPassword);

            const updatePromise = User.update(
                { id: userId },
                {
                    forgotPasswordLocked: false,
                    password: hashedPassword
                }
            );

            const deleteKeyPromise = redis.del(redisKey);

            await Promise.all([updatePromise, deleteKeyPromise]);

            return null;
        }
    }
};
