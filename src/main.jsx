import { ThemeProvider } from "@material-tailwind/react";
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './utils/ErrorPage'
import AdminLogin from './admin/AdminLogin'
import { Provider } from 'react-redux'
import store from './store/store.js'
import App from './App'
import AdminHome from './admin/AdminHome'
import Ug from './admin/programs/ug/Ug'
import Pg from './admin/programs/pg/Pg'
import BasicScience from './admin/programs/basic_sciences/BasicScience'
import StudentProfile from './student/StudentProfile'
import Calendar from './components/Calendar'
import UserLogin from './login/UserLogin'
import Home from './Home'
import Success from './Success'
import Unauthorised from './utils/Unauthorised'
import StudentHome from './student/StudentHome'
import FacultyHome from './faculty/FacultyHome'
import FacultyProfile from './faculty/FacultyProfile'
import ProvideStudentAccess from './faculty/ProvideStudentAccess'
import UgOpenElective from './admin/programs/ug/UgOpenElective'
import PgOpenElective from './admin/programs/pg/PgOpenElective'
import BsOpenElective from './admin/programs/basic_sciences/BsOpenElective'
import FacultyAddEvents from './faculty/FacultyAddEvents'
import FacultyAddOEEvents from './faculty/FacultyAddOEEvents'
import StudentOpenElective from './student/StudentOpenElective'
import HomePage from "./HomePage";
import LoginCard from "./logincomponents/LoginCard";
import TelegramBot from "./TelegramBot.jsx";
import Logout from "./Logout.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>,
    children:[
      {
      path:'/',
      // element: <Home/>
      element:<HomePage/>
      },

      {
        path:'/login',
        element: <LoginCard/>
      },
      {
        path:'/logout',
        element: <Logout/>
      },
      {
        path:'/success',
        element: <Success/>
      },

      {
        path:'/admin',
        element: <AdminHome/>
      },

      {
        path:'/admin/home',
        element: <AdminHome/>
      },

      {
        path:'/admin/login',
        element: <AdminLogin/>
      },

      {
        path:'/admin/ug',
        element:<Ug/>
      },

      {
        path:'/admin/pg',
        element:<Pg/>
      },

      {
        path:'/admin/basic-science',
        element:<BasicScience/>
      },

      {
        path:'/admin/ug/openelective',
        element:<UgOpenElective/>
      },

      {
        path:'/admin/pg/openelective',
        element: <PgOpenElective/>
      },

      {
        path:'/admin/basic-science/openelective',
        element:<BsOpenElective/>
      },
      {
        path:'/faculty/profile',
        element:<FacultyProfile/>
      },
      {
        path: '/faculty/home',
        element:<FacultyHome/>
      },
      {
        path: '/faculty',
        element:<FacultyHome/>
      },
       {
        path:'/faculty/studentaccess',
        element:<ProvideStudentAccess/>
      },

      {
        path:'/faculty/addevent',
        element: <FacultyAddEvents/>
      },

      {
        path:'/faculty/add-oe-events',
        element:<FacultyAddOEEvents/>
      },

      {
        path:'/student/profile',
        element:<StudentProfile/>
      },

      {
        path:'/student/home',
        element:<StudentHome/>
      },

      {
        path:'/student/',
        element:<StudentHome/>
      },

      {
        path:'/student/openelective',
        element: <StudentOpenElective/>
      },
      {
        path:'/student/telegrambot',
        element: <TelegramBot/>
      },

      {
        path: '/calendar',
        element: <Calendar/>
      },
      {
        path:'/login',
        element:<UserLogin/>
      },
      {
        path:'/unauthorised',
        element: <Unauthorised/>
      },
    
     
      
  ]
  }
])

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <Provider store={store}>
      <ToastContainer/>

      <RouterProvider router={router}>

      </RouterProvider>
    </Provider>
  </ThemeProvider>
)
