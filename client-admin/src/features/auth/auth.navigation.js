export const getAuthenticatedHome = (role) => (
  role === "ADMIN_ROLE" ? "/dashboard" : "/home"
);
