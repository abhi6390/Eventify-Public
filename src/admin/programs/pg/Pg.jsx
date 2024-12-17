import React, { useState, useEffect } from 'react';
import supabase from '../../../supabase/supabase';
import { useSelector, useDispatch } from 'react-redux';
import { setBranchId } from '../../../store/adminSlice';
import AdminHeaderPg from '../../../header/AdminHeaderPg';
function Pg() {
  const [showForm, setShowForm] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [semesters, setSemesters] = useState('');
  const [divisions, setDivisions] = useState('');
  const [courses, setCourses] = useState([]); // State to store fetched courses
  const [isEditing, setIsEditing] = useState(false); // Track if we're editing
  const [editBranchId, setEditBranchId] = useState(null); // Store the branch_id of the item being edited
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [branchToDelete, setBranchToDelete] = useState(null); // Store branch to delete

  let branchId = null;
  let semesterData = null;

  const dispatch = useDispatch();
  const program_id = useSelector((state) => state.admin.program_id);

  const handleAddClick = () => {
    setShowForm(true);
    setIsEditing(false); // Reset edit mode when adding new branch
    setBranchName('');
    setSemesters('');
    setDivisions('');
  };

  const handleSubmit = () => {
    if (isEditing) {
      updateBranch(); // Update if in edit mode
    } else {
      createBranch(); // Create new if not in edit mode
    }
  };

  const createBranch = async () => {
    const { data, error } = await supabase
      .from('branches')
      .insert([{ branch_name: branchName, program_id: 2 }])
      .select();

    if (data) {
      dispatch(setBranchId(data[0].branch_id));
      branchId = data[0].branch_id;
      createSemesters();
      fetchDetails(); // Refresh data after adding
    } else {
      console.error(error);
    }
  };

  const createSemesters = async () => {
    const tempArr = [];
    const num = semesters;

    for (let i = 1; i <= num; i++) {
      tempArr.push({
        semester_number: i,
        branch_id: branchId,
        program_id: 2,
      });
    }

    const { data, error } = await supabase.from('semesters').insert(tempArr).select();

    if (data) {
      semesterData = data;
      createDivisions();
    } else {
      console.error(error);
    }
  };

  const createDivisions = async () => {
    const num = divisions;
    const divisionName = ["A", "B", "C", "D", "E"];
    const divisionData = [];

    for (let i = 0; i < semesterData.length; i++) {
      for (let j = 0; j < num; j++) {
        divisionData.push({
          division_name: divisionName[j],
          semester_id: semesterData[i].semester_id,
          branch_id: semesterData[i].branch_id,
          program_id: semesterData[i].program_id,
        });
      }
    }

    const { data, error } = await supabase.from('divisions').insert(divisionData).select();

    if (data) {
      console.log("Divisions created:", data);
    } else {
      console.error(error);
    }
  };

  const openModal = (branch_id) => {
    setBranchToDelete(branch_id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setBranchToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDeleteBranch = async () => {
    if (branchToDelete) {
      const { error } = await supabase.from('branches').delete().eq('branch_id', branchToDelete);
      if (!error) {
        console.log("Successfully deleted!");
        fetchDetails(); // Refresh data after deletion
      } else {
        console.error(error);
      }
      closeModal();
    }
  };

  const handleEdit = (course) => {
    setShowForm(true);
    setIsEditing(true);
    setEditBranchId(course.branch_id);
    setBranchName(course.branch_name);
    setSemesters(course.max_semester_number); // Set existing semester but keep the field disabled
    setDivisions(course.division_count); // Set existing division but keep the field disabled
  };

  const updateBranch = async () => {
    const { data, error } = await supabase
      .from('branches')
      .update({ branch_name: branchName })
      .eq('branch_id', editBranchId)
      .select();

    if (data) {
      console.log("Branch updated:", data);
      fetchDetails(); // Refresh data after update
      setShowForm(false);
      setIsEditing(false);
      setEditBranchId(null);
    } else {
      console.error(error);
    }
  };

  const fetchDetails = async () => {
    try {
      let { data, error } = await supabase.rpc('get_all_pg_programs_info');
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setCourses(data || []);
      }
    } catch (error) {
      console.error("Unexpected error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div className='bg-[#0F172A]  min-h-screen'>
    <AdminHeaderPg/>
    <div className="p-6 text-center">
      {!showForm && (
        <button 
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-4 py-2 mb-5 rounded-full hover:bg-blue-700 mt-6"
        >
          ADD
        </button>
      )}
      {showForm && (
        <div className="bg-gray-800 p-6 mb-5 rounded-md w-full max-w-md mx-auto mt-6 text-white">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? "Edit Branch" : "Enter the branches in the PG program"}
          </h2>

          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Branch/Stream Name</label>
            <input 
              type="text" 
              placeholder="Enter Branch/Stream Name"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-200 mb-2">Total Semesters</label>
            <select 
              value={semesters}
              onChange={(e) => setSemesters(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isEditing}
            > 
              <option value="">Select total number of semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Total Divisions</label>
            <select 
              value={divisions}
              onChange={(e) => setDivisions(e.target.value)}
              className="w-full p-2 rounded-md bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select total number of divisions</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
              <div className="flex justify-between">
          <button 
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 mt-4"
          >
            {isEditing ? "Update" : "Submit"}
          </button>
          <button 
              onClick={()=>(setShowForm(false))}
              className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 mt-4"
            >
              Close
            </button>
            </div>
        </div>
      )}
      
      <div className="space-y-4">
        {Array.isArray(courses) && courses.length > 0 ? (
          courses.map((course, index) => (
            <div key={index} className="bg-gray-300 p-4 max-w-md rounded-md text-black">
              <p>Program : {course.program_name}</p>
              <p>Stream : {course.branch_name}</p>
              <p>Total Semesters : {course.max_semester_number}</p>
              <p>Divisions in each sem : {course.division_count}</p>
              <div className="flex justify-center space-x-4 mt-2">
                <button 
                  className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700"
                  onClick={() => handleEdit(course)}
                >
                  Edit
                </button>
                <button 
                  className="bg-red-600 text-white px-4 py-1 rounded-full hover:bg-red-700"
                  onClick={() => openModal(course.branch_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white">No data available or loading...</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md text-center max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this branch?</p>
            <div className="flex justify-center mt-4 space-x-4">
              <button 
                onClick={confirmDeleteBranch}
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
              >
                Delete
              </button>
              <button 
                onClick={closeModal}
                className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default Pg;
