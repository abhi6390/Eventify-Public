import {createSlice} from '@reduxjs/toolkit'
import { act } from 'react'

const adminSlice = createSlice({
    name:'admin',
    initialState:{
        program_id: null,
        branch_id: null,
        semester_id:[],
        division_id:[],
        subject_id: [],

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

        setSubjectId: (state,action) => {
            state.subject_id=action.payload
        }

    }
})

export const { setProgramId, setBranchId, setSemesterId, setDivsionId, setSubjectId } = adminSlice.actions;
export default adminSlice.reducer