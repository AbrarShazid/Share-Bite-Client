import React, { useState } from "react";
import { use } from "react";
import { AuthContext } from "../provider/AuthContext";

import toast from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";
import dayjs from "dayjs";

const AddFood = () => {

  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure()

  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = dayjs().format('YYYY-MM-DDTHH:mm');


  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    const form = e.target

    const name = form.name.value
    const img = form.image.value
    const quantity = parseInt(form.quantity.value);
    const expire = form.expireAt.value
    const location = form.location.value
    const notes = form.notes.value
    const userEmail = user.email
    const userName = user.displayName
    const availability = "Available"

    const data = {

      name,
      img,
      quantity,
      expire, location, notes,
      userEmail,
      userName,
      availability


    }


    axiosSecure.post("/foods", data)
      .then(res => {
        setIsSubmitting(false)
        toast.success(`${name} added successfully!`)
        e.target.reset()
      })
      .catch(err => {
        setIsSubmitting(false)
        toast.error("Something Went Wrong")

        e.target.reset()
      })

  };

  return (
    <div className=" bg-gradient-to-b from-[#fffaf5] to-white py-8 text-black">

      <div className="max-w-2xl mx-auto p-6 md:p-8  bg-white rounded-xl shadow-lg  ">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#ff6d03] mb-2">Share Your Food</h2>
          <p className="text-gray-600">Help reduce waste by donating excess food to those in need.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g., Fresh Apples, Cooked Pasta"

                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-1 focus:ring-[#ff6d03] focus:border-[#ff6d03] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="image"
                name="image"
                placeholder="https://example.com/food-image.jpg"

                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-1 focus:ring-[#ff6d03] focus:border-[#ff6d03] transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  placeholder="e.g., 5"

                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-1 focus:ring-[#ff6d03] focus:border-[#ff6d03] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date/Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="expireAt"
                  name="expireAt"
                  min={today}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-1 focus:ring-[#ff6d03] focus:border-[#ff6d03] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Address or specific instructions"

                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-1 focus:ring-[#ff6d03] focus:border-[#ff6d03] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Allergies, special instructions, etc."

                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-1 focus:ring-[#ff6d03] focus:border-[#ff6d03] transition"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Donor Information</h3>
            <div className="flex items-center space-x-3">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Donor"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium">{user.displayName}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white bg-[#ff6d03] hover:bg-[#e66500] focus:outline-none focus:ring-2 focus:ring-[#ff6d03] focus:ring-offset-2 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Share Food'}
          </button>
        </form>
      </div>



    </div>
  );
};

export default AddFood;