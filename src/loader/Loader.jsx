import React from 'react'


function Loader() {
  let circleCommonClasses = 'h-5 w-5 bg-slate-200   rounded-full';

    return (
        <div className='flex bg-[#0F172A] min-h-screen justify-center items-center h-[70vh]'>
            <div className={`${circleCommonClasses} mr-1  animate-bounce`}></div>
            <div
                className={`${circleCommonClasses} mr-1  animate-bounce200`}
            ></div>
            <div className={`${circleCommonClasses}  animate-bounce400`}></div>
        </div>
    );

}

export default Loader