import { Redis } from "ioredis";
import { User } from "../entity/User";
import { removeAllUserSessions } from "./removeAllUserSessions";

export const forgotPasswordLockAccount = async (
    userId: string,
    redis: Redis
) => {
    // Can't login anymore
    await User.update({ id: userId }, { forgotPasswordLocked: true });

    // Remove all sessions
    await removeAllUserSessions(userId, redis);
};
