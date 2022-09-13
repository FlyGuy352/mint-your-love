import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useState, useRef } from 'react';
import MintNewDayModal from './MintNewDayModal';

export default function Calendar({ collections, allOwnedEventTokens }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const calendarRef = useRef(null);
    return (
        <>
            <FullCalendar
                innerRef={calendarRef}
                plugins={[dayGridPlugin]}
                editable
                selectable
                customButtons={{
                    commemorate: {
                        text: 'Commemorate',
                        click: () => {
                            setIsModalOpen(true)
                        },
                    },
                }}
                headerToolbar={{
                    left: 'commemorate',
                    center: 'title',
                    right: 'today prev,next'
                }}
                events={allOwnedEventTokens}
            />
            {isModalOpen && <MintNewDayModal collections={collections} setIsOpen={setIsModalOpen} />}
        </>
    );
};