// Note: Zod can be installed and imported here for runtime schema validation.
// E.g., import { z } from "zod";

export const loginSchema = {
  email: {
    required: "Email is required",
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  },
  password: {
    required: "Password is required",
    minLength: 6,
  },
};

export const registerSchema = {
  name: {
    required: "Name is required",
  },
  email: loginSchema.email,
  password: loginSchema.password,
};
