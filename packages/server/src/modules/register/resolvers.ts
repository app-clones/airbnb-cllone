import * as argon2 from "argon2";
import { User } from "../../entity/User";
import { MutationRegisterArgs } from "../../types/graphql";
import { ResolverMap } from "../../types/graphql-utils";

export const resolvers: ResolverMap = {
    Query: {
        bugFix: () => "Fixes annoying bug"
    },
    Mutation: {
        register: async (_, { email, password }: MutationRegisterArgs) => {
            const userAlreadyExists = await User.findOne({
                where: { email },
                select: ["id"]
            });

            if (userAlreadyExists) {
                return [
                    {
                        path: "email",
                        message: "Email is already in use"
                    }
                ];
            }

            const hashedPassword = await argon2.hash(password);
            const user = User.create({
                email,
                password: hashedPassword
            });

            await user.save();
            return null;
        }
    }
};
