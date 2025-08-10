import Lottie from 'lottie-react';
import React from 'react';
import error_lottie from "../assets/404_lottie.json"
import { motion} from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { NavLink } from 'react-router';


const Error = () => {
  return (
    <div >
      <Lottie animationData={error_lottie} loop autoPlay  className='h-[80vh]'> 




      </Lottie>


<div className='text-center'>


<NavLink to={'/'}>
 <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.05,
        background: 'linear-gradient(90deg, #ff6d03, #ff944d)',
        boxShadow: '0 10px 24px rgba(255, 109, 3, 0.35)',
      }}
      whileTap={{ scale: 0.95, y: 2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      className="relative group overflow-hidden px-6 py-3 rounded-full text-white font-semibold bg-[#ff6d03] shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6d03]"
    >
      <span className="relative z-10 flex items-center gap-2">
        Home
        {/* Motion Arrow */}
        <motion.span
          className="inline-block"
          whileHover={{ x: 6 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <FaArrowLeft size={14} />
        </motion.span>
      </span>

      {/* Optional shimmer effect */}
      <span className="absolute inset-0 bg-white opacity-10 blur-md animate-pulse pointer-events-none"></span>
    </motion.button>

</NavLink>


</div>
      
    </div>
  );
};

export default Error;