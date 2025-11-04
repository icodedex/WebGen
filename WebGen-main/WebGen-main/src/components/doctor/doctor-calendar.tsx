
'use client';

import React, { useState } from 'react';
import type { User, Appointment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { format, startOfWeek, addDays, subDays, isSameDay, getHours, getMinutes, isSameMonth, isToday } from 'date-fns';
import { Button } from '../ui/button';

type TimeSlot = {
  time: string;
  appointments: (Appointment | null)[]; // Array of appointments for each day of the week
};

export function DoctorCalendar({ doctor, appointments }: { doctor: User; appointments: Appointment[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [currentDate]);

  const timeSlots = useMemo(() => {
    if (!doctor.availableHours) return [];

    const slots: TimeSlot[] = [];
    const [startTimeStr, endTimeStr] = doctor.availableHours.split(' - ');
    const [startHour] = startTimeStr.split(':').map(Number);
    const [endHour] = endTimeStr.split(':').map(Number);

    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += 30) {
        const date = new Date();
        date.setHours(h, m, 0, 0);
        const time = format(date, 'hh:mm a');

        const dailyAppointments = weekDays.map(day => {
          return appointments.find(appt => {
            const apptDate = new Date(appt.date);
            const apptHour = getHours(apptDate);
            const apptMinute = getMinutes(apptDate);
            return isSameDay(apptDate, day) && apptHour === h && (m === 0 ? apptMinute < 30 : apptMinute >= 30);
          }) || null;
        });

        slots.push({ time, appointments: dailyAppointments });
      }
    }
    return slots;
  }, [doctor.availableHours, appointments, weekDays]);
  
  const handlePreviousWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };
  
  const calendarTitle = format(weekDays[0], 'MMMM yyyy');
  const nextMonthTitle = format(weekDays[6], 'MMMM yyyy');

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                <div>
                    <CardTitle>
                        {calendarTitle}
                        {!isSameMonth(weekDays[0], weekDays[6]) && ` - ${nextMonthTitle}`}
                    </CardTitle>
                    <CardDescription>
                        Your approved appointments for this week.
                    </CardDescription>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextWeek}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[420px] pr-4">
            <div className="grid grid-cols-8">
                <div className="col-span-1"></div> {/* Time column header */}
                {weekDays.map(day => (
                    <div key={day.toISOString()} className="col-span-1 text-center font-semibold text-xs pb-2 border-b">
                        <p>{format(day, 'EEE')}</p>
                        <p className={cn("text-muted-foreground", isToday(day) && "text-primary font-bold")}>{format(day, 'd')}</p>
                    </div>
                ))}

                {timeSlots.map((slot, index) => (
                    <React.Fragment key={index}>
                        <div className="col-span-1 text-xs text-muted-foreground text-right pr-2 pt-2 border-r border-t">
                            {slot.time}
                        </div>
                        {slot.appointments.map((appt, dayIndex) => (
                            <div 
                                key={dayIndex} 
                                className={cn(
                                    "col-span-1 h-16 border-t p-1 text-xs",
                                    dayIndex < 6 && "border-r"
                                )}
                            >
                                {appt ? (
                                     <div className="bg-primary/20 text-primary-foreground rounded-md p-1 h-full flex flex-col justify-center">
                                        <p className="font-semibold text-primary text-[10px] leading-tight">{appt.patientName}</p>
                                        <p className="text-primary/80 truncate text-[9px] leading-tight">{appt.reason}</p>
                                    </div>
                                ) : (
                                    <div className="bg-muted/30 h-full"></div>
                                )}
                            </div>
                        ))}
                    </React.Fragment>
                ))}

            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
