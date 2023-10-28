import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import { useSwipeable } from 'react-swipeable';
import Holidays from 'date-holidays';
import AddEventForm from './AddEventForm';
import EventModal from './EventModal';
import EventList from './EventList';
import styled from 'styled-components';



const StyledCalendar = styled.div`
  @media (max-width: 768px) {
    .fc-prev-button, .fc-next-button {
      display: none;
    }

    .fc-header-toolbar {
      .fc-center {
        order: 2;
      }
      .fc-left {
        order: 1;
        flex: 1;
      }
      .fc-right {
        order: 3;
      }
      .App {
  position: relative;
  min-height: 100vh;
  padding-bottom: 50px;
}
.fc-footer-toolbar {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

    }
    
    
    .search-form-container {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 5;
  }

  .fc-addEvent-button {
    font-weight: bold; 
    font-size: 1rem; 
    padding-top: 6px;
    
  }
  }
`;




const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;


const ModalContainer = styled.div`
  background-color: white;
  padding: 10px 20px;
  border-radius: 10px;
  width: 70%;
  max-width: 500px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
    max-height: 80vh; 
  h2 {
    font-size: px;
  }
  input, textarea {
        font-size: 16px;
    }
`;




function Calendar() {
    const calendarRef = useRef(null);
    const hd = new Holidays('JP');
    const [isAddEventModalOpen, setAddEventModalOpen] = useState(false);
    const [events, setEvents] = useState([
    ]);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEventListOpen, setEventListOpen] = useState(false);
    const handleSwipeLeft = () => {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.next();
    };

    const handleSwipeRight = () => {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.prev();
    };

    const handlers = useSwipeable({
        onSwipedLeft: handleSwipeLeft,
        onSwipedRight: handleSwipeRight,
    });

    const handleEventAdded = (newEvent) => {
        const calendarApi = calendarRef.current.getApi();
        const currentEvents = calendarApi.getEvents();
        const newId = currentEvents.length > 0 ? Math.max(...currentEvents.map(e => e.id)) + 1 : 1;
        calendarApi.addEvent({
            ...newEvent,
            id: newId
        });
        setAddEventModalOpen(false);
    };

    const openAddEventModal = () => {
        setAddEventModalOpen(true);
    };

    const closeAddEventModal = () => {
        setAddEventModalOpen(false);
    };


    const handleEventClick = (info) => {
        info.jsEvent.preventDefault();
        console.log(info.event);
        setSelectedEvent(info.event);
        console.log(info.event._instance.range.start);
        console.log(info.event._instance.range.end);

    };

    const handleEditEvent = (updatedEvent) => {
        console.log(updatedEvent);

        selectedEvent.setProp('title', updatedEvent.title);
        selectedEvent.setExtendedProp('location', updatedEvent.extendedProps.location);
        selectedEvent.setExtendedProp('url', updatedEvent.extendedProps.url);
        selectedEvent.setExtendedProp('memo', updatedEvent.extendedProps.memo);

        console.log("Before:", selectedEvent.start, selectedEvent.end);

        selectedEvent.setStart(new Date(updatedEvent.start));
        selectedEvent.setEnd(new Date(updatedEvent.end));

        console.log("After:", selectedEvent.start, selectedEvent.end);

        setSelectedEvent(null);
    };




    const handleDeleteEvent = () => {
        selectedEvent.remove();
        setSelectedEvent(null);
    };


    const openEventList = () => {
        const calendarApi = calendarRef.current.getApi();
        const currentEvents = calendarApi.getEvents();
        console.log(currentEvents);
        const formattedEvents = currentEvents.map(e => ({
            id: e.id,
            title: e.title,
            start: e.startStr,
            end: e.endStr,
            startStr: e.startStr,
            endStr: e.endStr,
            location: e.extendedProps.location,
            url: e.extendedProps.url,
            memo: e.extendedProps.memo,
            extendedProps: {
                url: e.extendedProps.url,
                location: e.extendedProps.location,
                memo: e.extendedProps.memo
            }
        }));
        setEvents(formattedEvents);
        setEventListOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeEventListModal = () => {
        setEventListOpen(false);
        // ボディのスクロールを有効化
        document.body.style.overflow = '';
    };
    const handleEditEventFromList = (eventToEdit) => {
        // FullCalendarのイベントとして取得する
        const calendarApi = calendarRef.current.getApi();
        const fcEvent = calendarApi.getEventById(eventToEdit.id);
        
        // EventModalを表示するために、選択されたイベントを設定する
        setSelectedEvent(fcEvent);
        // 予定一覧モーダルを閉じる
        setEventListOpen(false);
    };
    



    return (
        <StyledCalendar>
            <div className="App" {...handlers}>
                <FullCalendar
                    height="auto"
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale={jaLocale}
                    // timezone="local"
                    headerToolbar={{
                        left: 'title',
                        center: 'prev,next',
                        right: 'addEvent'
                    }}
                    footerToolbar={{
                        left: '',
                        center: 'today,day,week,month,eventList',
                        right: ''
                    }}
                    customButtons={{
                        addEvent: {
                            text: '＋',
                            click: openAddEventModal
                        },

                        today: {
                            text: '　今日　',
                            click: function () {
                                const calendarApi = calendarRef.current.getApi();
                                calendarApi.today();
                            }
                        },
                        day: {
                            text: '　日　',
                            click: function () {
                                const calendarApi = calendarRef.current.getApi();
                                calendarApi.changeView('timeGridDay');
                            }
                        },
                        week: {
                            text: '　週　',
                            click: function () {
                                const calendarApi = calendarRef.current.getApi();
                                calendarApi.changeView('timeGridWeek');
                            }
                        },
                        month: {
                            text: '　月　',
                            click: function () {
                                const calendarApi = calendarRef.current.getApi();
                                calendarApi.changeView('dayGridMonth');
                            }
                        },
                        eventList: {
                            text: '　一覧　',
                            click: openEventList
                        }

                    }}
                    dayCellContent={(args) => {
                        if (args.view.type === 'dayGridMonth') {
                            return args.date.getDate();
                        }
                    }}
                    events={events}
                    dayCellDidMount={(info) => {
                        if (hd.isHoliday(info.date)) {
                            info.el.style.color = 'red';
                        }
                    }}
                    eventClick={handleEventClick}
                    dayHeaderContent={(args) => {
                        if (args.view.type === 'timeGridWeek') {
                            const dayOfMonth = args.date.getDate();
                            const dayOfWeek = args.date.toLocaleDateString('ja-JP', { weekday: 'short' });
                            return `${dayOfMonth}（${dayOfWeek}）`;
                        }
                        if (args.view.type === 'dayGridMonth') {
                            return args.date.toLocaleDateString('ja-JP', { weekday: 'short' });
                        }
                    }}
                    views={{
                        timeGridWeek: {
                            titleFormat: { year: 'numeric', month: 'long' }
                        }
                    }}
                />

                {isAddEventModalOpen && (
                    <ModalBackground>
                        <ModalContainer>
                            <AddEventForm onClose={closeAddEventModal} onAddEvent={handleEventAdded} />
                        </ModalContainer>
                    </ModalBackground>
                )}

                {isEventListOpen && (
                    <ModalBackground>
                        <ModalContainer>
                        <EventList events={events} onClose={closeEventListModal} onEditEvent={handleEditEventFromList} />
                        </ModalContainer>
                    </ModalBackground>
                )}

                {selectedEvent && (
                    <ModalBackground>
                        <ModalContainer>
                            <EventModal
                                event={selectedEvent}
                                onClose={() => setSelectedEvent(null)}
                                onDelete={handleDeleteEvent}
                                onEdit={handleEditEvent}
                            />
                        </ModalContainer>
                    </ModalBackground>
                )}

            </div>
        </StyledCalendar>
    );
}

export default Calendar;