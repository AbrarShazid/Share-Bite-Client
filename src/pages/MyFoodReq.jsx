import { useQuery } from '@tanstack/react-query';

import React, { use } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../provider/AuthContext';
import dayjs from 'dayjs';
import { FiClock, FiMapPin, FiCalendar, FiUser, FiInfo } from 'react-icons/fi';
import LoadingSpinner from '../Components/LoadingSpinner';
import dummyFood from "../assets/dummyFood.webp"
import useAxiosSecure from '../hooks/useAxiosSecure';



const MyFoodReq = () => {
  const { user } = use(AuthContext);


  const axiosSecure = useAxiosSecure()


 

  const fetchFoods = async () => {
    
    const res = await axiosSecure.get(`/myReqFood`);
    return res.data;
  };
  const { data: foods = [], isLoading, error } = useQuery({
    queryKey: ['myReqFood', user?.email],
    queryFn: fetchFoods,
    enabled: !!user?.email,

  });

  if (isLoading) return <LoadingSpinner />;

  if (error) return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="text-center p-6 max-w-md bg-white rounded-xl shadow-md border border-red-100">
        <h3 className="text-xl font-medium text-red-600 mb-2">Error Loading Requests</h3>
        <p className="text-gray-600 mb-4">Failed to fetch your food requests.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-[#fffaf5] to-white">

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Your <span className="text-orange-500">Food Requests</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          All the food items you've requested
        </p>
      </div>

      {foods.length > 0 ? (
        <div
          className={`${foods.length < 3
            ? 'flex flex-wrap justify-center gap-6'
            : 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
            }`}
        >

          {foods.map((food) => (
            <div
              key={food._id}
              className="bg-white md:min-w-[46%] lg:min-w-[33%] rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={food.foodImg || dummyFood}
                  alt={food.foodName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">{food.foodName}</h3>
                </div>
              </div>

              <div className="p-5 space-y-4">


                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <FiMapPin className="mr-1" /> {food.pickUp}
                </span>


                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiUser className="mr-2 text-gray-500" />
                    <span>Donated by: <span className="font-medium">{food.donatorName}</span></span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiCalendar className="mr-2 text-gray-500" />
                    <span>Expires: <span className="font-medium">{dayjs(food.expireDate).format('MMM D, YYYY')}</span></span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiClock className="mr-2 text-gray-500" />
                    <span>Requested: <span className="font-medium">{dayjs(food.reqDate).format('MMM D, YYYY')}</span></span>
                  </div>
                </div>

                {food.notes && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <FiInfo className="mr-2 text-gray-500" />
                      <span className="font-medium">Notes:</span>
                    </div>
                    <p className="text-sm text-gray-600 pl-6">{food.notes}</p>
                  </div>
                )}

                <div className="pt-4">
                  <Link
                    to={`/food/${food.foodId}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 text-center p-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <FiClock className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Requests Yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't requested any food items. Browse available donations to get started.
          </p>
          <Link
            to="/available-food"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
          >
            Browse Available Food
          </Link>
        </div>
      )}
    </div>


    </div>
  );
};

export default MyFoodReq;