import React, { useEffect, useState } from 'react';
import supabase from '../supabase/supabase';
import FacultyHeader from '../header/FacultyHeader';

function ProvideStudentAccess() {
  const [email, setEmail] = useState('');
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage,setModalMessage] = useState('')
  const [isPopUp,setIsPopUp] = useState(false)
  const [popUpMessage,setPopUpMessage] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentName,setStudentName] =useState('')


  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      fetchBranches(selectedProgram);
    } else {
      setBranches([]); // Clear branches when no program is selected
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedBranch) {
      fetchSemesters(selectedBranch);
    } else {
      setSemesters([]); // Clear semesters when no branch is selected
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedBranch && selectedSemester) {
      fetchStudentsWithAccess(selectedBranch, selectedSemester);
    } else {
      setStudents([]); // Clear students if filters are incomplete
    }
  }, [selectedBranch, selectedSemester]);

  const fetchPrograms = async () => {
    const { data, error } = await supabase.from('programs').select('program_id, program_name');

    if (data) setPrograms(data);
    if (error) console.error('Error fetching programs:', error);
  };

  const fetchBranches = async (program_id) => {
    const { data, error } = await supabase
      .from('branches')
      .select('branch_id, branch_name')
      .eq('program_id', program_id); // Fetch branches by program ID

    if (data) setBranches(data);
    if (error) console.error('Error fetching branches:', error);
  };

  const fetchSemesters = async (branch_id) => {
    const { data, error } = await supabase
      .from('semesters')
      .select('semester_id, semester_number')
      .eq('branch_id', branch_id); // Fetch semesters by branch ID

    if (data) setSemesters(data);
    if (error) console.error('Error fetching semesters:', error);
  };

  const fetchStudentsWithAccess = async (branch_id, semester_id) => {
    const { data, error } = await supabase
      .from('students_profile')
      .select(`
        user_name, profile_id,
        branches (branch_name),
        semesters (semester_number),
        divisions (division_name)
      `)
      .eq('branch_id', branch_id)
      .eq('semester_id', semester_id)
      .eq('can_add_events', true);

    if (data) setStudents(data);
    if (error) console.error('Error fetching students:', error);
  };

  const handleProgramChange = (program) => {
    setSelectedProgram(program);
    setSelectedBranch(''); // Reset branch when program changes
    setSelectedSemester(''); // Reset semester when program changes
  };

  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
    setSelectedSemester(''); // Reset semester when branch changes
  };

  const handleProvideAccess = async () => {
    if (email) {
      // Add logic to provide access to the student
      const { data, error } = await supabase
        .from('students_profile')
        .update({ can_add_events: true })
        .eq('email_id', email)
        .select();

      if (data) {
        // Assuming that the student has been added to the students list
        // const newStudent = {
        //   user_name: data[0].user_name,
        //   profile_id: data[0].profile_id,
        //   branches: { branch_name: data[0].branch_name },
        //   semesters: { semester_number: data[0].semester_number },
        //   divisions: { division_name: data[0].division_name }
        // };

        console.log(data);
        if(data.length){
          const name = data[0].user_name;
          setStudentName(name);
          setModalMessage(`Access granted to ${name} !!!`)
          setIsModalOpen(true)
          setEmail('')
        }else{
          setModalMessage('Some error occured. Please try again !!!')
          setIsModalOpen(true)
        }
        
        
        // Update the students list in state
        // setStudents((prevStudents) => [...prevStudents, newStudent]);
        
        // alert(`Access granted to the student! ${data[0].user_name}` );
      } else {
        console.error('Error providing access:', error);
      }
    }
  };

  const handleDeleteAccess = async (studentId) => {
    // Logic to remove student access
    const { data, error } = await supabase
      .from('students_profile')
      .update({ can_add_events: false })
      .eq('profile_id', studentId)
      .select();
  
    if (data.length) {
      console.log(data);
      const name = data[0].user_name;

      setPopUpMessage(`Access removed for student ${name} successfully !!!`)
      setIsPopUp(true)
      

      // Refetch the students data to get the updated list
      // fetchStudentsWithAccess(selectedBranch, selectedSemester);  // Refetch with current filters
      setStudents((prevStudents) => prevStudents.filter(student => student.profile_id !== studentId));
      // alert('Access removed successfully');
  
    } else {
      console.error('Error deleting access:', error);
      setPopUpMessage("Some error occured. Please try again !!!")
      setIsPopUp(true)
    }
  };
  

  return (
    <div className='bg-[#0F172A] min-h-screen'>
    <FacultyHeader/>
    <div className="flex flex-col items-center p-6 ">
      <div className="bg-gray-800 p-8 shadow-md rounded-lg w-full max-w-md mb-6">
        <h2 className="text-2xl font-semibold text-slate-100 mb-6 text-center">Provide Access to Student</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-slate-100 font-medium mb-2">
            Student Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter student email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Provide Access Button */}
        <button
          onClick={handleProvideAccess}
          className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          disabled={!email}
        >
          Provide Access
        </button>
      </div>

      <div className="w-full max-w-md mb-6">
        <p className="text-slate-100 pb-5 text-center">Select a branch and semester to view students with access.</p>
        {/* Program Filter */}
        <div className="mb-4">
          <select
            value={selectedProgram}
            onChange={(e) => handleProgramChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select Program</option>
            {programs.map((program) => (
              <option key={program.program_id} value={program.program_id}>
                {program.program_name}
              </option>
            ))}
          </select>
        </div>

        {/* Branch Filter */}
        <div className="mb-4">
          <select
            value={selectedBranch}
            onChange={(e) => handleBranchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            disabled={!branches.length}
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.branch_id} value={branch.branch_id}>
                {branch.branch_name}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div className="mb-4">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            disabled={!semesters.length}
          >
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester.semester_id} value={semester.semester_id}>
                {semester.semester_number}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students with Access */}
      {selectedBranch && selectedSemester && students.length > 0 ? (
        <div className="w-full max-w-md">
          <h3 className="text-xl font-semibold text-slate-100 mb-4 text-center">Students with Access</h3>
          {students.map((student) => (
            <div key={student.profile_id} className="bg-gray-800 p-4 mb-4 shadow-md rounded-lg">
              <h4 className="text-lg font-medium text-slate-100 mb-2">{student.user_name}</h4>
              <p className="text-slate-100">Branch: {student.branches?.branch_name || 'N/A'}</p>
              <p className="text-slate-100">Semester: {student.semesters?.semester_number || 'N/A'}</p>
              <p className="text-slate-100">Division: {student.divisions?.division_name || 'N/A'}</p>

              {/* Delete Access Button */}
              <button
                onClick={() => handleDeleteAccess(student.profile_id)}
                className="mt-4 w-full px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
              >
                Delete Access
              </button>
            </div>
          ))}
        </div>
      ) : (
        
        <p className="text-slate-100 text-center">No studentes have access</p>
      )}

       {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-700 text-slate-200 p-6 rounded-md w-11/12 max-w-sm text-center">
              <h3 className="text-lg font-semibold mb-4">{modalMessage}</h3>
           
              <div className="flex justify-center space-x-4">
                <button
                   onClick={() => setIsModalOpen(false)}
                  className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600"
                >
                  OK
                </button>
         
              </div>
            </div>
          </div>
        )}


       {isPopUp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-700 text-slate-200 p-6 rounded-md w-11/12 max-w-sm text-center">
              <h3 className="text-lg font-semibold mb-4">{popUpMessage}</h3>
           
              <div className="flex justify-center space-x-4">
                <button
                   onClick={() => setIsPopUp(false)}
                  className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600"
                >
                  OK
                </button>
         
              </div>
            </div>
          </div>
        )}
    </div>
    </div>
  );
}

export default ProvideStudentAccess;
