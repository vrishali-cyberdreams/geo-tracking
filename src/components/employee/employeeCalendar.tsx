"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Calendar } from "../ui/calendar";
import { CalendarDay, Modifiers } from "react-day-picker";
import { getEmployeeById } from "@/actions/employee.actions";
import { AttendanceWithRelations } from "@/actions/attendance.actions";
import { Punch } from "@prisma/client";

export function EmployeeLocationCalendar({ employeeId }: { employeeId: string }) {
  const [attendance, setAttendance] = useState<AttendanceWithRelations[]>([]);

  useEffect(() => {
    const fetchEmployee = async () => {
      const res = await getEmployeeById(employeeId);
      if (res.data) {
        setAttendance(res.data.attendance);
      }
    };
    fetchEmployee();
  }, [employeeId]);

  // Group by date (sync now)
  // const locationsByDate = useMemo(() => {
  //   const map = new Map<string, Location[]>();
  //   locations.forEach(loc => {
  //     const key = format(new Date(loc.createdAt), "yyyy-MM-dd");
  //     if (!map.has(key)) map.set(key, []);
  //     map.get(key)!.push(loc);
  //   });
  //   return map;
  // }, [locations]);

  const punchesByDate = useMemo(() => {
    const map = new Map<string, Punch[]>();

    attendance.forEach(day => {
      // group key comes from attendance.createdAt
      const key = format(new Date(day.createdAt), "yyyy-MM-dd");

      if (!map.has(key)) map.set(key, []);

      // push all punches of that attendance
      map.get(key)!.push(...day.punch);
    });

    return map;
  }, [attendance]);

  const DayButtonWrapper = useCallback(({
    day,
    modifiers,
    className,
    ...props
  }: {
    day: CalendarDay;
    modifiers: Modifiers;
    className?: string;
  }) => {
    const date = day.date;
    const key = format(date, "yyyy-MM-dd");
    const dayLocs = punchesByDate.get(key);

    if (!dayLocs?.length) {
      return (
        <Button
          variant="ghost"
          className={`h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-primary hover:text-primary-foreground ${className || ''}`}
          {...props}
        >
          {date.getDate()}
        </Button>
      );
    }

    const content = dayLocs.map(loc =>
      `${format(new Date(loc.createdAt), 'hh:mm')} - ${loc.displayName || 'Loading...'}`
    ).join('\n');

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={`h-9 w-9 p-0 font-normal relative aria-selected:opacity-100 hover:bg-primary hover:text-primary-foreground ${className || ''}`}
              {...props}
            >
              {date.getDate()}
              <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="w-64 p-2 whitespace-pre-wrap max-h-48 overflow-auto">
            <p className="font-medium mb-1">Locations:</p>
            <pre className="text-sm">{content}</pre>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }, [punchesByDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline">
          <CalendarIcon className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto">
        <TooltipProvider>
          <Calendar
            mode="single"
            components={{
              DayButton: DayButtonWrapper,
            }}
          />
        </TooltipProvider>
      </PopoverContent>
    </Popover>
  );
}
