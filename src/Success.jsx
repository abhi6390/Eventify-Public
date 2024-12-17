import React, { useEffect } from 'react';
import supabase from './supabase/supabase';
import { useNavigate } from 'react-router-dom';
import { setBranchId, setDivsionId, setProgramId, setOpenElectiveId, 
    setSemesterId, setUserId, setIsProfileCreated, setUserName } from './store/studentSlice';
import { useDispatch } from 'react-redux';
import Loader from './loader/Loader';    

function Success() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const getCurrentUserSessionDetails = async () => {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error("Error fetching session:", error);
            return;
        }
        
        if (data && data.session && data.session.user) {
            const email = data.session.user.email;
            console.log("User email:", email);

            if (email.includes('@git.edu')) {
                console.log("Email is of GIT faculty");
                navigate('/faculty/home');
            } else if (email.includes('@students.git.edu')) {
                const user_id = data.session.user.id
                getUserProfileDetails(user_id)
                console.log("Email is of GIT Student");
                navigate('/student/home');
            } else {
                console.log("Email is not of GIT");
                navigate('/unauthorised')
            }
        }
    };

    const getUserProfileDetails = async (user_id) =>{
            
        let { data: students_profile, error } = await supabase
        .from('students_profile')
        .select('*')
        .eq('user_id',user_id)

        console.log(user_id);
        console.log(students_profile.length);
        
        
        
        if(students_profile){
            console.log(students_profile);
            if(students_profile.length != 0){
                const user_id= students_profile[0].user_id
                const branch_id=students_profile[0].branch_id
                const semester_id=students_profile[0].semester_id
                const program_id=students_profile[0].program_id
                const user_name=students_profile[0].user_name
                const division_id=students_profile[0].division_id
                const open_elective_id=students_profile[0].open_elective_id
                const is_profile_created = students_profile[0].is_profile_created

                dispatch(setUserId(user_id))
                dispatch(setBranchId(branch_id))
                dispatch(setSemesterId(semester_id))
                dispatch(setProgramId(program_id))
                dispatch(setUserName(user_name))
                dispatch(setDivsionId(division_id))
                dispatch(setOpenElectiveId(open_elective_id))
                dispatch(setIsProfileCreated(is_profile_created))
            }
        }
        else{
            console.error(error);
            
        }    
            
    }

    useEffect(() => {
        getCurrentUserSessionDetails();
    }, []);

    return (
        <Loader/>
    );
}

export default Success;
