import { Session } from "express-session";
import { Request } from "express";

export interface CustomSession extends Session {
    userId: string;
}

export interface CustomRequest extends Request {
    session: CustomSession;
}
