import React, { useEffect, useState,use } from 'react';
import { Link, Outlet, useLocation } from 'react-router';

import dummyPic from "../assets/dummy.webp"
import { IoMdHome } from "react-icons/io";
import { ImProfile } from "react-icons/im";
import { MdOutlineRememberMe, MdDashboardCustomize ,MdAdminPanelSettings } from "react-icons/md";

import { FaUserAlt } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { BsFilePostFill } from "react-icons/bs";
import useUserRole from '../hooks/useUserRole';
import { AuthContext } from '../provider/AuthContext';


const DashboardLayout = () => {
  const {   role,isLoading  } = useUserRole()
  const { user } = use(AuthContext)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

 
  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  if (isLoading) {
    return <div></div>
  }

  return (
    <div className="flex min-h-screen bg-[#e4edec] manrope">
      {/* Mobile Menu Button - now shows on tablets too */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-2 left-4 z-300 p-2 bg-[#ff6a00] text-white rounded-md shadow-lg"
      >
        {isSidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        w-80 lg:w-1/5 bg-gradient-to-t from-[#ffdcb7] to-[#f8e7d4] text-[#ff6a00] fixed left-0 top-0 bottom-0 p-4 lg:py-6 lg:px-1 z-20 
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className='flex flex-col justify-center items-center gap-2'>
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 rounded-full overflow-hidden border border-[#ffe5ca]">
            <img
              className="w-full h-full object-cover"
              src={user.photoURL || dummyPic}
              alt="User"
            />
          </div>
          <div className='text-center mb-2'>
            <h1 className='text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold break-words'>{user.displayName}</h1>
            <h3 className='text-xs sm:text-sm lg:text-base break-all'>{user.email}</h3>
          </div>
        </div>

        <hr className="my-4 opacity-50" />

        <nav className="space-y-1 flex flex-col items-center mt-2 pb-6">
          <Link
            to={'/'}
            className='flex items-center gap-2 hover:bg-[#ff982b] hover:text-white p-2 rounded-md transition-colors w-full justify-center lg:justify-start'
            onClick={handleLinkClick}
          >
            <IoMdHome className="text-md" />
            <span className="text-sm lg:text-base font-semibold">Home</span>
          </Link>

          <Link
            to="profile"
            className='flex items-center gap-2 hover:bg-[#ff982b] hover:text-white p-2 rounded-md transition-colors w-full justify-center lg:justify-start '
            onClick={handleLinkClick}
          >
            <ImProfile className="text-md" />
            <span className="text-sm lg:text-base font-semibold">{role === "admin" ? 'Admin' : 'My'} Profile</span>
          </Link>
          
              <Link
            to={'/dashboard'}
            className='flex items-center gap-2 hover:bg-[#ff982b] hover:text-white p-2 rounded-md transition-colors w-full justify-center lg:justify-start'
            onClick={handleLinkClick}
          >
            <MdDashboardCustomize  className='text-md'/>
            <span className="text-sm lg:text-base font-semibold">Dashboard</span>
          </Link>

          {
            //  normal admin  here 

            (role==='admin'|| role==='super-admin') &&(
                <>
              <Link
                to="all-user"
                className={'flex items-center gap-2 hover:bg-[#ff982b] hover:text-white p-2 rounded-md transition-colors w-full justify-center lg:justify-start'}
                onClick={handleLinkClick}
              >
                <FaUserAlt   className="text-md" />
                <span className="text-sm lg:text-base font-semibold">All User</span>
              </Link>

              <Link
                to="all-post"
                className={'flex items-center gap-2 hover:bg-[#ff982b] hover:text-white p-2 rounded-md transition-colors w-full justify-center lg:justify-start'}
                onClick={handleLinkClick}
              >
                <BsFilePostFill  className="text-md" />
                <span className="text-sm lg:text-base font-semibold">All Post</span>
              </Link>

            </>
            )
           

          }

          {/* super admin route */}
          {
            role==='super-admin' &&
            <>
              <Link
                to="manage-admin"
                className={`flex items-center gap-2 hover:bg-[#ff982b] hover:text-white p-2 rounded-md transition-colors w-full justify-center lg:justify-start`}
                onClick={handleLinkClick}
              >
                <MdAdminPanelSettings className='text-md' />
                <span className="text-sm lg:text-base font-semibold">Manage Admin</span>
              </Link>
              
            </>
          }
        </nav>
      </aside>

      {/* Main content area */}
      <main className="w-full lg:ml-[20%] lg:w-4/5 min-h-screen">
        {/* Sticky top nav */}
        <div className="sticky top-0 bg-gradient-to-r from-[#fdeddc] to-[#fffaf5] shadow-md z-200 px-4 lg:px-6 py-4 border-b border-[#c7d4d3]">
          {role === 'super-admin' && <Link to={'/dashboard'} className="text-base md:text-xl font-semibold text-[#ff6a00] ml-12 lg:ml-0">Super Admin Dashboard</Link>}
          {role === 'admin' && <Link to={'/dashboard'} className="text-base md:text-xl font-semibold text-[#ff6a00] ml-12 lg:ml-0">Admin Dashboard</Link>}
        </div>

        {/* Page content */}
        <div className="p-4 lg:p-6 min-h-screen bg-gradient-to-r from-[#fffaf5] to-white">
   
            <Outlet key={location.pathname} />
     
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;