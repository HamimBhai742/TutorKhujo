export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/signup",
  SIGNUP: "/signup",
  DASHBOARD: {
    HOME: "/dashboard",
    PROFILE: "/dashboard/profile",
    USERS: "/dashboard/users",
    SETTINGS: "/dashboard/settings",
    VERIFICATIONS: "/dashboard/verifications",
    TUITIONS: "/dashboard/tuitions",
    PAYMENTS: "/dashboard/payments",
  },
} as const;

export type RoutesType = typeof ROUTES;
