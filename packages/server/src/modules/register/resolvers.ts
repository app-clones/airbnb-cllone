import * as argon2 from "argon2";
import * as yup from "yup";

import { User } from "../../entity/User";
import { MutationRegisterArgs } from "../../types/graphql";
import { ResolverMap } from "../../types/graphql-utils";
import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink";
import { formatYupError } from "../../utils/formatYupError";
import { sendEmail } from "../../utils/sendEmail";
import {
    duplicateEmail,
    invalidEmail,
    shortEmail,
    shortPassword
} from "./errorMessages";

const schema = yup.object().shape({
    email: yup
        .string()
        .min(3, shortEmail)
        .max(255)
        .email(invalidEmail)
        .required()
        .ensure(),
    password: yup.string().min(7, shortPassword).required().ensure()
});

export const resolvers: ResolverMap = {
    Query: {
        bugFix: () => "Fixes annoying bug"
    },
    Mutation: {
        register: async (_, args: MutationRegisterArgs, { redis, url }) => {
            try {
                await schema.validate(args, { abortEarly: false });
            } catch (err) {
                return formatYupError(err);
            }

            const { email, password } = args;

            const userAlreadyExists = await User.findOne({
                where: { email },
                select: ["id"]
            });

            if (userAlreadyExists) {
                return [
                    {
                        path: "email",
                        message: duplicateEmail
                    }
                ];
            }

            const hashedPassword = await argon2.hash(password);
            const user = User.create({
                email,
                password: hashedPassword
            });
            await user.save();

            const confirmLink = await createConfirmEmailLink(
                url,
                user.id,
                redis
            );

            if (process.env.NODE_ENV !== "test")
                await sendEmail(
                    "Confirm Email",
                    email,
                    `Click <a href=${confirmLink}>here</a> to confirm your email for AirBNB`
                );

            return null;
        }
    }
};
