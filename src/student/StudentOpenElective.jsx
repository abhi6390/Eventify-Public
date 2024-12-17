import React, { useEffect, useState,useRef } from 'react';
import supabase from '../supabase/supabase';
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import Loader from '../loader/Loader';


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

const formatDateToDBFormat = (date)=>{
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

const StudentOpenElective = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [events, setEvents] = useState({});
    const [popupMode, setPopupMode] = useState('viewEvents'); 
    const popupRef = useRef(null); 
  
    const [programId,setProgramId] = useState('')
    const [branchId,setBranchId] = useState('')
    const [semesterId,setSemesterId] = useState('')
    const [divisionId,setDivisionId] = useState('')
    const [subject_id, setSubjectId ] = useState(null)
    const [isLoading,setIsLoading] = useState(true)
    const [canAddEvents,setCanAddEvents] = useState(false)
    const [isProfileCreated,setIsProfileCreated]  = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [eventToDelete, setEventToDelete] = useState({ dateKey: null, index: null,event_id:null });
    const [studentName,setStudentName] = useState('')
    const [studentUserId,setStudentUserId] = useState('')
    const [isEventAdded,setIsEventAdded] = useState(false)
    const [subjectName,setSubjectName] = useState('')
  
    const navigate = useNavigate()
  
    const eventColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFA533'];

    const getStudentProfileInfo = async (user_id) => {
        try {
          let { data: students_profile, error } = await supabase
            .from('students_profile')
            .select(`
              user_id,branch_id,semester_id,program_id,user_name,subject_id,can_add_events,
              open_electives_table(subject_name)
              `)
            .eq('user_id', user_id);
      
          if (error) {
            console.error("Error fetching student profile:", error.message);
            setIsLoading(false);
            setIsProfileCreated(false);
            return;
          }
      
          if (students_profile && students_profile.length !== 0) {
            console.log("Student profile:", students_profile);
            const user_id = students_profile[0].user_id;
            const branch_id = students_profile[0].branch_id;
            const semester_id = students_profile[0].semester_id;
            const program_id = students_profile[0].program_id;
            const user_name = students_profile[0].user_name;
            const subject_id = students_profile[0]?.subject_id;
            const add_events = students_profile[0].can_add_events;
            const subject_name = students_profile[0].open_electives_table.subject_name
      
            // Set state values
            setSubjectName(subject_name)
            setProgramId(program_id);
            setBranchId(branch_id);
            setSubjectId(subject_id);
            setSemesterId(semester_id);
            setCanAddEvents(add_events);
            setStudentName(user_name);
            setStudentUserId(user_id);
            setIsProfileCreated(true);
            setIsLoading(false);
      
            // Log details before calling fetchAllEventDetails
            // console.log("Fetching events with:", { program_id, semester_id, subject_id });
            fetchAllEventDetails(subject_id);
          } else {
            console.log("No profile found.");
            setIsProfileCreated(false);
            setIsLoading(false);
          }
        } catch (err) {
          console.error("Unexpected error fetching student profile:", err);
          setIsLoading(false);
          setIsProfileCreated(false);
        }
      };
      

const getCurrentUserSessionDetails = async()=>{
    try {
      const { data, error } = await supabase.auth.getSession();

      if(error){
        throw error
      }
      if (data && data.session && data.session.user){
        console.log(data);
        
        const email = data?.session?.user?.email;
        const user_id = data?.session?.user?.id

        if(!email.includes('@students.git.edu')){
          navigate('/unauthorised')
          return
        }
        if(user_id){
          getStudentProfileInfo(user_id)
        }
      }else{
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error fetching session:", error.message);
      setIsLoading(false)
      
    }
      
    }

  useEffect(()=>{
    getCurrentUserSessionDetails()
  },[])

  const fetchAllEventDetails = async (subject_id) => {
    try {
    //   console.log("Fetching open elective events for:", {
    //     program_id,
    //     semester_id,
    //     subject_id,
    //   });
  
      let { data: open_elective_events, error } = await supabase
        .from('open_elective_events')
        .select(`event_id, event_date, event_name, event_description, user_name
          `)
        .eq('subject_id', subject_id);
  
      if (error) {
        console.error("Error fetching events:", error.message);
        return;
      }
  
      if (!open_elective_events || open_elective_events.length === 0) {
        console.log("No open elective events found.");
        setEvents({});
        return;
      }
  
      console.log("Open elective events:", open_elective_events);
  
    const formattedEvents = (open_elective_events || []).reduce((acc, event) => {
      const eventDate = new Date(event.event_date);
      const formattedDate = formatDate(eventDate);

      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push({
        title: event.event_name,
        description: event.event_description,
        user: event.user_name,
        event_id:event.event_id
      });

      return acc;
    }, {});

    setEvents(formattedEvents);
    //   console.log("Formatted Events:", formattedEvents);
    } catch (err) {
      console.error("Unexpected error fetching events:", err);
    }
  };
  
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
    setPopupMode('viewEvents');
    setShowPopup(true);
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
          className={`p-2 bg-blue-100 rounded-md hover:bg-sky-200 cursor-pointer ${isToday ? 'bg-sky-500 text-white font-bold hover:text-black' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div>{day}</div>
          <div className="flex justify-center space-x-1 mt-1">
            {dateEvents.map((_, index) => (
              <span
                key={index}
                className="w-1.5 h-3 rounded-t-full rounded-b-full"
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
            
          </div>
        ))
      ) : (
        <p>No events for this day.</p>
      )}
    </div>
  );


  if(isLoading){
    return(
      <Loader/>
    )
  }
  if(!subject_id){
    return(
      <>
      <div className='bg-[#0F172A] min-h-screen'>
      <Header/>
      <h1 className='text-2xl text-center text-slate-100 pt-20'>You have not opted for any open electives. </h1>
      </div>
      </>
    )
  }
  if(!isProfileCreated){
    navigate('/student/profile')
  }


  return (
    <div className='bg-[#0F172A] min-h-screen pb-10'>
      <Header/>

      <p className='text-2xl text-center text-slate-100 mt-3'>{subjectName}</p>
      <div className='px-2'>

      <div className="max-w-4xl mx-auto my-5 p-5 border rounded-lg text-center">
        <div className="flex items-center justify-between mb-3">
          <button onClick={handlePreviousMonth} className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600">&lt; Previous</button>
          <h2 className="text-xl text-slate-200 font-semibold">{monthNames[currentMonth]} {currentYear}</h2>
          <button onClick={handleNextMonth} className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600">Next &gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-2 p-2 text-lg">
          {daysOfWeek.map(day => (
            <div key={day} className="font-semibold text-gray-300">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">{renderDays()}</div>
        <button onClick={handleToday} className="bg-sky-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-sky-600">Today</button>

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={popupRef} className="bg-gray-800 text-slate-200 p-6 rounded-md w-11/12 max-w-md text-left">
              <div className="flex justify-between mb-4">
                <button
                  onClick={() => setPopupMode('viewEvents')}
                  className={` rounded-md ${popupMode === 'viewEvents' ? 'bg-sky-600 text-white' : 'bg-sky-800'}`}
                >
                  
                </button>
                <button onClick={() => setShowPopup(false)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                  Close
                </button>
              </div>
              {popupMode === 'viewEvents' && renderEventList()}
            </div>
          </div>
        )}


      </div>
      </div>
</div>
    
  )
}

export default StudentOpenElective