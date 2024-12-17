import React, { useState } from 'react';
import supabase from '../../../supabase/supabase';
import AdminHeader from '../../../header/AdminHeader';

function PgOpenElective() {
  const [openElectives, setOpenElectives] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [subjectId,setSubjectId] = useState(null)
  const [showConfirmation,setShowConfirmation] = useState(false)
  const [filterSemesterNumber,setFilterSemesterNumber] = useState('')

  const semesters = Array.from({ length: 6 }, (_, index) => index + 1);
  

  const fetchDetailsAboutOpenElective = async () => {

    let { data: open_electives_table, error } = await supabase
      .from('open_electives_table')
      .select('*')
      .eq('program_id', 2)
      .eq('semester_number',filterSemesterNumber)
  
    if (open_electives_table) {

      console.log(open_electives_table);
      
      // Transforming the data to flatten out nested properties for easier rendering
      const transformedElectives = open_electives_table.map((elective) => ({
        ...elective,
        program_name: 'PG',
      }));

      console.log(transformedElectives);
      
  
      setOpenElectives(transformedElectives);
    } else {
      console.error(error);
      
    }
  };
  
  const handleSubmit = (e)=>{
    e.preventDefault();

    const electiveData ={
      subject_name:subjectName,
      semester_number:selectedSemester,
      program_id:2
    }

    addOpenElectives(electiveData)
    setSubjectName('')
    setSelectedSemester('')


  }

  const addOpenElectives = async(electiveData)=>{
    
    const { data, error } = await supabase
      .from('open_electives_table')
      .insert([
        electiveData
      ])
      .select()

      if(data){
        console.log(data);
        let newElective = data[0];
        newElective = {
          ...newElective,
          program_name:"PG"
        }
        if(newElective.semester_number == filterSemesterNumber)
        setOpenElectives(prevElectives => [...prevElectives, newElective]);
        
      }else{
        console.error(error);
        
        
      }
          
  }

  const deleteOpenElective = async(subject_id)=>{
    
    const { error } = await supabase
      .from('open_electives_table')
      .delete()
      .eq('subject_id', subject_id)


      if(error){
        console.error(error);
        
      }else{
        console.log("subject deleted successfully");
        setOpenElectives(prevElectives => prevElectives.filter(elective => elective.subject_id !== subject_id));
        
      }
          
  }



  return (
    <div className='bg-[#0F172A]  min-h-screen'>
    <AdminHeader/>
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-slate-100 text-center">PG Open Electives</h1>

      {/* Input fields for adding a new elective */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 ">
        <input
          type="text"
          placeholder="Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />


        {/* Dropdown for selecting semester */}
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          // disabled={!selectedBranch}
        >
          <option value="">Select Semester</option>
          {semesters.map((semester) => (
            <option key={semester} value={semester}>
              {semester || `Semester ${semester}`}
            </option>
          ))}
        </select>

        <button
          type='submit'
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Add Open Elective
        </button>
      </form>


          <p className='text-center my-10 text-slate-100  text-xl'>Fetch open electives based on Semester</p>
          <div className='mx-auto max-w-md flex 0 justify-between '>

           <select
          value={filterSemesterNumber}
          onChange={(e) => setFilterSemesterNumber(e.target.value)}
          className="w-3/4 p-2 border border-gray-300 rounded"
        >
          <option value="">Select Semester</option>
          {semesters.map((semester) => (
            <option key={semester} value={semester}>
              {semester || `Semester ${semester}`}
            </option>
          ))}
        </select>

        <button onClick={fetchDetailsAboutOpenElective} className='w-1/4 ml-2 bg-blue-500 text-white p-2 rounded'>Display</button>
          </div>

          
      {/* Display list of open electives */}
      {openElectives.length > 0 ? (
    openElectives.map((elective) => (
      <div key={elective.subject_id} className="bg-gray-800 text-slate-100 p-4 rounded-md shadow-md max-w-md mx-auto mt-4">
        <p><strong>Subject Name:</strong> {elective.subject_name}</p>
        <p><strong>Semester:</strong> {elective.semester_number}</p>
        <p><strong>Program:</strong> {elective.program_name}</p>
        <button onClick={()=>{
          setShowConfirmation(true);
          setSubjectId(elective.subject_id)
        }} className='bg-red-600 hover:bg-red-500 py-1 px-2 rounded-lg mt-3 text-slate-200'>Delete</button>

         {showConfirmation && (
          <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-700 text-slate-200 p-6 rounded-md w-11/12 max-w-sm text-center">
              <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
              <p className=" mb-4">
                Do you really want to delete this event? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                   deleteOpenElective(subjectId)
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

      </div>



  ))
) : (
  <p className="text-center text-gray-500 mt-4">No open electives available.</p>
)}

    </div>
    </div>
  );
}

export default PgOpenElective;
