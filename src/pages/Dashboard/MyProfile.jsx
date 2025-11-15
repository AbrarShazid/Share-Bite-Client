import React, { use } from 'react';
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {AuthContext} from "../../provider/AuthContext"
import { useQuery } from "@tanstack/react-query";
import dummyImg from "../../assets/dummy.webp"
import dayjs from "dayjs";




const MyProfile = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure();

  const fetchProfile = async () => {
    const res = await axiosSecure.get(`/profile/${user.email}`);
    return res.data;
  };

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["profile", user.email],
    queryFn: fetchProfile,
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="w-full min-h-[70vh] p-4 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden p-6 lg:p-8">

        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full border shadow overflow-hidden">
            <img
              src={profile?.photoURL || dummyImg}
              alt={profile?.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-2xl font-semibold">{profile.name}</h2>
          <p className="text-gray-600">{profile.email}</p>
        </div>

        {/* Details */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="p-4 bg-[#fffaf5] rounded-lg">
            <h4 className="text-sm text-gray-600">User ID</h4>
            <p className="mt-1 text-xs break-words">{profile._id}</p>
          </div>

          <div className="p-4 bg-[#fffaf5] rounded-lg">
            <h4 className="text-sm text-gray-600">Role</h4>
            <p className="mt-1 font-medium">{profile.role}</p>
          </div>

          <div className="p-4 bg-[#fffaf5] rounded-lg">
            <h4 className="text-sm text-gray-600">Member Since</h4>
            <p className="mt-1 font-medium">
              {dayjs(profile.createdAt).format("DD MMMM, YYYY")}
            </p>
          </div>

        </div>


      </div>
    </div>
  );
};

export default MyProfile;