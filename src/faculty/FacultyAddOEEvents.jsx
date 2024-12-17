import React, { useEffect, useState,useRef } from 'react';
import supabase from '../supabase/supabase';
import FacultyHeader from '../header/FacultyHeader';
// import { div } from 'framer-motion/client';
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


const FacultyAddOEEvents = () => {
  const [programs, setPrograms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const [openElectives, setOpenElectives] = useState([]);
  const [selectedOE, setSelectedOE] = useState(null)

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);

  const [subject, setSubject] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null);

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [eventToDelete, setEventToDelete] = useState({ dateKey: null, index: null,event_id:null });

  const [userName,setUserName] = useState('')
  const [userId,setUserId] = useState('')
  const [showCalendar,setShowCalendar] = useState(false)
  const [isFieldEmpty,setIsFieldEmpty] = useState(false)
  let subject_id = null


    const eventColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFA533'];

  const getAllPrograms = async () => {
    let { data: programsData, error } = await supabase.from('programs').select('*');
    if (programsData) {
      setPrograms(programsData);
    } else {
      console.error(error);
    }
  };



  // const getAllBranches = async (program_id) => {
  //   let { data: branchesData, error } = await supabase
  //     .from('branches')
  //     .select('*')
  //     .eq('program_id', program_id);

  //   if (branchesData) {
  //     setBranches(branchesData);
  //   } else {
  //     console.error(error);
  //   }
  // };

  const getAllSemesters = async (program_id, branch_id) => {
    let { data: semestersData, error } = await supabase
      .from('semesters')
      .select('*')
      .eq('program_id', program_id)
      .eq('branch_id', branch_id);

    if (semestersData) {
      setSemesters(semestersData);
    } else {
      console.error(error);
    }
  };

  // const getAllDivisions = async (program_id, branch_id, semester_id) => {
  //   let { data: divisionsData, error } = await supabase
  //     .from('divisions')
  //     .select('*')
  //     .eq('program_id', program_id)
  //     .eq('branch_id', branch_id)
  //     .eq('semester_id', semester_id);

  //   if (divisionsData) {
  //     setDivisions(divisionsData);
  //   } else {
  //     console.error(error);
  //   }
  // };

  const getAllOpenElectives = async (program_id,semester_number) => {

    console.log(program_id,semester_number);
    
    
    let { data: open_electives, error } = await supabase
    .from('open_electives_table')
    .select('*')
    .eq('program_id', program_id)
    .eq('semester_number', semester_number)
  

    if(open_electives){
      console.log(open_electives);
      
      setOpenElectives(open_electives)
    }
    else{
      console.error(error);
      
    }
        
  }

  const handleProgramChange = (e) => {
    const programId = e.target.value;
    console.log(programId);
    
    setSemesterValues(programId)
    setSelectedProgram(programId);
    // setSelectedBranch(null);
    // setSelectedSemester(null);
    // setSelectedDivision(null);
    // setBranches([]);
    // setSemesters([]);
    // setDivisions([]);
    // getAllBranches(programId);
  };

  const setSemesterValues = (program_id)=>{
    if(program_id==1){
      const semesters = Array.from({ length: 10 }, (_, index) => index + 1);
      console.log(semesters);
      
      setSemesters(semesters)
    }else {
      const semesters = Array.from({ length: 6 }, (_, index) => index + 1);
      setSemesters(semesters)

    }
  }

  // const handleBranchChange = (e) => {
  //   const branchId = e.target.value;
  //   setSelectedBranch(branchId);
  //   setSelectedSemester(null);
  //   setSelectedDivision(null);
  //   setSemesters([]);
  //   setDivisions([]);
  //   getAllSemesters(selectedProgram, branchId);
  // };

  const handleSemesterChange = (e) => {
    const semesterId = e.target.value;
    setSelectedSemester(semesterId);
    setSelectedDivision(null);
    setDivisions([]);
    getAllOpenElectives(selectedProgram,semesterId)
  };

  const handleDivisionChange = (e) => {
    setSelectedDivision(e.target.value);
  };

  const handleOpenElectiveChange = (e) => {
    setSelectedOE(e.target.value); // Update selected open elective
    console.log(e.target.value);
    subject_id = e.target.value
    
  };
  
  // useEffect(() => {
  //   if (selectedProgram &&  selectedSemester) {
  //     getAllOpenElectives(selectedProgram, selectedSemester); // Fetch electives
  //   }
  // }, [selectedProgram, selectedSemester]); // Trigger fetch when dependencies change
  


  useEffect(() => {
    getAllPrograms();
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
    // const newEvent = { title: eventTitle, description: eventDescription, user: userName };
    // // console.log(selectedDate);
    

    // const newEvents = {
    //   ...events,
    //   [eventKey]: [...(events[eventKey] || []), newEvent]
    // };

    addEventsToDB(eventTitle,eventDescription)
    // setEvents(newEvents);
    setShowPopup(false);
    setEventTitle('');
    setEventDescription('');
    // setIsEventAdded(true)
  };

  const addEventsToDB = async (title, description) => {
    try {
      const eventData = {
        event_date: formatDateToDBFormat(selectedDate), // Ensure this function returns correct DB date format (e.g., 'YYYY-MM-DD')
        event_name: title,
        event_description: description,
        user_id: userId,
        user_name: userName,
        subject_id: selectedOE,

      };
  
      const { data, error } = await supabase
        .from('open_elective_events')
        .insert([eventData])
        .select();
  
      if (error) {
        console.error('Error inserting event:', error.message);
        return;
      }
  
      console.log("Event added successfully:", data);
      toast.success("Event added successfully !!!")
      const newEvent = { title: data[0].event_name, description: data[0].event_description, user: data[0].user_name,event_id:data[0].event_id };
    const eventKey = formatDate(selectedDate);

    const newEvents = {
      ...events,
      [eventKey]: [...(events[eventKey] || []), newEvent]
    };

    setEvents(newEvents)
    } catch (err) {
      console.error('Unexpected error adding event:', err);
      toast.error("There was an error. Please try again !!!")
    }
  };
  

    const removeEventFromDB = async(event_id)=>{
   
    const { error } = await supabase
      .from('open_elective_events')
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

      const getCurrentUserSessionDetails = async()=>{
      try {
        const { data, error } = await supabase.auth.getSession();

        if(error){
          throw error
        }
        if (data && data.session && data.session.user){
          console.log(data.session.user.identities[0].identity_data);
          
          const email = data?.session?.user?.email;
          const user_id = data?.session?.user?.id
          const name = data?.session?.user?.identities[0]?.identity_data?.full_name || data?.session?.user?.identities[0]?.identity_data?.name

          setUserId(user_id)
          setUserName(name)

         
          
        }
      } catch (error) {
        console.error("Error fetching session:", error.message);
        
      }
        
      }

    useEffect(()=>{
      getCurrentUserSessionDetails()
    },[])




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
                className="w-3 h-3 rounded-full"
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


  const fetchAllOEEventDetails = async () => {

    console.log(selectedOE);
    
    try {
      let { data: open_elective_events, error } = await supabase
        .from('open_elective_events')
        .select('event_id, event_date, event_name, event_description, user_name')
        .eq('subject_id', selectedOE);
  
      if (error) {
        console.error('Error fetching open elective events:', error.message);
        return;
      }
  
      console.log(open_elective_events);
  
      const formattedEvents = (open_elective_events || []).reduce((acc, event) => {
        const eventDate = new Date(event.event_date);
        const formattedDate = formatDate(eventDate); // Assuming formatDate is a shared utility function
  
        if (!acc[formattedDate]) acc[formattedDate] = [];
        acc[formattedDate].push({
          title: event.event_name,
          description: event.event_description,
          user: event.user_name,
          event_id: event.event_id,
        });
  
        return acc;
      }, {});
  
      setEvents(formattedEvents);
    } catch (err) {
      console.error('Unexpected error fetching open elective events:', err);
    }
  };
  


  return (
    <div className='bg-[#0F172A] min-h-screen pb-10 '>
    <FacultyHeader/>
    <div className="flex flex-col items-center py-10 px-2">
      <h1 className="text-3xl font-semibold text-slate-100 mb-8">Add Open Elective Events</h1>

      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
        {/* Dropdown for Programs */}
        <div>
          <label className="block text-slate-100 font-medium mb-2">Program:</label>
          <select
            value={selectedProgram || ''}
            onChange={handleProgramChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Program</option>
            {programs.map((program) => (
              <option key={program.program_id} value={program.program_id}>
                {program.program_name}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown for Branches */}
        {/* <div>
          <label className="block text-slate-100 font-medium mb-2">Branch:</label>
          <select
            value={selectedBranch || ''}
            onChange={handleBranchChange}
            disabled={!branches.length}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.branch_id} value={branch.branch_id}>
                {branch.branch_name}
              </option>
            ))}
          </select>
        </div> */}

        {/* Dropdown for Semesters */}
        <div>
          <label className="block text-slate-100 font-medium mb-2">Semester:</label>
          <select
            value={selectedSemester || ''}
            onChange={handleSemesterChange}
            disabled={!semesters.length}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown for OE */}
        <div>
          <label className="block text-slate-100 font-medium mb-2">Open Electives:</label>
          <select
            value={selectedOE || ''}
            onChange={handleOpenElectiveChange}
            disabled={!openElectives.length} // Disable dropdown if no electives available
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            <option value="">Select Open Elective</option>
            {openElectives.map((elective) => (
              <option key={elective.subject_id} value={elective.subject_id}>
                {elective.subject_name} {/* Display the name */}
              </option>
            ))}
          </select>
        </div>


        {/* Button to display the calendar */}
        <button
          onClick={() => {
            fetchAllOEEventDetails();
            setShowCalendar(true);

             // Scroll to the bottom of the page
          setTimeout(() => {
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: 'smooth' // Smooth scrolling
            });
          }, 100); // Optional delay to ensure content is rendered before scrolling
          }}
          disabled={!selectedOE}
           className="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Display Calendar
        </button>

      </div>



      
    </div>
      {/* calendar */}
      {
        showCalendar &&
        (
     
      <div className='px-2'>

      <div className="max-w-4xl mx-auto my-5 p-5  border rounded-lg text-center">
        <div className="flex items-center justify-between mb-3">
          <button onClick={handlePreviousMonth}  className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600">&lt; Previous</button>
          <h2 className="text-xl text-slate-100 font-semibold">{monthNames[currentMonth]} {currentYear}</h2>
          <button onClick={handleNextMonth} className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600">Next &gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-2 p-2 text-lg">
          {daysOfWeek.map(day => (
            <div key={day} className="font-semibold text-gray-300">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">{renderDays()}</div>
        {/* <button onClick={handleToday} className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-600">Today</button> */}
  
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div ref={popupRef} className="bg-gray-800 text-slate-200 p-6 rounded-md w-11/12 max-w-md text-left">
              <div className="flex justify-between mb-4">
                {
                   (

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
                  className={`px-4 py-2 rounded-md ${popupMode === 'viewEvents' ? 'bg-sky-600 text-white' : 'bg-sky-800'}`}
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
                    className="border border-black p-2 mb-2 w-full rounded text-black"
                  />
                  <textarea
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Event Description"
                    className="border border-black p-2 w-full rounded text-black"
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
     

        )
      }
    </div>
  );
};

export default FacultyAddOEEvents;
// const FacultyAddOEEvents = () => {
//   return (
//     <div>FacultyAddOEEvents
//       <p className='bg-red-400'>ADD A DROPDOWN FOR PROGRAMS, BRANCH, SEMesters, DIVISIONS and a button to display calendar </p>
//     </div>
//   )
// }

// export default FacultyAddOEEvents