import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase/supabase';
import { button } from '@material-tailwind/react';
import FacultyHeader from '../header/FacultyHeader';
import Loader from '../loader/Loader';
import { useAspect } from '@react-three/drei';

function FacultyProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('');
  const [branches, setBranches] = useState([]);
  const [program, setProgram] = useState('');
  const [programs, setPrograms] = useState([]);
  // const [openElectives, setOpenElectives] = useState([]);
  // const [selectedOpenElective, setSelectedOpenElective] = useState('');
  const [userId, setUserId] = useState(null);
  const [facultyInfo, setFacultyInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileCreated,setIsProfileCreated] = useState(false)
  const [loading,setLoading] = useState(true)
  const [showModal,setShowModal] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log('form submitterd');
    
  
    const profileData = {
      user_name: name,
      user_id: userId,
      email_id: email, // Include email in the profile data
      branch_id: branch || null,
      // subject_id: selectedOpenElective || null,
      program_id: program || null,
    };
  
    // try {
    //   let data;
    //   if (isEditing) {
    //     // Update existing profile
    //     ({ data } = await supabase
    //       .from('faculty_profile')
    //       .update(profileData)
    //       .eq('user_id', userId)
    //       .select());
    //   } else {
    //     // Create a new profile
    //     ({ data } = await supabase
    //       .from('faculty_profile')
    //       .insert(profileData)
    //       .select());
    //   }
  
    //   if (data.length) {
    //     setFacultyInfo(data[0]);
    //     setIsEditing(false);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }

    if(isProfileCreated){
      updateFacultyProfile(profileData)
    }else{
      createFacultyProfile(profileData)
    }

    fetchCurrentUser()
  };

  const createFacultyProfile = async(profileData) =>{
   
    const { data, error } = await supabase
      .from('faculty_profile')
      .insert([
        profileData
      ])
      .select()

      if(data.length){
        setFacultyInfo(data[0]);
        setIsEditing(false);
      }else{
        console.error(error);
        
      }
          
  }

  const updateFacultyProfile = async(profileData)=>{
    
    const { data, error } = await supabase
      .from('faculty_profile')
      .update(profileData)
      .eq('user_id', userId)
      .select()

       if(data.length){
        setFacultyInfo(data[0]);
        setIsEditing(false);
      }else{
        console.error(error);
        
      }
          
  }
  

  const fetchPrograms = async () => {
    const { data: programsData, error } = await supabase.from('programs').select('*');
    if (programsData) setPrograms(programsData);
    else console.error(error);
  };

  const fetchBranches = async (programId) => {
    const { data: branchesData, error } = await supabase
      .from('branches')
      .select('*')
      .eq('program_id', programId);

    if (branchesData) setBranches(branchesData);
    else console.error(error);
  };

  // const fetchOpenElectives = async (branchId) => {
  //   const { data: electivesData, error } = await supabase
  //     .from('open_electives')
  //     .select('*')
  //     .eq('branch_id', branchId);

  //   if (electivesData) setOpenElectives(electivesData);
  //   else console.error(error);
  // };

  const fetchCurrentUser = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error(error);
      return;
    }

    const session = data?.session;
    console.log(session);
    
    if (session) {
      const user = session.user;
      
      const fullName =
        user.identities?.[0]?.identity_data?.full_name || user.identities?.[0]?.identity_data?.name;

      setName(fullName || '');
      setEmail(user.email || '');
      setUserId(user.id);

      if (!user.email.includes('@git.edu')) {
        navigate('/unauthorised');
      } else {
        fetchFacultyProfile(user.id);
      }
    }else{
      navigate('/login');
    }
  };

  const fetchFacultyProfile = async (userId) => {
    const { data: profileData, error } = await supabase
      .from('faculty_profile')
      .select('*')
      .eq('user_id', userId);

    if (profileData && profileData.length > 0) {
      console.log(profileData);
      
      const profile = profileData[0];
      setFacultyInfo(profile);

      setBranch(profile.branch_id || '');
      setProgram(profile.program_id || '');
      // setSelectedOpenElective(profile.subject_id || '');

      setIsProfileCreated(true)

      if (profile.program_id) fetchBranches(profile.program_id);
      // if (profile.branch_id) fetchOpenElectives(profile.branch_id);
    } else {
      console.error(error);
      setIsProfileCreated(false)
    }
    setLoading(false)
    
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (program) {
      fetchBranches(program);
    } else {
      setBranches([]);
      setBranch('');
    }
  }, [program]);

  // useEffect(() => {
  //   if (branch) {
  //     fetchOpenElectives(branch);
  //   } else {
  //     setOpenElectives([]);
  //     setSelectedOpenElective('');
  //   }
  // }, [branch]);

  if(loading){
    return(
      <Loader/>
    )
  }
  else if(!isProfileCreated){

    return(
      <div className='bg-[#0F172A] min-h-screen'>
      <FacultyHeader/>
      
        {!isEditing &&
              (
                <div className='mx-auto text-center my-10'>
                  <h1 className='text-slate-100 text-xl my-5'>You have not created your profile !!</h1>
          
                  <button onClick={()=> setIsEditing(true)} className='bg-blue-500 rounded-lg text-white py-1 px-2' type="button">Create Profile</button>
      
                </div>
              )
              }
              {
                isEditing &&
                (
                  <form
        className="w-full mx-auto mt-4 max-w-md bg-gray-800 shadow-md rounded px-8 py-6 space-y-4"
        onSubmit={handleSubmit}
        >
          <div className="relative py-2">
          <button 
            onClick={() => setIsEditing(false)} 
            className="absolute top-2 right-2 bg-blue-500 py-1 px-4  rounded-md"
          >
            X
          </button>
        </div>
          <div>
            <label className="block text-slate-100 text-sm font-bold mb-2">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={true}
              className="w-full px-4 py-2 bg-gray-400 border rounded focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-slate-100 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-2 border bg-gray-100 rounded"
            />
          </div>
          <div>
            <label className="block text-slate-100 text-sm font-bold mb-2">Program:</label>
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
            >
              <option value="">Select Program</option>
              {programs.map((p) => (
                <option key={p.program_id} value={p.program_id}>
                  {p.program_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-100 text-sm font-bold mb-2">Branch:</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b.branch_id} value={b.branch_id}>
                  {b.branch_name}
                </option>
              ))}
            </select>
          </div>
          {/* <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Open Elective:</label>
            <select
              value={selectedOpenElective}
              onChange={(e) => setSelectedOpenElective(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
            >
              <option value="">Select Open Elective</option>
              {openElectives.map((oe) => (
                <option key={oe.subject_id} value={oe.subject_id}>
                  {oe.subject_name}
                </option>
              ))}
            </select>
          </div> */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none"
          >
            {/* {isEditing ? 'Update Profile' : 'Create Profile'} */}
            Create Profile
          </button>
        </form>
                )
              }
      </div>
    )
  }

    return (
      <div className='bg-[#0F172A] min-h-screen'>
      <FacultyHeader/>
      <div className="flex flex-col items-center p-8">
  
        {facultyInfo && !isEditing ? (
          <div className="w-full max-w-md text-slate-100 bg-gray-800 shadow-md rounded px-8 py-6">
            <h2 className="text-2xl text-slate-100 font-semibold mb-6">Faculty Profile</h2>
            <h3 className="text-xl  font-semibold mb-4">Profile Details</h3>
            <p>
              <strong>Name:</strong> {facultyInfo.user_name}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Program:</strong>{' '}
              {programs.find((p) => p.program_id === facultyInfo.program_id)?.program_name || 'N/A'}
            </p>
            <p>
              <strong>Branch:</strong>{' '}
              {branches.find((b) => b.branch_id === facultyInfo.branch_id)?.branch_name || 'N/A'}
            </p>
            {/* <p>
              <strong>Open Elective:</strong>{' '}
              {openElectives.find((oe) => oe.subject_id === facultyInfo.subject_id)?.subject_name ||
                'N/A'}
            </p> */}
            <button
              className="mt-4 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          isEditing &&
  
          <form
          className="w-full max-w-md bg-gray-800 shadow-md rounded px-8 py-6 space-y-4"
          onSubmit={handleSubmit}
          >
            <div className="relative py-2">
            <button 
              onClick={() => setIsEditing(false)} 
              className="absolute top-2 right-2 bg-blue-500 py-1 px-4  rounded-md"
            >
              X
            </button>
          </div>
            <div>
              <label className="block text-slate-100 text-sm font-bold mb-2">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={true}
                className="w-full px-4 py-2 bg-gray-400 border rounded focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-slate-100 text-sm font-bold mb-2">Email:</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-2 border bg-gray-100 rounded"
              />
            </div>
            <div>
              <label className="block text-slate-100 text-sm font-bold mb-2">Program:</label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
              >
                <option value="">Select Program</option>
                {programs.map((p) => (
                  <option key={p.program_id} value={p.program_id}>
                    {p.program_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-100 text-sm font-bold mb-2">Branch:</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
              >
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b.branch_id} value={b.branch_id}>
                    {b.branch_name}
                  </option>
                ))}
              </select>
            </div>
            {/* <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Open Elective:</label>
              <select
                value={selectedOpenElective}
                onChange={(e) => setSelectedOpenElective(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2"
              >
                <option value="">Select Open Elective</option>
                {openElectives.map((oe) => (
                  <option key={oe.subject_id} value={oe.subject_id}>
                    {oe.subject_name}
                  </option>
                ))}
              </select>
            </div> */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none"
            >
              {/* {isEditing ? 'Update Profile' : 'Create Profile'} */}
              Submit
            </button>
          </form>
        )}
      </div>
      </div>
    );
  

}

export default FacultyProfile;
