import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice.js'
import adminSlice from './adminSlice.js'
import studentSlice from './studentSlice.js'
import facultySlice from './facultySlice.js'
const store = configureStore({
    reducer:{
        auth:authSlice,
        admin:adminSlice,
        student:studentSlice,
        faculty:facultySlice
    }
})

export default store;