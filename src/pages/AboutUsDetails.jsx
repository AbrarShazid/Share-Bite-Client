import React from "react";
import { motion } from "framer-motion";
import { FaHandsHelping, FaLeaf, FaHeart } from "react-icons/fa";

const AboutUsDetails = () => {
  return (
    <div className="bg-gradient-to-b from-[#fffaf5] to-white min-h-screen">
      {/* Hero Section */}
      <section className="px-[5%] py-12 md:py-20 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About <span className="text-orange-500">ShareBite</span>
        </motion.h1>
        <motion.p
          className="text-gray-600 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          ShareBite is a community-driven platform dedicated to reducing food
          waste and sharing surplus food with those in need. Whether you're an
          individual or an organization, we make donating and requesting food
          seamless, secure, and impactful.
        </motion.p>
      </section>

      {/* Mission / Vision / Values */}
      <section className="px-[5%] py-12 grid md:grid-cols-3 gap-8">
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-md border border-[#ff6d0332] flex flex-col items-center text-center"
          whileHover={{ y: -5 }}
        >
          <FaHandsHelping className="text-orange-500 w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
          <p className="text-gray-600">
            To connect surplus food donors with individuals and organizations
            in need, creating a network of generosity and sustainability.
          </p>
        </motion.div>

        <motion.div
          className="bg-white p-8 rounded-2xl shadow-md border border-[#ff6d0332] flex flex-col items-center text-center"
          whileHover={{ y: -5 }}
        >
          <FaLeaf className="text-green-500 w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
          <p className="text-gray-600">
            A world where no food goes to waste and everyone has access to
            nutritious meals through a community of sharing.
          </p>
        </motion.div>

        <motion.div
          className="bg-white p-8 rounded-2xl shadow-md border border-[#ff6d0332] flex flex-col items-center text-center"
          whileHover={{ y: -5 }}
        >
          <FaHeart className="text-red-500 w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Our Values</h3>
          <p className="text-gray-600">
            Compassion, sustainability, and community collaboration are at the
            heart of everything we do.
          </p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="px-[5%] py-16 ">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
            alt="Food sharing"
            className="w-full h-72 object-cover rounded-2xl shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Our Story
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ShareBite started with a simple idea: bridge the gap between food
              surplus and hunger. From small local donations to large-scale
              organizational partnerships, we’ve grown into a trusted platform
              that facilitates safe, efficient, and meaningful food sharing.
            </p>
            <p className="text-gray-700 leading-relaxed">
              With modern technology and a passion for sustainability, we’re
              building a community where sharing is second nature and waste is a
              thing of the past.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsDetails;