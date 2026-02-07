"use client";

import { UserLocationCalendar } from "../userCalendar";

export function UsersActions({
  userId,
}: {
  userId: string;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      <UserLocationCalendar userId={userId} />
    </div>
  );
}
