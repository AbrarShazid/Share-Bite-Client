import { use, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../provider/AuthContext";
import Swal from "sweetalert2";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BiDonateHeart, BiEdit, BiTrash } from "react-icons/bi";

import dummyBackup from "../assets/dummyFood.webp"
import useAxiosSecure from "../hooks/useAxiosSecure";

const ManageMyFood = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const allData = async () => {
    const res = await axiosSecure.get(`/mydata/${user.email}`);
    return res.data;
  };

  const { data: foods = [], isError } = useQuery({
    queryKey: ["individualItems", user.email],
    queryFn: allData
  });

  useEffect(() => {
    if (isError) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load your food donations',
      });
    }
  }, [isError]);

  // Delete functionality
  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/foods/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["individualItems"]);
      Swal.fire("Deleted!", "Your food item has been deleted.", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete food item.", "error");
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  return (
  <div className="bg-gradient-to-b from-[#fffaf5] to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Manage Your Donations
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            View, update, or delete your food donations
          </p>
        </div>
        <NavLink
          to="/add-food"
          className="inline-flex items-center px-4 py-2 mt-2 md:mt-0 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
        >
          <BiDonateHeart className="mr-2" />
          Donate Food
        </NavLink>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white shadow-lg rounded-xl overflow-hidden ">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className=" bg-orange-100 text-orange-700">
              <tr>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold">
                  Food Item
                </th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {foods.map((food) => (
                <tr key={food._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 ">
                    <div className="flex items-center justify-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={food.img || `${dummyBackup}`} alt={food.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{food.name}</div>

                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">{food.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${food.availability == "Available" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {food.availability}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium ">
                    <button
                      onClick={() => navigate(`/update/${food._id}`)}
                      className="text-orange-500 hover:text-orange-700 mr-4"
                      title="Edit"
                    >
                      <BiEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(food._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <BiTrash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {foods.map((food) => (
          <div key={food._id} className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12">
                  <img className="h-12 w-12 rounded-full object-cover" src={food.img || `${dummyBackup}`} alt={food.name} />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{food.name}</h3>
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${food.availability == "Available" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {food.availability}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">Quantity:</span> {food.quantity}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">Location:</span> {food.location}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => navigate(`/update/${food._id}`)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <BiEdit className="mr-1.5 h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(food._id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <BiTrash className="mr-1.5 h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {foods.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <BiDonateHeart className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No food donations</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't donated any food yet. Get started by donating some food.
          </p>
          <div className="mt-6">
            <NavLink
              to="/add-food"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <BiDonateHeart className="mr-2 -ml-1" />
              Donate Food
            </NavLink>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default ManageMyFood;