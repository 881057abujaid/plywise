import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Please enter a valid email address."),

    password: z
        .string()
        .min(1, "Password is required."),
});

export const signupSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required.")
        .email("Please enter a valid email address."),

    password: z
        .string()
        .min(1, "Password is required.")
        .min(8, "Password must be at least 8 characters."),

    confirmPassword: z
        .string()
        .min(1, "Please confirm your password."),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match.",
});