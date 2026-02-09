import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";

export const statements = {
  ...defaultStatements,
  user: [
    // Super admin
    "create-super-admin",
    "update-super-admin",
    "set-super-admin-role",
    "set-super-admin-password",
    "list-super-admin",
    "delete-super-admin",
    // admin
    "create-admin",
    "update-admin",
    "set-admin-role",
    "set-admin-password",
    "delete-admin",
    // user
    "create",
    "list",
    "update",
    "update-self",
    "set-password",
    "set-self-password",
    "set-role",
    "delete",
    "page",
  ],
  employee: ["list", "create", "update", "delete"]
};

export const baseUserStatement = {
  user: ["set-self-password", "update-self"],
  employee: ["list"]
};

export const accessControl = createAccessControl(statements);
