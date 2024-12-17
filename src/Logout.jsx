import React, { useEffect } from 'react'
import supabase from './supabase/supabase'
import { useNavigate } from 'react-router-dom'
import Loader from './loader/Loader'

function Logout() {
    const navigate = useNavigate()

    const handleLogout = async()=>{

        const { error } = await supabase.auth.signOut()

        if(error){
            console.log(error);
            
        }else{
            navigate('/')
        }
    }

    useEffect(()=>{
        handleLogout()
    },[])


  return (
    <div>
      <Loader/>
    </div>
  )
}

export default Logout
