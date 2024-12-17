import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const menuItems = [
  { name: "Home", href: "/faculty/home" },
  { name: "Profile", href: "/faculty/profile" },
  { name: "Logout", href: "/logout" },
];

function FacultyHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const navigate = useNavigate();
  const headerRef = useRef(null);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Measure the height of the header
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }

    const handleResize = () => {
      setHeaderHeight(headerRef.current.offsetHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest("svg")
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  return (
    <div ref={headerRef} className="sticky top-0 z-10 w-full bg-blue-500">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Desktop Navbar */}
        <div className="hidden lg:block">
          <ul className="inline-flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className="text-md font-semibold text-white hover:text-gray-200"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="lg:hidden">
          {isSidebarOpen ? (
            /* Close Button */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              className="fill-white cursor-pointer"
              onClick={toggleSidebar}
              viewBox="0 0 50 50"
            >
              <path d="M25 23.586 L13.707 12.293 A1 1 0 0 0 12.293 13.707 L23.586 25 L12.293 36.293 A1 1 0 0 0 13.707 37.707 L25 26.414 L36.293 37.707 A1 1 0 1 0 37.707 36.293 L26.414 25 L37.707 13.707 A1 1 0 0 0 36.293 12.293 L25 23.586 z"></path>
            </svg>
          ) : (
            /* Hamburger Icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              className="fill-white cursor-pointer"
              onClick={toggleSidebar}
              viewBox="0 0 50 50"
            >
              <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"></path>
            </svg>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <aside
          ref={sidebarRef}
          style={{
            top: `${headerHeight}px`, // Start below the header
            height: `calc(100% - ${headerHeight}px)`, // Occupy remaining height
          }}
          className="fixed left-0 z-20 bg-blue-500 opacity-95 w-[50%] sm:w-1/2"
        >
          {/* Sidebar Links */}
          <nav className="mt-6 px-4 flex flex-col space-y-2">
            {menuItems.map((item) => (
              <Link
                to={item.href}
                key={item.name}
                onClick={toggleSidebar}
                className="block px-2 py-3 text-white text-lg font-semibold hover:bg-gray-600 rounded-md"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>
      )}
    </div>
  );
}

export default FacultyHeader;
