import {createSlice} from '@reduxjs/toolkit'

const studentSlice = createSlice({
    name:'student',
    initialState:{
        program_id: null,
        branch_id: null,
        semester_id:null,
        division_id:null,
        user_id:null,
        open_elective_id: null,
        is_profile_created: null,
        user_name: null

    },
    reducers:{
        
        setProgramId:(state,action) => {
            state.program_id=action.payload
        },

        setBranchId:(state,action) => {
            state.branch_id=action.payload
        },

        setSemesterId:(state,action) => {
            state.semester_id=action.payload
        },

        setDivsionId:(state,action) => {
            state.division_id=action.payload
        },
        setUserId: (state,action) => {
            state.user_id=action.payload
        },
        setOpenElectiveId: (state,action) => {
            state.open_elective_id=action.payload
        },

        setIsProfileCreated: (state, action) => {
            state.is_profile_created=action.payload
        },
        
        setUserName : (state, action) => {
            state.user_name=action.payload
        }

    }
})

export const { setProgramId, setBranchId, setSemesterId,
     setDivsionId, setUserId, setOpenElectiveId, setIsProfileCreated, setUserName } = studentSlice.actions;
export default studentSlice.reducer