// import { getUserLocations } from "@/actions/location.actions";
// import { Location } from "@prisma/client";
// import { useEffect, useMemo, useState } from "react";
// import { format } from 'date-fns';
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { Button } from "../ui/button";
// import { CalendarIcon } from "lucide-react";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
// import { Calendar } from "../ui/calendar";
// export function UserLocationCalendar({ userId }: { userId: string }) {
//   const [locations, setLocations] = useState<(Location & {address?: string})[]>([]);

//   useEffect(() => {
//     const fetchLocations = async () => {
//       const res = await getUserLocations(userId);
//       if (res.data) {
//         setLocations(res.data)
//       }
//     }

//     fetchLocations();
//   }, [userId]);

//   // Group locations by date
//   const locationsByDate = useMemo(() => {
//     const map = new Map<string, Location[]>();

//     locations.forEach(async(loc) => {
//       const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.long}`);
//       const key = format(new Date(loc.createdAt), "yyyy-MM-dd");
//       if (!map.has(key)) map.set(key, []);
//       map.get(key)!.push({...loc, address: res.address.residential});
//     });

//     return map;
//   }, [locations]);

//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button size="icon" variant="outline">
//           <CalendarIcon className="w-4 h-4" />
//         </Button>
//       </PopoverTrigger>

//       <PopoverContent className="p-0 w-auto">
//         <TooltipProvider>
//           <Calendar
//             mode="single"
//           />
//         </TooltipProvider>
//       </PopoverContent>
//     </Popover>
//   );
// }

"use client";

import { getUserLocations } from "@/actions/location.actions";
import { Location } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Calendar } from "../ui/calendar";
import { CalendarDay, Modifiers } from "react-day-picker";

type LocationWithAddress = Location & { address?: string };

export function UserLocationCalendar({ userId }: { userId: string }) {
  const [locations, setLocations] = useState<LocationWithAddress[]>([]);
  const [enriched, setEnriched] = useState<LocationWithAddress[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await getUserLocations(userId);
      if (res.data) {
        setLocations(res.data);
        setEnriched(res.data); // Reset enriched
      }
    };
    fetchLocations();
  }, [userId]);

  // Fetch addresses separately, with cache and abort
  useEffect(() => {
    if (locations.length === 0) return;

    abortControllerRef.current = new AbortController();
    const cache = cacheRef.current;
    const signal = abortControllerRef.current.signal;

    const fetchAddress = async (loc: Location) => {
      const key = `${loc.lat},${loc.long}`;
      if (cache.has(key)) {
        setEnriched(prev => 
          prev.map(l => l.id === loc.id ? { ...l, address: cache.get(key) } : l)
        );
        return;
      }

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.long}`,
          { signal }
        );
        const data = await res.json();
        const address = data.address?.road || data.address?.residential || data.display_name?.split(',')[0] || 'Unknown';
        cache.set(key, address);
        setEnriched(prev => 
          prev.map(l => l.id === loc.id ? { ...l, address } : l)
        );
      } catch (e) {
        if ((e as DOMException).name !== 'AbortError') {
          console.error('Address fetch failed:', e);
        }
      }
    };

    locations.forEach(fetchAddress);

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [locations]);

  // Group by date (sync now)
  const locationsByDate = useMemo(() => {
    const map = new Map<string, LocationWithAddress[]>();
    enriched.forEach(loc => {
      const key = format(new Date(loc.createdAt), "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(loc);
    });
    return map;
  }, [enriched]);

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
  const dayLocs = locationsByDate.get(key);
  
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
    `${format(new Date(loc.createdAt), 'hh:mm')} - ${loc.address || 'Loading...'}`
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
}, [locationsByDate]);

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
