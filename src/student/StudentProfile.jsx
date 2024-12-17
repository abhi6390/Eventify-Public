import React, { useEffect, useState } from 'react';
import supabase from '../supabase/supabase';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import Loader from '../loader/Loader';
import { h1 } from 'framer-motion/client';

function StudentProfile() {
  const [name, setName] = useState('');
  const [program, setProgram] = useState('');
  const [programs, setPrograms] = useState([]);
  const [branch, setBranch] = useState('');
  const [branches, setBranches] = useState([]);
  const [semester, setSemester] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [division, setDivision] = useState('');
  const [divisions, setDivisions] = useState([]);
  let [openElective, setOpenElective] = useState('');
  const [openElectives, setOpenElectives] = useState([]);
  const [user_id, setUserId] = useState(null);
  const [emailId,setEmailId] = useState('')

  const [showModal,setShowModal] = useState(false)
  const [student,setStudent] = useState({})
  const [loading,setLoading] = useState(true)
  const [isProfileCreated,setIsProfileCreated] = useState(false)
  const [isLoggedIn,setIsLoggedIn] = useState(false)
  const [session,setSession] = useState('')
  const [programId,setProgramId] = useState(null)
  const [semesterNumber,setSemesterNumber] = useState(null)


  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if(openElective.trim().length ==0){
      openElective =null
    }
    const profileData = {
      user_name: name,
      user_id: user_id,
      program_id: program,
      branch_id: branch,
      semester_id: semester,
      division_id: division,
      subject_id: openElective,
      email_id:emailId
    };
    console.log(profileData);
    createUpdateStudentProfile(profileData);
  };

  const getAllPrograms = async () => {
    let { data: programsData, error } = await supabase.from('programs').select('*');
    if (programsData) {
      setPrograms(programsData);
    } else {
      console.error(error);
    }
  };

  const getAllBranches = async (program_id) => {
    let { data: branchesData, error } = await supabase
      .from('branches')
      .select('*')
      .eq('program_id', program_id);

    if (branchesData) {
      setBranches(branchesData);
    } else {
      console.error(error);
    }
  };

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

  const getAllDivisions = async (program_id, branch_id, semester_id) => {
    let { data: divisionsData, error } = await supabase
      .from('divisions')
      .select('*')
      .eq('program_id', program_id)
      .eq('branch_id', branch_id)
      .eq('semester_id', semester_id);

    if (divisionsData) {
      setDivisions(divisionsData);
    } else {
      console.error(error);
    }
  };

  const fetchOpenElectives = async (program_id,semester_number) => {
    let { data: openElectivesData, error } = await supabase
      .from('open_electives_table')
      .select('*')
      .eq('semester_number', semester_number)
      .eq('program_id',program_id)

    if (openElectivesData) {
      console.log(openElectivesData);
      
      setOpenElectives(openElectivesData);
    } else {
      console.error(error);
    }
  };

  const getCurrentUserSessionDetails = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (data) {
      console.log(data.session);
      setSession(data.session)
      if(data.session){

      // console.log(data.session.user.identities[0].identity_data);
        const name = data?.session?.user?.identities[0]?.identity_data?.full_name || data?.session?.user?.identities[0]?.identity_data.name
        setName(name)
        const user_id = data.session.user.id;
        const email_id = data.session.user.email

        if(!email_id.includes('@students.git.edu')){
            navigate('/unauthorised')
            return
        }
        setEmailId(email_id)
        setUserId(user_id);
        fetchStudentProfileDetails(user_id);
        setIsLoggedIn(true)
        
      }else{
        console.log('not loggedIn');
        setIsLoggedIn(false) 
      }    
    } else {
      console.error(error);
    }
  };

  const createStudentProfile = async(studentData)=>{
    
    const { data, error } = await supabase
      .from('students_profile')
      .insert([
        studentData
      ])
      .select()

      if(data){
        if(data.length){
          console.log(data);
          setIsProfileCreated(true)
          setShowModal(false)
          
          fetchStudentProfileDetails(data[0].user_id)
        }
      }else{
        console.error(error);
        
      }
          
  }

  const updateStudentProfile = async(studentData)=>{
    
    const { data, error } = await supabase
      .from('students_profile')
      .update(studentData)
      .eq('user_id', student.user_id)
      .select()

      if(data){
        if(data.length){
          setIsProfileCreated(true)
          setShowModal(false)
          fetchStudentProfileDetails(data[0].user_id)
        }
      }else{
        console.error(error);
        
      }
          
  }

  const createUpdateStudentProfile =  (studentData) => {
    if(isProfileCreated){
      updateStudentProfile(studentData)
    }else{
      createStudentProfile(studentData)
    }
  };

  const fetchStudentProfileDetails = async (user_id) => {
    // user_id= `77606eec-53ca-4c3f-87aa-deedcca7c142`
    let { data: students_profile, error } = await supabase
      .from('students_profile')
      .select(`
        profile_id,
        user_id,
        user_name,
        email_id,
        programs(
        program_id,
        program_name
        ),
        branches(
        branch_id,
        branch_name
        ),
        semesters(
        semester_id,
        semester_number
        ),
        divisions(
        division_id,
        division_name
        ),
        open_electives_table(
        subject_id,
        subject_name
        )
        `)
      .eq('user_id',user_id);

    if (students_profile) {
      console.log(students_profile);
      if(students_profile.length){

        const data = {
          name:students_profile[0].user_name,
          user_id:students_profile[0].user_id,
          profile_id:students_profile[0].profile_id,
          email_id:students_profile[0].email_id,
          program:students_profile[0].programs.program_name,
          branch:students_profile[0].branches.branch_name,
          semester:students_profile[0].semesters.semester_number,
          division:students_profile[0].divisions.division_name,
          openElective:students_profile[0].open_electives_table?.subject_name || 'Not choosen any subject'
  
        }
  
        setStudent(data)
        setIsProfileCreated(true)
        

      }else{
        setIsProfileCreated(false)
        console.log("no profile");
        

      }
   
    } else {
      console.error(error);
    }

    setLoading(false)
  };

  useEffect(() => {
    getCurrentUserSessionDetails();
    getAllPrograms();
  }, []);

  useEffect(() => {
    if (program) {
      getAllBranches(program);
      setBranch('');
      setSemesters([]);
      setSemester('');
      setDivisions([]);
      setDivision('');
    }
  }, [program]);

  useEffect(() => {
    if (program && branch) {
      getAllSemesters(program, branch);
      setSemester('');
      setDivisions([]);
      setDivision('');
      setOpenElective('');
    }
  }, [program, branch]);
  
  useEffect(() => {
    if (program && branch && semester) {
      getAllDivisions(program, branch, semester);
      // fetchOpenElectives(branch,semester);
      setDivision('');
    }
  }, [program, branch, semester]);


  if(session == null){
   navigate('/login')
  }

  // useEffect(()=>{
  //   console.log(programId,semesterNumber);

    
    
  // },[programId,semesterNumber])
  const helper = (semester_id)=>{
    console.log(semesters);
    console.log(semester_id);
    
    (semesters)
    semesters.map((item)=>{
      if(item.semester_id == semester_id){
        setProgramId(program)
        setSemesterNumber(item.semester_number)

        fetchOpenElectives(program,item.semester_number)
        return;     
      }
    })
  }

  if(loading){
    return(
      // <h1>Loading....</h1>
      <Loader/>
    )
  }else if(!isProfileCreated){
    return(
      <div className='bg-[#0F172A] min-h-screen pb-10'>
      <Header/>
      <div className='mx-auto justify-center bg-[#0F172A]'>

        {!showModal &&
        (
          <div className='mx-auto text-center my-10'>
            <h1 className='text-slate-100 text-xl my-5'>You have not created your profile !!</h1>
    
            <button onClick={()=> setShowModal(true)} className='bg-blue-500 rounded-lg text-white py-1 px-2' type="button">Create Profile</button>

          </div>
        )
        }


        {showModal && (
  
        <form className="w-full my-10 mx-auto max-w-md bg-gray-800 shadow-md rounded px-8 py-6 space-y-4" onSubmit={handleSubmit}>
          {/* Name Input */}
  
           <div className="relative py-2">
                    <button 
                      onClick={()=> setShowModal(false)}
                      className="absolute top-2 right-2 bg-blue-500 py-1 px-4  rounded-md"
                    >
                      X
                    </button>
          </div>
          {/* <button className='bg-blue-700 text-white p-2 rounded-lg' onClick={()=> setShowModal(false)}>Close</button> */}
          <div>
            <label className="block text-slate-100 text-sm font-bold mb-2">Name:</label>
            <input
              type="text"
              value={name}
              disabled={true}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Program Dropdown */}
          <div>
            <label className="block text-slate-100 text-sm font-bold mb-2">Program:</label>
            <select
              value={program}
            onChange={(e) => {setProgram(e.target.value);setProgramId(e.target.value)}}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Program</option>
              {programs.map((programItem) => (
                <option key={programItem.program_id} value={programItem.program_id}>
                  {programItem.program_name}
                </option>
              ))}
            </select>
          </div>
  
          {/* Branch Dropdown */}
          <div>
            <label className="block text-slate-100 text-sm font-bold mb-2">Branch:</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              disabled={!program}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Branch</option>
              {branches.map((branchItem) => (
                <option key={branchItem.branch_id} value={branchItem.branch_id}>
                  {branchItem.branch_name}
                </option>
              ))}
            </select>
          </div>
  
          {/* Semester Dropdown */}
          <div>
            <label className="block text-slate-100 text-sm font-bold mb-2">Semester:</label>
            <select
              value={semester}
              onChange={(e) => {setSemester(e.target.value); helper(e.target.value)}}
              disabled={!branch}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Semester</option>
              {semesters.map((semesterItem) => (
                <option key={semesterItem.semester_id} value={semesterItem.semester_id}>
                  {semesterItem.semester_number}
                </option>
              ))}
            </select>
          </div>
  
          {/* Division Dropdown */}
          <div>
            <label className="block text-slate-100 text-sm font-bold mb-2">Division:</label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              disabled={!semester}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Division</option>
              {divisions.map((divisionItem) => (
                <option key={divisionItem.division_id} value={divisionItem.division_id}>
                  {divisionItem.division_name}
                </option>
              ))}
            </select>
          </div>
  
          {/* Open Elective Dropdown */}
          <div>
            <label className="block text-slate-100 text-sm font-bold mb-2">Open Elective:</label>
            <select
              value={openElective}
              onChange={(e) => setOpenElective(e.target.value)}
              disabled={!branch}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Open Elective</option>
              {openElectives.map((elective) => (
                <option key={elective.subject_id} value={elective.subject_id}>
                  {elective.subject_name}
                </option>
              ))}
            </select>
          </div>
  
          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      )}
      </div>
      </div>   
    )
  }else{
    return (

      <div className='bg-[#0F172A] min-h-screen'>
      <Header/>
      <div className="flex flex-col items-center p-8 bg-[#0F172A] min-h-screen">
        <h2 className="text-2xl text-slate-100 font-semibold mb-6">Student Home Page</h2>
  
        {!showModal && 
        <div>
          
          
          <div className=" w-full max-w-xl px-5 mx-auto bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className=" flex text-white text-center py-4">
            <h2 className="text-xl ml-6 mr-4 font-semibold">Student Details</h2>
            <button className='bg-blue-700 text-white py-1 px-2 mr-4 rounded-lg' onClick={()=> setShowModal(true)}>Edit</button>
          </div>
          <div className="p-6 text-slate-100">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Name:</h3>
              <p className="">{student.name}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Email ID:</h3>
              <p className="">{student.email_id}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Program:</h3>
              <p className="">{student.program}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Branch:</h3>
              <p className="">{student.branch}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Semester:</h3>
              <p className="">{student.semester}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Division:</h3>
              <p className="">{student.division}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Open Elective:</h3>
              <p className="">{student.openElective}</p>
            </div>
          </div>
          </div>
        </div>
        
        }
  
  
      {showModal && (
  
        <form className="w-full max-w-md bg-gray-800 shadow-md rounded px-8 py-6 space-y-4" onSubmit={handleSubmit}>
          {/* Name Input */}
        
           <div className="relative py-2">
                    <button 
                      onClick={()=> setShowModal(false)}
                      className="absolute top-2 right-2 bg-blue-500 py-1 px-4  rounded-md"
                    >
                      X
                    </button>
                  </div>
          {/* <button className='bg-blue-700 text-white p-2 rounded-lg' onClick={()=> setShowModal(false)}>X</button> */}
          <div>
            <label className="block text-slate-100 text-sm font-bold mb-2">Name:</label>
            <input
              type="text"
              value={name}
              disabled={true}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border bg-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Program Dropdown */}
          <div>
            <label className="block text-slate-100 text-sm font-bold mb-2">Program:</label>
            <select
              value={program}
              onChange={(e) => {setProgram(e.target.value);setProgramId(e.target.value)}}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Program</option>
              {programs.map((programItem) => (
                <option key={programItem.program_id} value={programItem.program_id}>
                  {programItem.program_name}
                </option>
              ))}
            </select>
          </div>
  
          {/* Branch Dropdown */}
          <div>
            <label className="block text-slate-100 text-sm font-bold mb-2">Branch:</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              disabled={!program}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Branch</option>
              {branches.map((branchItem) => (
                <option key={branchItem.branch_id} value={branchItem.branch_id}>
                  {branchItem.branch_name}
                </option>
              ))}
            </select>
          </div>
  
          {/* Semester Dropdown */}
          <div>
            <label className="block text-slate-100 text-sm font-bold mb-2">Semester:</label>
            <select
              value={semester}
              onChange={(e) => {setSemester(e.target.value); helper(e.target.value)}}
              disabled={!branch}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Semester</option>
              {semesters.map((semesterItem) => (
                <option key={semesterItem.semester_id} value={semesterItem.semester_id}>
                  {semesterItem.semester_number}
                </option>
              ))}
            </select>
          </div>
  
          {/* Division Dropdown */}
          <div>
            <label className="block text-slate-100 text-sm font-bold mb-2">Division:</label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              disabled={!semester}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Division</option>
              {divisions.map((divisionItem) => (
                <option key={divisionItem.division_id} value={divisionItem.division_id}>
                  {divisionItem.division_name}
                </option>
              ))}
            </select>
          </div>
  
          {/* Open Elective Dropdown */}
          <div>
            <label className="block text-slate-100 text-sm font-bold mb-2">Open Elective:</label>
            <select
              value={openElective}
              onChange={(e) => setOpenElective(e.target.value)}
              disabled={!branch}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Open Elective</option>
              {openElectives.map((elective) => (
                <option key={elective.subject_id} value={elective.subject_id}>
                  {elective.subject_name}
                </option>
              ))}
            </select>
          </div>
  
          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      )}
  
      </div>
      </div>
    );
  }
}

export default StudentProfile;
