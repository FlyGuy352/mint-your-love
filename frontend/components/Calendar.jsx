import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useRef } from 'react';

export default function Calendar() {
    const calendarRef = useRef(null);
    return (
        <FullCalendar
            innerRef={calendarRef}
            plugins={[timeGridPlugin]}
            editable
            selectable
        />
    );
};