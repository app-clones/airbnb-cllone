import { ResolverMap } from "../../types/graphql-utils";

export const resolvers: ResolverMap = {
    Query: {
        bugfix: () => "Annoying bug fix"
    },
    Mutation: {
        logout: (_, __, { req: { session } }) =>
            new Promise((res) =>
                session.destroy((err) => {
                    if (err) {
                        console.log("logout error: ", err);
                    }

                    res(true);
                })
            )
    }
};
