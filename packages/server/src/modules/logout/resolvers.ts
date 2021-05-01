import { ResolverMap } from "../../types/graphql-utils";
import { redisSessionPrefix, userSessionIdPrefix } from "../../utils/constants";

export const resolvers: ResolverMap = {
    Query: {
        bugfix: () => "Annoying bug fix"
    },
    Mutation: {
        logout: async (_, __, { req: { session }, redis }) => {
            const { userId } = session;
            if (!userId) return;

            const sessionIds = await redis.lrange(
                `${userSessionIdPrefix}${userId}`,
                0,
                -1
            );

            const promises = [];
            for (let i = 0; i < sessionIds.length; i += 1) {
                promises.push(
                    redis.del(`${redisSessionPrefix}${sessionIds[i]}`)
                );
            }

            await Promise.all(promises);
            return true;
        }
    }
};
