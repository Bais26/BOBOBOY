"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarSection = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mt-8">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        height="auto"
        dayHeaderClassNames="bg-blue-600 text-white text-sm font-semibold"
        events={[
          {
            title: "WFO",
            start: "2024-08-26",
            allDay: true,
            backgroundColor: "#E8FFF3",
            borderColor: "#E8FFF3",
            textColor: "#047857",
          },
        ]}
        eventContent={(arg) => (
          <div className="flex justify-center">
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
              🏢 {arg.event.title}
            </span>
          </div>
        )}
      />
    </div>
  );
};

export default CalendarSection;
