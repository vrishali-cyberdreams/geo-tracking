import { accessControl, baseUserStatement } from "./permissions";

export type TRoleLiteral = (typeof roles)[number]["value"];

export const roles = [
  {
    label: "Developer",
    value: "developer",
  },
  {
    label: "Owner",
    value: "owner",
  },
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "User",
    value: "user",
  },
] as const;

export const roleLiterals = roles.map((role) => role.value);

export const developer = accessControl.newRole({
  ...baseUserStatement,
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
    "page"
  ],
  employee: ["list", "create", "update", "delete"]
});

export const owner = accessControl.newRole({
  ...baseUserStatement,
  user: [
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
});

export const admin = accessControl.newRole({
  ...baseUserStatement,
  user: [
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
});

export const user = accessControl.newRole({
  ...baseUserStatement,
});
