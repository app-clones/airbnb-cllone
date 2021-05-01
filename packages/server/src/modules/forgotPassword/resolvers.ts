import { ResolverMap } from "../../types/graphql-utils";

export const resolvers: ResolverMap = {
    Query: {
        bugfix: () => "Annoying bug fix"
    },
    Mutation: {
        sendForgotPasswordEmail: async () => {
            // Soon
            return null;
        }
    }
};
