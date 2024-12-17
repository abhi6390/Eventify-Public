import React from 'react'
import Header from './header/Header'
import { useNavigate ,Link} from 'react-router-dom'



function TelegramBot() {
    const navigate = useNavigate()
  return (
    <div className='bg-[#0F172A] min-h-screen'>
        <Header/>

        <section className="text-slate-100">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-4xl tracking-tight font-extrabold  text-primary-600 dark:text-primary-500">Telegram Bot</h1>
            <div className='mx-auto text-center'>

                <svg
                width="100px"
                height="100px"
                className="text-center mx-auto"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                >
                <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7225)" />
                <path
                    d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z"
                    fill="white"
                />
                <defs>
                    <linearGradient
                    id="paint0_linear_87_7225"
                    x1="16"
                    y1="2"
                    x2="16"
                    y2="30"
                    gradientUnits="userSpaceOnUse"
                    >
                    <stop stopColor="#37BBFE" />
                    <stop offset="1" stopColor="#007DBB" />
                    </linearGradient>
                </defs>
                </svg>

            </div>
   
            <p className="mb-4 text-lg font-light  ">
                Join our Telegram Bot so that you never miss any important events . </p>
          
            <a  href='https://t.me/git_eventify_bot' target="_blank" rel="noopener noreferrer" className="inline-flex text-slate-100 bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-900 my-4">
                Join Telegram Bot
            </a>
         
        </div>   
    </div>
</section>
      
    </div>
  )
}

export default TelegramBot
