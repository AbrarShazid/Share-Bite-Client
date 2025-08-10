import React from 'react';
import bannerImg from "../../assets/Banner.webp";
import { NavLink } from 'react-router';
import { BiDonateHeart } from "react-icons/bi";
import { MdFoodBank } from "react-icons/md";
import { Typewriter } from 'react-simple-typewriter';
import { FaArrowRightLong } from "react-icons/fa6";


// CountUp
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const Banner = () => {

  const { ref, inView } = useInView({ triggerOnce: true });
  return (
    <div >
      {/* Banner Section */}
      <div
        className="w-full grid lg:grid-cols-2 px-[5%] bg-cover bg-center text-white min-h-[90vh] pt-10 pb-10 lg:pb-32 "
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)), url(${bannerImg})`,
        }}
      >
        {/* Left */}
        <div className="flex flex-col justify-center max-w-xl space-y-4 mb-10 lg:mb-0">
          <h3 className="text-[#ff6d03] text-xl lg:text-2xl font-semibold tracking-wide">
            <Typewriter
              words={[
                'Together, We Rise...',
                'Together, We Give...',
                'Together, We Heal...',
                'Together, We Change the World...'
              ]}
              loop
              cursor
              cursorStyle='|'
              typeSpeed={160}
              deleteSpeed={100}
              delaySpeed={2500}
            />
          </h3>
          <h1 className="text-3xl lg:text-5xl font-extralight leading-tight">
            A Better World Starts with a Single Act of Kindness
          </h1>
          <p className="text-lg text-gray-200 border-l-2 border-[#ff6d03] pl-3">
            Be part of a movement that turns surplus into support. Help reduce food waste and uplift lives — one meal, one family, one future at a time.
          </p>
        </div>

        {/* Right */}
        <div className='flex flex-col justify-center'>
          <div className='bg-white/5 backdrop-blur-md border border-white/20 p-6 md:p-10 rounded-2xl shadow-2xl space-y-5'>
            <h2 className='text-2xl md:text-3xl font-semibold'>Only by Helping Each Other We Can Make World Better</h2>
            <p className='opacity-80'>
              Hunger isn’t just the absence of food—it’s the absence of hope. Every untouched meal, every small effort, can become a lifeline. When you give, you’re not just feeding a body. You’re reminding someone, somewhere, that they still matter.
            </p>

            <div className='flex flex-col md:flex-row gap-4'>
              <NavLink to={'/add-food'} className='border border-[#ff6c03] py-2 rounded-lg text-xl flex items-center gap-2 justify-center w-full hover:text-[#ff6d03] transition hover:scale-105'>
                <BiDonateHeart /> Donate Food
              </NavLink>
              <NavLink to={'/available-food'} className='border border-[#ff6c03] py-2 rounded-lg text-xl flex items-center gap-2 justify-center w-full hover:text-[#ff6d03] transition hover:scale-105'>
                <MdFoodBank /> Get Food
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}

<div className='mx-[5%]  mt-6  lg:-mt-20 relative '>


  <div className=' bg-white rounded-lg shadow-xl p-5 xl:p-7 z-10' ref={ref}>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center items-center'>
          {/* Stat Card 1 */}
          <div>

            <h1 className='text-[#ff6d03] text-3xl font-bold'>{inView && <CountUp end={20000} duration={6} separator="," />}+</h1>
            <hr className="w-8 mx-auto my-2 border-t-2 border-[#ff6d03]" />
            <p className='text-gray-700'>Number of Donations</p>
          </div>

          {/* Stat Card 2 */}
          <div>
            <h1 className='text-[#ff6d03] text-3xl font-bold'>
              {inView && <CountUp end={10000} duration={7} separator="," />}+


            </h1>
            <hr className="w-8 mx-auto my-2 border-t-2 border-[#ff6d03]" />
            <p className='text-gray-700'>Volunteers</p>
          </div>

          {/* Stat Card 3 */}
          <div>
            <h1 className='text-[#ff6d03] text-3xl font-bold'>{inView && <CountUp end={97} duration={9} separator="," />}%</h1>
            <hr className="w-8 mx-auto my-2 border-t-2 border-[#ff6d03]" />
            <p className='text-gray-700'>Completed Projects</p>
          </div>

          {/* CTA Box */}
          <div className='bg-[#ff6d03] text-white rounded-xl p-4 flex flex-col justify-center items-center gap-2'>
            <hr className="w-1/3 border-t-2 border-white" />
            <h1 className='text-xl font-semibold'>Our Goal is to Help Poor People</h1>

                


            
          </div>
        </div>
      </div>




</div>

      
    </div>
  );
};

export default Banner;
