import React, { useState } from 'react'
import supabase from '../supabase/supabase'
import {   useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
function AdminLogin() 
{
  const [email,setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const navigate = useNavigate()
  const signInUser = async(credentials)=>{
    // console.log(credentials);
    
    
    const { data, error } = await supabase.auth.signInWithPassword(credentials)

    if(data){
      if(data.user){
        navigate('/admin')
        console.log(data);
        toast.success("Successfully logged in !!!")

        
        // alert('hahhahaha')
      }
      else{
        console.log(data);
        
      }
    }
     if(error){
      console.log(error);
      toast.error("Incorrect credentials !!!")
    }

    
 
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const credentials = {
      email: email,
      password :password,
      
    }
    console.log(credentials);
    
    signInUser(credentials)
    // createNewUser(credentials)
  } 

  const createNewUser = async (credentials) => {
    const {data, error} = await supabase.auth.signUp(credentials)
    
    console.log(data);
    console.log(error);
    
    
    
  }

  return (
    <section className='bg-[#0F172A]  min-h-screen'>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <div className="mb-2 flex justify-center">
           
          </div>
          <h2 className="text-center text-2xl font-bold leading-tight text-slate-100">
            Sign in to your account
          </h2>
          
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="" className="text-base font-medium text-slate-100">
                  {' '}
                  Email address{' '}
                </label>
                <div className="mt-2">
                  <input 
                    className="flex text-slate-100 h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={(e)=>(setEmail(e.target.value))}
            
                  ></input>
                  
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="" className="text-base font-medium text-slate-100">
                    {' '}
                    Password{' '}
                  </label>
                  
                </div>
                <div className="mt-2">
                  <input 
                    className="flex text-slate-100 h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={(e)=>(setPassword(e.target.value))}
            
                  ></input>
                  
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-sky-700 px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-sky-600"
                >
                  Sign In 
                </button>
              </div>
            </div>
          </form>
         
        </div>
      </div>
    </section>
  )
}

export default AdminLogin