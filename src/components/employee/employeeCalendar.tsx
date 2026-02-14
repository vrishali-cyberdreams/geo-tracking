"use client";

import { useCallback, useMemo } from "react";
import { format } from 'date-fns';
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Calendar } from "../ui/calendar";
import { CalendarDay, Modifiers } from "react-day-picker";
import { AttendanceWithRelations } from "@/actions/attendance.actions";
import { Punch } from "@prisma/client";
import { formatMinutes } from "@/utils/generateMonthlyReport";

export function EmployeeLocationCalendar({ attendance, selectedDate }: { attendance: AttendanceWithRelations[]; selectedDate: Date; }) {
  // const [attendance, setAttendance] = useState<AttendanceWithRelations[]>([]);

  // useEffect(() => {
  //   const fetchEmployee = async () => {
  //     const res = await getEmployeeById(employeeId);
  //     if (res.data) {
  //       setAttendance(res.data.attendance);
  //     }
  //   };
  //   fetchEmployee();
  // }, [employeeId]);

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

  const attendanceByDate = useMemo(() => {
    const map = new Map<string, AttendanceWithRelations>();

    attendance.forEach(day => {
      const key = format(new Date(day.createdAt), "yyyy-MM-dd");
      map.set(key, day);
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
    const attendance = attendanceByDate.get(key);

    if (!dayLocs?.length) {
      return (
        <Button
          variant="ghost"
          className={`h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-primary hover:text-primary-foreground ${className || ''}`}
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
              className={`h-9 w-full p-0 font-normal relative aria-selected:opacity-100 hover:bg-primary hover:text-primary-foreground ${className || ''}`}
              {...props}
            >
              {date.getDate()}
              <span className="absolute bottom-1 right-4 w-2 h-2 bg-blue-500 rounded-full" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="w-64 p-2 whitespace-pre-wrap max-h-48 overflow-auto">
            <p className="font-medium mb-1">Punches:</p>
            <pre className="text-sm mb-2">{content}</pre>

            <p className="font-medium mb-1">Working Hours: <span className="font-normal text-sm">{formatMinutes(attendance?.totalWorkMinutes ?? 0)}</span></p>
            <p className="font-medium mb-1">Overtime Hours: <span className="font-normal text-sm">{formatMinutes(attendance?.overtimeMinutes ?? 0)}</span></p>
            <p className="font-medium mb-1">Leave Status: <span className="font-normal text-sm">{attendance?.leaveStatus == 'NONE' ? 'PRESENT': attendance?.leaveStatus}</span></p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }, [punchesByDate, attendanceByDate]);

  return (
    <div className="border p-4 rounded-xl">
      <Calendar
        mode="single"
        month={selectedDate}
        onMonthChange={() => { }}
        components={{
          DayButton: DayButtonWrapper,
        }}
        formatters={{
          formatWeekdayName: (date) => {
            return date.toLocaleDateString('en-US', { weekday: 'long' });
          },
        }}
        className="w-full [&_table]:w-full [&_tbody]:gap-0 [&_tr]:gap-0"
        classNames={{
          months: "w-full",
          month: "w-full space-y-2", // control spacing between caption and grid
          table: "w-full border-collapse",
          head_row: "flex w-full",
          head_cell: "flex-1 text-center",
          row: "flex w-full", // removes gap between rows
          cell: "flex-1 p-0", // removes padding, lets day button control spacing
          day: "w-full h-9", // controls height of each day cell
        }}
        showOutsideDays={false}
        captionLayout="label"
        fromMonth={selectedDate}
        toMonth={selectedDate}
      />
    </div>
  );
}
