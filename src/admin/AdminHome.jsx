import React, { useEffect, useState } from 'react';
import supabase from '../supabase/supabase';
import { Link } from 'react-router-dom';
import { data } from 'autoprefixer';
// import store from './store/store.js'
import { useDispatch } from 'react-redux';
import { setProgramId } from '../store/adminSlice';
// import AdminHeader from '../header/AdminHeader';
function AdminHome() {
  const [programs, setPrograms] = useState([]);

  const dispatch= useDispatch()

  const getAllPrograms = async () => {
    let { data: programs, error } = await supabase
      .from('programs')
      .select('*');
      
    if (error) {
      console.error("Error fetching programs:", error);
    } else {
      setPrograms(programs);
    }

    console.log(programs);
    
  };

  useEffect(() => {
    getAllPrograms();
  }, []);

  return (
   <div className="bg-[#0F172A] min-h-screen flex items-center justify-center">
  <div className="text-center">
    <p className="text-slate-100 text-2xl py-5">Please select a Program !!!</p>
    <div className="flex flex-wrap gap-4 justify-center">
      {programs.map((program, index) => (
        <Link to={`/admin/${program.program_url}`}>
        <div
          key={index}
          className="border border-gray-300 my-5 md:mx-5 rounded-lg p-4 w-60 shadow-lg bg-gray-800 text-slate-100"
          onClick={() => dispatch(setProgramId(program.program_id))}
        >
            <h3 className="text-lg text-center font-bold mb-2">{program.program_name}</h3>
        </div>
          </Link>
      ))}
    </div>
  </div>
</div>


  );
}

export default AdminHome;
