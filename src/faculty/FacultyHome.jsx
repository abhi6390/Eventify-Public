import React, { useEffect, useState } from 'react';
import supabase from '../supabase/supabase';
import { Link, useNavigate } from 'react-router-dom';
import FacultyHeader from '../header/FacultyHeader';
import Loader from '../loader/Loader';


function FacultyHome() {
  const [isFacultyProfileCreated, setIsFacultyProfileCreated] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [semester, setSemester] = useState(null);
  const [division, setDivision] = useState(null);

  const [program_id, setProgramId] = useState(null);
  const [branch_id, setBranchId] = useState(null);
  const [loading,setLoading] = useState(true)

  const navigate= useNavigate()
  // Fetch current user session details
  const getCurrentUserSessionDetails = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (data.session) {
      const user_id = data.session.user.id;
      const session = data.session
      console.log(session);
      
      const user = session.user;
      if(session == null){
        setLoading(false)
        setIsFacultyProfileCreated(false)
      }

      console.log(user.email);
      
      
      if (!user.email.includes('@git.edu')) {
        navigate('/unauthorised');
      } else {
        getFacultyProfileInfo(user_id);
        }
        

    } else {
      console.error(error);
      setLoading(false)
    }
  };

  // Fetch faculty profile information
  const getFacultyProfileInfo = async (user_id) => {
    let { data: faculty_profile, error } = await supabase
      .from('faculty_profile')
      .select('*')
      .eq('user_id', user_id);

    if (faculty_profile && faculty_profile.length) {
      setProgramId(faculty_profile[0].program_id);
      setBranchId(faculty_profile[0].branch_id);
      setIsFacultyProfileCreated(true);
      getSemestersDetails(faculty_profile[0].program_id, faculty_profile[0].branch_id);
    } else {
      console.error(error);
      setIsFacultyProfileCreated(false)
    }

    setLoading(false)
  };

  // Fetch semesters based on program and branch IDs
  const getSemestersDetails = async (program_id, branch_id) => {
    let { data: semesters, error } = await supabase
      .from('semesters')
      .select('*')
      .eq('program_id', program_id)
      .eq('branch_id', branch_id);

    if (semesters) {
      setSemesters(semesters);
    } else {
      console.error(error);
    }
  };

  // Fetch divisions based on selected semester
  const getDivisionsDetails = async (semester_id) => {
    let { data: divisions, error } = await supabase
      .from('divisions')
      .select('*')
      .eq('semester_id', semester_id);

    if (divisions) {
      setDivisions(divisions);
    } else {
      console.error(error);
    }
  };

  // Handle semester selection and fetch corresponding divisions
  const handleSemesterChange = (e) => {
    const selectedSemester = e.target.value;
    setSemester(selectedSemester);
    getDivisionsDetails(selectedSemester);
  };

  useEffect(() => {
    getCurrentUserSessionDetails();
  }, []);

  // Function stubs for card actions
  const handleAddEvent = () => {
    alert("Add Event clicked");
  };

  const handleProvideAccess = () => {
    // alert("Provide Access to Student clicked");
  };

  const handleAddOpenElectiveEvent = () => {
    alert("Add Open Elective Event clicked");
  };


  if(loading){
    return (
      <Loader/>
    )
  }
  if(!isFacultyProfileCreated){
    navigate('/faculty/profile')
    return null;
  }else{

    return (
      <div className='bg-[#0F172A]  min-h-screen'>
      <FacultyHeader/>
      <div className="flex flex-col items-center p-6  ">
        {/* <h1 className='bg-red-400'> add program, add branch dropdowns</h1> */}
        {/* {isFacultyProfileCreated ? ( */}
  
          <div className="bg-gray-800 p-8 mt-10 shadow-md rounded-lg w-full max-w-md">
            
            {/* <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Select Semester and Division</h2> */}
  
            {/* Semester Dropdown */}
            {/* <div className="mb-4">
              <label htmlFor="semester" className="block text-gray-600 font-medium mb-2">Semester:</label>
              <select
                id="semester"
                value={semester || ""}
                onChange={handleSemesterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="" disabled>Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem.semester_id} value={sem.semester_id}>
                    {sem.semester_number}
                  </option>
                ))}
              </select>
            </div>
  
            
            <div className="mb-4">
              <label htmlFor="division" className="block text-gray-600 font-medium mb-2">Division:</label>
              <select
                id="division"
                value={division || ""}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                disabled={!semester} // Disable if no semester is selected
              >
                <option value="" disabled>Select Division</option>
                {divisions.map((div) => (
                  <option key={div.division_id} value={div.division_id}>
                    {div.division_name}
                  </option>
                ))}
              </select>
            </div> 
  
            {/* Action Cards */}
            <div className="grid gap-4 mt-6">
              <Link to= '/faculty/addevent'>
              <div
                
                className="cursor-pointer p-4 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600"
              >
                Add Event
              </div>
              </Link>
              <Link to='/faculty/studentaccess'>
              <div
                onClick={handleProvideAccess}
                className="cursor-pointer p-4 bg-green-500 text-white rounded-lg text-center hover:bg-green-600"
              >
                Provide Access to Student
              </div>
              </Link>
              <Link to='/faculty/add-oe-events'>
              <div
                
                className="cursor-pointer p-4 bg-purple-500 text-white rounded-lg text-center hover:bg-purple-600"
              >
                Add Open Elective Event
              </div>
                </Link>
            </div>
          </div>
        {/* // ) : (
        //   <p className="text-xl text-gray-500 mt-20">Profile not created</p>
        // )} */}
        
      </div>
      </div>
    );
  }
}

export default FacultyHome;
