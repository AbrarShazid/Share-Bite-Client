import dayjs from 'dayjs';
import React, { use } from 'react';
import { Link, useParams } from 'react-router';
import { AuthContext } from '../provider/AuthContext';
import toast from 'react-hot-toast';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from "../Components/LoadingSpinner"
import { useQueryClient } from '@tanstack/react-query';
import { MdErrorOutline } from "react-icons/md";
import { FaRedoAlt } from "react-icons/fa";

const FoodDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure()
    const queryClient = useQueryClient();

  const { user } = use(AuthContext);
  // food details fetch 

 const { data: food, isLoading, isError } = useQuery({
  queryKey: ['foodDetails', id],
  queryFn: () => 
    axios.get(`https://share-bite-a11-server.vercel.app/food-details/${id}`)
         .then(res => res.data)
});
  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
 
   if (isError) return (
    <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-b from-[#fffaf5] to-white">
      {/* Icon */}
      <div className="bg-red-100 p-4 rounded-full mb-4">
         <MdErrorOutline   className="h-10 w-10 text-red-500"/>
      </div>
  
      {/* Message */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
      <p className="text-gray-600 mb-6 max-w-md text-center">
        We couldn’t load the available food details. Please check your connection and try again.
      </p>
  
      {/* Retry Button */}
      <button
        onClick={() => queryClient.invalidateQueries(['allFoods'])} 
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-colors"
      >
       
        <FaRedoAlt className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
  

 const requestSubmission=()=>{
  if(user){
    modalOpen()
  }
  else{
    toast.error("You Must Log In!")
  }
 }

  const expireDate = dayjs(food.expire);
  const daysUntilExpire = expireDate.diff(dayjs(), 'days');

  const getUrgencyBadge = () => {
    if (daysUntilExpire <= 0) return { text: 'Expired', color: 'bg-red-100 text-red-800' };
    if (daysUntilExpire <= 1) return { text: 'Expires today!', color: 'bg-red-100 text-red-800' };
    if (daysUntilExpire <= 3) return { text: 'Expires soon!', color: 'bg-orange-100 text-orange-800' };
    return null;
  };

  const urgencyBadge = getUrgencyBadge();

  // modal open 

  const modalOpen = () => {
    if (food.userEmail == user?.email) {
      toast.error("You cannot request your own donated food!!")
      return;
    }

    if (food.availability == "Available") {
      document.getElementById('my_modal_1').showModal()
    }
    else {
      toast.error("This food is already requested!")
    }

  }



  // update data to requested and 
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target

    const foodName = form.name.value;
    const foodImg = form.foodImg.value;
    const foodId = form.foodId.value;
    const donatorName = form.donatorName.value;
    const donatorEmail = form.donatorEmail.value;
    const userEmail = form.userEmail.value;
    const reqDate = form.reqDate.value;
    const pickUp = form.pickUpLocation.value;
    const expireDate = form.expireDate.value;
    const notes = form.notes.value;


    const allData = {

      foodName,
      foodImg,
      foodId,
      donatorName,
      donatorEmail,
      userEmail,
      reqDate,
      pickUp,
      expireDate,
      notes

    }

    axiosSecure.post("/requestFood", allData)
      .then(res => {

        return axiosSecure.patch(`/status-change/${food._id}`)
          .then(updateRes => {

            refetch();
            form.reset();
            document.getElementById('my_modal_1').close();
            toast.success("Request Submitted Successfully!");
          });
      })
      .catch(err => {
        toast.error(err.response?.data?.message || "Request failed. Try again later!");
      });

  };

  return (
 <div className='bg-gradient-to-b from-[#fffaf5] to-white '>




<div className="max-w-4xl mx-auto px-4 py-8 ">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-orange-500">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Food Details</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Main card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="relative h-64 md:h-80 w-full overflow-hidden">
     
          <img src={food?.img} alt={food?.name || "Food"}      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
          {urgencyBadge && (
            <span className={`absolute top-4 right-4 ${urgencyBadge.color} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
              {urgencyBadge.text}
            </span>
          )}
        </div>

        {/* food name and quantity */}
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{food.name}</h1>
            <span className={` ${food.availability == "Available" ? ' bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}     text-xs font-medium px-2.5 py-0.5 rounded-full `}>

              {
                food.availability == "Available" ? `${food.quantity} ${food.availability}` : `${food.availability}`

              }
            </span>
          </div>

          {/* Meta information */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-1.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{food.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-1.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Expires: {expireDate.format('MMMM D, YYYY')} ({daysUntilExpire > 0 ? `${daysUntilExpire} days left` : `${daysUntilExpire * -1} days ago`})</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">{food.notes}</p>
          </div>

          {/* Donor info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Donated by</h3>
            <div className="flex items-center">
              <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center text-orange-600 font-medium">
                {food.userName.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{food.userName}</p>
                <p className="text-sm text-gray-500">{food.userEmail}</p>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-center">
            <button
              className={` btn w-full md:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg text-center transition duration-300 hover:shadow-lg hover:-translate-y-1 border-0`}
              onClick={requestSubmission}
            >
              Request This Food
            </button>

            {/* Modal */}
            <dialog id="my_modal_1" className="modal modal-bottom sm:modal-middle bg-white">
              <div className="modal-box max-w-full w-full sm:max-w-md bg-white">
                <h3 className="font-bold text-lg md:text-xl mb-4 text-black">Request Food: {food.name}</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    {/* food name  */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Food Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={food.name}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-400 text-gray-700"
                      />
                    </div>

                    {/* food image link  */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Food Image Link <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="foodImg"
                        value={food.img}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-400 text-gray-700"
                      />
                    </div>

                    {/* food id  */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Food Id <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="foodId"
                        value={food._id}

                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-400 text-gray-700"
                      />


                    </div>
                    {/* donator name  */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Donator Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="donatorName"
                          value={food.userName}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-400 text-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Donator Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="donatorEmail"
                          value={food.userEmail}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-400 text-gray-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="userEmail"
                          value={user?.email || ''}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-400 text-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Request Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          name='reqDate'
                          value={dayjs().format('MMMM D, YYYY')}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-400 text-gray-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">



                      {/* location  */}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pick Up Location<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="pickUpLocation"
                          value={food.location}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-400 text-gray-700"
                        />
                      </div>
                      {/* expire data  */}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expire Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          name='expireDate'
                          value={expireDate.format('MMMM D, YYYY')}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-400 text-gray-700"
                        />
                      </div>

                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes
                      </label>
                      <textarea
                        name="notes"
                        placeholder="Allergies, special instructions, etc."
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-0 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition  placeholder-gray-400 text-gray-700"
                      />
                    </div>
                  </div>

                  <div className="modal-action">
                    <button
                      type="submit"

                      className={`w-full py-3 px-4 rounded-lg font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition `}
                    >

                      <span className="flex items-center justify-center">

                        Request Food
                      </span>

                    </button>
                  </div>
                </form>

                <div className="modal-action absolute top-2 right-2">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle">✕</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </div>

 </div>
  );
};

export default FoodDetails;