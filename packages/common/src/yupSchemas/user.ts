import * as yup from "yup";

export const shortEmail = "Email must be at least 3 characters long";
export const invalidEmail = "Invalid email";
export const duplicateEmail = "Email is already in use";
export const shortPassword = "Password must be at least 7 characters long";

export const passwordValidationSchema = yup
    .string()
    .min(7, shortPassword)
    .max(255)
    .required(shortPassword);

export const userValidationSchema = yup.object().shape({
    email: yup
        .string()
        .min(3, shortEmail)
        .max(255)
        .email(invalidEmail)
        .required(shortEmail),
    password: passwordValidationSchema
});
