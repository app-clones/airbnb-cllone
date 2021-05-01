import * as yup from "yup";
import { shortPassword } from "../modules/shared/sharedErrorMessages";

export const registerPasswordValidation = yup
    .string()
    .min(3, shortPassword)
    .max(255);
