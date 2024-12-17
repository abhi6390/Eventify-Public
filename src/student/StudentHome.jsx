import React, { useState, useEffect, useRef } from 'react';
import supabase from '../supabase/supabase';
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import Loader from '../loader/Loader';
import { toast } from 'react-toastify';

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

const StudentHome = () => {
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
  const [isLoading,setIsLoading] = useState(true)
  const [canAddEvents,setCanAddEvents] = useState(false)
  const [isProfileCreated,setIsProfileCreated]  = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [eventToDelete, setEventToDelete] = useState({ dateKey: null, index: null,event_id:null });
  const [studentName,setStudentName] = useState('')
  const [studentUserId,setStudentUserId] = useState('')
  const [isEventAdded,setIsEventAdded] = useState(false)
  const [isFieldEmpty,setIsFieldEmpty] = useState(false)
  const [branchName,setBranchName] = useState('')
  const [divisionName,setDivisionName] = useState('')
  const [semesterName,setSemesterName] = useState('')

  const navigate = useNavigate()

  const eventColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFA533'];


  
  //   const program_id = useSelector((state)=>(state.student.program_id))
  //   const branch_id = useSelector((state)=>(state.student.branch_id))
  //   const semester_id = useSelector((state)=>(state.student.semester_id))
  //   const division_id = useSelector((state)=>(state.student.division_id))
  //   // console.log(program_id);
  //   // console.log(branch_id);
  //   // console.log(semester_id);
  //   // console.log(division_id);


  //  useEffect(() => {
  // // Set program details once they are fetched
  //   setProgramId(program_id);
  //   setBranchId(branch_id);
  //   setSemesterId(semester_id);
  //   setDivisionId(division_id);
  // }, [program_id, branch_id, semester_id, division_id]);
    
  
  // useEffect(() => {
  //   if (programId && branchId && semesterId && divisionId) {
  //     fetchAllEventDetails(programId, branchId, semesterId, divisionId);
  //   }
  // }, [programId, branchId, semesterId, divisionId]);


  useEffect(()=>{
    if(programId && branchId && semesterId && divisionId)
    fetchAllEventDetails(programId,branchId,semesterId,divisionId)
  },[isEventAdded])

      const getStudentProfileInfo = async(user_id) =>{
      let { data: students_profile, error } = await supabase
        .from('students_profile')
        .select(`user_id,branch_id,semester_id,program_id,user_name,division_id,can_add_events,
          branches(branch_name),semesters(semester_number),divisions(division_name)
          `)
        .eq('user_id',user_id)

        if(students_profile){
            console.log(students_profile);
            if(students_profile.length != 0){

                const user_id= students_profile[0].user_id
                const branch_id=students_profile[0].branch_id
                const semester_id=students_profile[0].semester_id
                const program_id=students_profile[0].program_id
                const user_name=students_profile[0].user_name
                const division_id=students_profile[0].division_id
                // const open_elective_id=students_profile[0].open_elective_id
                // const is_profile_created = students_profile[0].is_profile_created
                const add_events = students_profile[0].can_add_events
                
                const division_name= students_profile[0].divisions.division_name
                const semester_number = students_profile[0].semesters.semester_number
                const branch_name = students_profile[0].branches.branch_name

                setDivisionName(division_name)
                setBranchName(branch_name)
                setSemesterName(semester_number)
                setProgramId(program_id)
                setBranchId(branch_id)
                setDivisionId(division_id)
                setSemesterId(semester_id)
                setCanAddEvents(add_events)
                setStudentName(user_name)
                setStudentUserId(user_id)
                setIsProfileCreated(true)
                setIsLoading(false)

                fetchAllEventDetails(program_id,branch_id,semester_id,division_id)

            }else{
              console.log('no profile');
              setIsProfileCreated(false)
              setIsLoading(false)
              
            }
        }
        else{
            console.error(error);
            setIsLoading(false)
            setIsProfileCreated(false)
            
        }    
    }

    const updateIsEmailSent = async(email)=>{
      
      const { data, error } = await supabase
        .from('welcome_mail_sent')
        .insert([
          { email_id: email },
        ])
        .select()

        if(data){
          console.log("email sent info updated successfull",data);
          
        }else{
          console.log(error);
          
        }
          
    }

   async function sendWelcomeEmail(email) {
  try {
    // Send the request to the Appwrite function
    const response = await fetch(`https://675d241d9e2d3ccef8ea.appwrite.global/?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      mode: 'no-cors', // Disables CORS but prevents access to the response
    });

    // If the request is successful, log success and update the email sent status
    console.log('Request sent successfully',);
    console.log(response);
    
    updateIsEmailSent(email); // Assuming this updates the email sent status

  } catch (error) {
    // Handle any errors during the fetch
    console.error('Error sending welcome email:', error);
  }
}

// Example usage
// sendWelcomeEmail('git21cs076-t@students.git.edu');


    const checkIsWelcomeMailSent = async(email)=>{
      
    let { data: welcome_mail_sent, error } = await supabase
      .from('welcome_mail_sent')
      .select('*')
      .eq('email_id',email);

      if(welcome_mail_sent){
        if(welcome_mail_sent.length){
          return;
        }else{
          sendWelcomeEmail(email)
        }
      }else{
        console.error(error);
        
      }
          
    }


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
            // sendWelcomeMail(email)
            checkIsWelcomeMailSent(email)
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

  const handleSaveEvent = () => {
    const eventKey = formatDate(selectedDate);
    if (eventTitle.trim().length === 0 || eventDescription.trim().length === 0) {
      // alert("Fields cannot be empty");
      setIsFieldEmpty(true)

      return;
    }
    const newEvent = { title: eventTitle, description: eventDescription, user: studentName };
    // console.log(selectedDate);
    

    const newEvents = {
      ...events,
      [eventKey]: [...(events[eventKey] || []), newEvent]
    };

    addEventsToDB(eventTitle,eventDescription)
    setEvents(newEvents);
    setShowPopup(false);
    setEventTitle('');
    setEventDescription('');
    // setIsEventAdded(true)
  };

  const addEventsToDB = async(title,description)=>{
    const eventData = {
      event_date:formatDateToDBFormat(selectedDate),
      event_name:title,
      event_description:description,
      user_id:studentUserId,
      user_name:studentName,
      division_id:divisionId,
      branch_id:branchId,
      semester_id:semesterId,
      program_id:programId
    }

    
      const { data, error } = await supabase
        .from('events_collection')
        .insert([
          eventData
        ])
        .select()

      if(data){
        console.log(data);
        if(data.length){
          toast.success("Event added successfully !!!")
        }
        
      }else{
        console.error(error);
        toast.error("There was an error. Please try again !!!")
        
      }
          
  }

  const removeEventFromDB = async(event_id)=>{
   
    const { error } = await supabase
      .from('events_collection')
      .delete()
      .eq('event_id', event_id)

      if(error){
        console.error(error);
        toast.error("There was an error. Please try again !!!")
        
      }else{
        console.log("event successfully deleted from DB");
        toast.success("Event deleted successfully !!!")
        
      }
          
  }

  const handleDeleteEvent = (dateKey, index,event_id) => {
    const updatedEvents = events[dateKey].filter((_, i) => i !== index);
    const newEvents = { ...events, [dateKey]: updatedEvents };
    if (updatedEvents.length === 0) delete newEvents[dateKey];
    setEvents(newEvents);
    removeEventFromDB(event_id)
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
            {
              canAddEvents &&
              (

            <button
              onClick={() => {setEventToDelete({ dateKey: formatDate(selectedDate), index:index ,
                event_id:event.event_id});
    setShowConfirmation(true);}}
              className="bg-red-500 text-white text-xs px-2 py-1 rounded mt-1 hover:bg-red-600"
            >
              Delete
            </button>
              )
            }
          </div>
        ))
      ) : (
        <p>No events for this day.</p>
      )}
    </div>
  );




const fetchAllEventDetails = async (program_id, branch_id, semester_id, division_id) => {
  try {
    let { data: eventsCollection, error } = await supabase
      .from('events_collection')
      .select(`event_id, event_date, event_name, event_description, user_name`)
      .eq('program_id', program_id)
      .eq('branch_id', branch_id)
      .eq('semester_id', semester_id)
      .eq('division_id', division_id);

    if (error) {
      console.error('Error fetching events:', error.message);
      return;
    }

    // console.log(eventsCollection);
    

    const formattedEvents = (eventsCollection || []).reduce((acc, event) => {
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
  } catch (err) {
    console.error('Unexpected error fetching events:', err);
  }
};

  if(isLoading){
    return(
      <Loader/>
    )
  }else if(!isProfileCreated){
    navigate('/student/profile')

   return(
    <div className='bg-[#0F172A] min-h-screen'>

      <h1>Please complete your profile</h1>
      <button onClick={()=>(navigate('/student/profile'))} className='bg-blue-500 py-1 px-2 m-2'>
        Go to Profile Page
      </button>
      
    </div>
   )
  }
  else{
     return (

      <div className="bg-[#0F172A] min-h-screen pb-10">
      <Header/>
      <div className='text-center text-slate-100 mt-2'>
        <p>Branch : {branchName}</p>
        <p>Semester : {semesterName}</p>
        <p>Division : {divisionName}</p>
      </div>
      <div className='px-2'>
      <div className="max-w-4xl mx-auto my-5 p-5 border rounded-lg text-center ">
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
                {
                  canAddEvents && (

                <button
                  onClick={() => setPopupMode('addEvent')}
                  className={`px-4 py-2 rounded-md ${popupMode === 'addEvent' ? 'bg-sky-600 text-white' : 'bg-sky-800'}`}
                >
                  Add Event
                </button>
                  )
                }
                <button
                  onClick={() => setPopupMode('viewEvents')}
                  className={`${canAddEvents?'px-4 py-2':''} rounded-md ${popupMode === 'viewEvents' ? 'bg-sky-600 text-white' : 'bg-sky-800'}`}
                >
                  {canAddEvents?'View Events':''}
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
                    className="border border-black p-2 mb-2 w-full rounded text-black"
                  />
                  <textarea
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Event Description"
                    className="border border-black p-2 w-full rounded text-black "
                  ></textarea>
                  <button onClick={handleSaveEvent} className="bg-sky-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-sky-600">
                    Save Event
                  </button>
                </>
              ) : (
                renderEventList()
              )}
            </div>
          </div>
        )}

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-700 text-slate-200 p-6 rounded-md w-11/12 max-w-sm text-center">
              <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
              <p className=" mb-4">
                Do you really want to delete this event? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    handleDeleteEvent(eventToDelete.dateKey, eventToDelete.index,eventToDelete.event_id);
                    setShowConfirmation(false);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {isFieldEmpty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-700 text-slate-200 p-6 rounded-md w-11/12 max-w-sm text-center">
              <h3 className="text-lg font-semibold mb-4">Input Fields cannot be empty !!!</h3>
           
              <div className="flex justify-center space-x-4">
                <button
                   onClick={() => setIsFieldEmpty(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  OK
                </button>
         
              </div>
            </div>
          </div>
        )}
      </div>

      </div>
      </div>
    );
  }
};

export default StudentHome;
