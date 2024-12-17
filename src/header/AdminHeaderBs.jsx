import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const menuItems = [
  { name: "Home", href: "/admin/basic-science" },
  
  { name: "Open Elective", href: "/admin/basic-science/openelective" },
  
  { name: "Logout", href: "/logout" },
];

function AdminHeaderBs() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const headerRef = useRef(null);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Measure header height
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  // Close sidebar on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('svg')
      ) {
        setIsSidebarOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsSidebarOpen(false);
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Sticky Header */}
      <header
        ref={headerRef}
        className="sticky top-0 z-10 w-full bg-blue-500 shadow-lg"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Desktop Navbar */}
          <nav className="hidden lg:block">
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
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Close Menu' : 'Open Menu'}
            className="lg:hidden focus:outline-none"
          >
            {isSidebarOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                className="fill-white"
                viewBox="0 0 50 50"
              >
                <path d="M25 23.586 L13.707 12.293 A1 1 0 0 0 12.293 13.707 L23.586 25 L12.293 36.293 A1 1 0 0 0 13.707 37.707 L25 26.414 L36.293 37.707 A1 1 0 1 0 37.707 36.293 L26.414 25 L37.707 13.707 A1 1 0 0 0 36.293 12.293 L25 23.586 z"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                className="fill-white"
                viewBox="0 0 50 50"
              >
                <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"></path>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        style={{
          top: `${headerHeight}px`,
          height: `calc(100vh - ${headerHeight}px)`,
        }}
        className={`fixed left-0 z-20 w-[70%] bg-blue-500 text-white transition-transform duration-300 lg:w-[20%] ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex flex-col p-4 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={toggleSidebar}
              className="block px-3 py-2 text-lg font-semibold hover:bg-gray-600 rounded"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      
    </>
  );
}

export default AdminHeaderBs;
