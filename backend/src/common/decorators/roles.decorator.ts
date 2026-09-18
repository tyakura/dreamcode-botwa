import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
export const SUPER_ADMIN = "SUPER_ADMIN";
export const ADMIN = "ADMIN";
export const BUSINESS_OWNER = "BUSINESS_OWNER";
export const STAFF_CS = "STAFF_CS";