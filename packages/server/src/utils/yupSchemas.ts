import * as yup from "yup";
import { shortPassword } from "../modules/user/shared/sharedErrorMessages";
export const registerPasswordValidation = yup
    .string()
    .min(7, shortPassword)
    .max(255)
    .required(shortPassword);
