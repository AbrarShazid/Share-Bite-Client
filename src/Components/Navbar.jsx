import React, { use, useState } from "react";
import { NavLink } from "react-router";
import { AuthContext } from "../provider/AuthContext";
import toast from "react-hot-toast";
import spinner from "../assets/loading_small.json"
import Lottie from "lottie-react";
import dummyProfile from "../assets/dummy.webp"
import logo from "../assets/Favicon1.webp"


const Navbar = () => {
  const { user, logOut, loading } = use(AuthContext)


  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);


  const signOut = () => {

    logOut()
      .then(res => {

        toast.success("Log Out Successful!")

      })
      .catch(err => {
        toast.error("Something Went Wrong!!!")
      })


  }




  const navItemClass = ({ isActive }) =>
    isActive
      ? "border-b-2 border-[#ff6d03] font-medium text-white"
      : "hover:text-gray-300";

  const centerItem = (
    <>
      <NavLink  onClick={toggleMenu} to="/" className={navItemClass}>Home</NavLink>
      <NavLink  onClick={toggleMenu} to="/available-food" className={navItemClass}>Available Food</NavLink>
        <NavLink onClick={toggleMenu} to="/about-us" className={navItemClass}>About Us</NavLink>

       {user ? (
      <>
        <NavLink onClick={toggleMenu} to="/add-food" className={navItemClass}>Add Food</NavLink>
        <NavLink onClick={toggleMenu} to="/manage-my-food" className={navItemClass}>Manage My Food</NavLink>
        <NavLink onClick={toggleMenu} to="/food-request" className={navItemClass}>My Food Request</NavLink>
      </>
    ) : null}
     
    </>
  );

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/40 dark:bg-black/40 text-white dark:text-white border-b border-white/10 dark:border-white/10 shadow-sm">
    {/* // <nav "sticky top-0 z-50 backdrop-blur-md bg-white text-black border-b border-gray-200 shadow-sm dark:bg-white dark:text-black"> */}


     <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink to={'/'}>
          <div className="flex gap-2 items-center">
            <img className="w-10 h-10 rounded-full" src={logo} alt="Logo" />
            <h1 className="font-bold text-2xl text-white">
              ShareBite<span className="text-[#ff6d03] font-extrabold">.</span>
            </h1>
          </div>
        </NavLink>


        {/* Hamburger Icon */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-7">{centerItem}</div>

        {/* Right Side  */}
        <div className="hidden lg:flex ">




          {
            loading ? <Lottie animationData={spinner} className="h-[40px]"></Lottie> :
              <div className="space-x-4 ">
                {
                  user ?
                  <div className="flex gap-4">
                    <img
              src={user?.photoURL ? user.photoURL : dummyProfile}
              alt={user?.displayName || "User"}
              className="h-8 sm:h-9  w-8 sm:w-9 md:h-11  md:w-11 rounded-full border-2 border-white shadow-md object-cover transition-transform duration-600 hover:scale-110"
            />
                    <button onClick={signOut} >Log Out</button>
                    
                    </div>
                  
                  
                    :

                    <>


                      <NavLink to="/login" className={navItemClass}>Log In</NavLink>
                      <NavLink to="/register" className={navItemClass}>Register</NavLink>

                    </>
                }
              </div>
          }




        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden flex flex-col items-start gap-4 px-6 pb-4">
          {centerItem}

          {
            user ? <button onClick={signOut}>Log Out</button>
              : <>
                <NavLink to="/login" className={navItemClass}>Login</NavLink>
                <NavLink to="/register" className={navItemClass}>Register</NavLink>


              </>

          }

        </div>
      )}
    </nav>
  );
};

export default Navbar;
