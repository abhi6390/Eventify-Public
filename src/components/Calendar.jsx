import React, { useState, useEffect, useRef } from 'react';
import supabase from '../supabase/supabase';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [events, setEvents] = useState({});
  const [popupMode, setPopupMode] = useState('addEvent'); 
  const popupRef = useRef(null); 

  const eventColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFA533'];

  useEffect(() => {
    fetchAllEventDetails();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const handleDateClick = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
    setEventTitle('');
    setEventDescription('');
    setPopupMode('addEvent');
    setShowPopup(true);
  };

  const handleSaveEvent = () => {
    const eventKey = formatDate(selectedDate);
    if (eventTitle.trim().length === 0 || eventDescription.trim().length === 0) {
      alert("Fields cannot be empty");
      return;
    }
    const newEvent = { title: eventTitle, description: eventDescription, user: 'Current User' };

    const newEvents = {
      ...events,
      [eventKey]: [...(events[eventKey] || []), newEvent]
    };

    setEvents(newEvents);
    setShowPopup(false);
    setEventTitle('');
    setEventDescription('');
  };

  const handleDeleteEvent = (dateKey, index) => {
    const updatedEvents = events[dateKey].filter((_, i) => i !== index);
    const newEvents = { ...events, [dateKey]: updatedEvents };
    if (updatedEvents.length === 0) delete newEvents[dateKey];
    setEvents(newEvents);
  };

  const renderDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="invisible"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      const dateKey = formatDate(new Date(currentYear, currentMonth, day));
      const dateEvents = Array.isArray(events[dateKey]) ? events[dateKey] : [];

      days.push(
        <div
          key={day}
          className={`p-2 bg-blue-100 rounded-md hover:bg-blue-200 cursor-pointer ${isToday ? 'bg-green-500 text-white font-bold' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div>{day}</div>
          <div className="flex justify-center space-x-1 mt-1">
            {dateEvents.map((_, index) => (
              <span
                key={index}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: eventColors[index % eventColors.length] }}
              ></span>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderEventList = () => (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Events on {formatDate(selectedDate)}</h4>
      {events[formatDate(selectedDate)]?.length > 0 ? (
        events[formatDate(selectedDate)].map((event, index) => (
          <div key={index} className="p-2 border rounded mt-2">
            <p className="font-semibold">{event.title}</p>
            <p>{event.description}</p>
            <p className="text-sm text-gray-500">Added by: {event.user}</p>
            <button
              onClick={() => handleDeleteEvent(formatDate(selectedDate), index)}
              className="bg-red-500 text-white text-xs px-2 py-1 rounded mt-1 hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No events for this day.</p>
      )}
    </div>
  );

  const fetchAllEventDetails = async () => {
    let { data: eventsCollection, error } = await supabase
      .from('events_collection')
      .select('event_id, event_date, event_name, event_description, user_name');

    if (error) {
      console.error('Error fetching events:', error);
      return;
    }

    const formattedEvents = eventsCollection.reduce((acc, event) => {
      const eventDate = new Date(event.event_date);
      const formattedDate = formatDate(eventDate); 

      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push({
        title: event.event_name,
        description: event.event_description,
        user: event.user_name
      });

      return acc;
    }, {});

    setEvents(formattedEvents);
  };

  return (
    <div className="max-w-4xl mx-auto my-5 p-5 border rounded-lg text-center">
      <div className="flex items-center justify-between mb-3">
        <button onClick={handlePreviousMonth} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">&lt; Previous</button>
        <h2 className="text-xl font-semibold">{monthNames[currentMonth]} {currentYear}</h2>
        <button onClick={handleNextMonth} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Next &gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-2 p-2 text-lg">
        {daysOfWeek.map(day => (
          <div key={day} className="font-semibold text-gray-700">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">{renderDays()}</div>
      <button onClick={handleToday} className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-600">Today</button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={popupRef} className="bg-white p-6 rounded-md w-11/12 max-w-md text-left">
            <div className="flex justify-between mb-4">
              <button
                onClick={() => setPopupMode('addEvent')}
                className={`px-4 py-2 rounded-md ${popupMode === 'addEvent' ? 'bg-green-800 text-white' : 'bg-gray-200'}`}
              >
                Add Event
              </button>
              <button
                onClick={() => setPopupMode('viewEvents')}
                className={`px-4 py-2 rounded-md ${popupMode === 'viewEvents' ? 'bg-green-800 text-white' : 'bg-gray-200'}`}
              >
                View Events
              </button>
              <button onClick={() => setShowPopup(false)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Close
              </button>
            </div>
            {popupMode === 'addEvent' ? (
              <>
                <h3 className="text-lg font-semibold mb-4">Add Event on {formatDate(selectedDate)}</h3>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Event Title"
                  className="border p-2 mb-2 w-full rounded"
                />
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Event Description"
                  className="border p-2 w-full rounded"
                ></textarea>
                <button onClick={handleSaveEvent} className="bg-green-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-green-600">
                  Save Event
                </button>
              </>
            ) : (
              renderEventList()
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
