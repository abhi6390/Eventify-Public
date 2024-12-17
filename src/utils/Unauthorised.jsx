import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";


export default function Unauthorised() {
  const location = useLocation();
  
  // Only show Navigation component when not on the NotFound page
  // const showNavigation = location.pathname !== "*";

  console.log("not found ---- path",location.pathname)

    return (
      <>
        
        <main className="grid place-items-center bg-[#0F172A] min-h-screen px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-indigo-600">401</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-100 sm:text-5xl">Unauthorised</h1>
            <p className="mt-6 text-base leading-7 text-slate-100">Please Login through <b>git.edu</b> email only</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to='/'
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go back home
              </Link>
             
            </div>
          </div>
        </main>
      </>
    )
  }