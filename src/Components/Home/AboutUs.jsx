import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import map from "../../assets/worldmap.json";
import { LiaArrowRightSolid } from "react-icons/lia";

import image1 from '../../assets/volunteer.webp';
import image2 from '../../assets/baby_.webp';
import { Link } from 'react-router';


const AboutUs = () => {
  return (
    <section className="relative overflow-hidden pb-6 pt-8 lg:py-24 px-6 md:px-[5%] bg-gradient-to-br from-gray-50 to-orange-50">

      {/* 🌍 Lottie Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Lottie 
          animationData={map} 
          loop 
          autoplay 
          className="w-full h-full min-h-[600px] object-cover" 
        />
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* 🎞️ Animated Image Section */}
        <div className="relative grid grid-cols-1 md:grid-cols-7 gap-6">
          {/* First Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl shadow-2xl h-80 w-full col-span-1 md:col-span-4"
          >
            <img
              src={image1}
              alt="Volunteer"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </motion.div>

          {/* Second Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl shadow-2xl h-80 w-full mt-8 md:mt-36 md:-ml-32 col-span-1 md:col-span-3"
          >
            <img
              src={image2}
              alt="Community"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </motion.div>

          {/* Decorative shape */}
          <div className="absolute  -bottom-8 -right-8 w-32 h-32 bg-orange-300 rounded-full opacity-50 blur-xl"></div>
        </div>

        {/* 📄 Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 font-medium text-sm">
              About Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              We're a <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Non-Profit</span> Organization Making Real Change
            </h2>
            <div className="w-16 h-1.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
          </div>

          <ul className="space-y-4 text-gray-700">
            {[
              "Support people in extreme need",
              "Provide nutritious meals and essentials",
              "Share your love for community",
              "Make the world a better place"
            ].map((item, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 text-lg"
              >
                <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                  <LiaArrowRightSolid className="w-5 h-5" />
                </span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>

          <div className="space-y-4 text-gray-600">
            <p className="text-lg leading-relaxed">
              We are a community-driven platform committed to reducing food waste by connecting generous donors with those in need through innovative solutions.
            </p>
            <p className="leading-relaxed">
              Through collaboration, compassion, and technology, we're building bridges between surplus and scarcity—helping make nutritious food accessible to everyone, one meal at a time.
            </p>
          </div>

            <Link to={'/blog'}>
             <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Learn More About Us
          </motion.button>
            
            
            </Link>
         
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
