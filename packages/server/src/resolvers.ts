import * as argon2 from "argon2";
import { User } from "./entity/User";
import { ResolverMap } from "./types/graphql-utils";

export const resolvers: ResolverMap = {
    Query: {
        hello: (_, { name }: GQL.IHelloOnQueryArguments) =>
            `Hello ${name || "World!"}`
    },
    Mutation: {
        register: async (
            _,
            { email, password }: GQL.IRegisterOnMutationArguments
        ) => {
            const hashedPassword = await argon2.hash(password);
            const user = User.create({
                email,
                password: hashedPassword
            });

            await user.save();
            return true;
        }
    }
};
