import { use, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../provider/AuthContext";
import Swal from "sweetalert2";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BiDonateHeart, BiEdit, BiTrash } from "react-icons/bi";
import { FaFileInvoice } from "react-icons/fa";

import dummyBackup from "../assets/dummyFood.webp"
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../Components/LoadingSpinner"
import { jsPDF } from "jspdf";

const ManageMyFood = () => {
  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const allData = async () => {
    const res = await axiosSecure.get(`/mydata/${user.email}`);
    return res.data;
  };

  const { data: foods = [], isError, isLoading } = useQuery({
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
  // Generate Invoice for all donated food
  const generateAllFoodsInvoice = () => {
    if (foods.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Food Donations',
        text: 'You need to have at least one food donation to generate an invoice.',
      });
      return;
    }
    setShowInvoiceModal(true);
  };

  const downloadAllFoodsInvoice = () => {
    if (foods.length === 0) return;

    const doc = new jsPDF();

    // Colors
    const primaryColor = [255, 109, 3]; // #ff6d03
    const secondaryColor = [41, 128, 185]; // #2980b9
    const darkColor = [52, 73, 94]; // #34495e
    const lightColor = [236, 240, 241]; // #ecf0f1

    // Header Section
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Share Bite", 105, 18, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("All Food Donations Invoice", 105, 25, { align: 'center' });

    // Invoice Title
    doc.setTextColor(...darkColor);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ALL DONATIONS SUMMARY", 105, 45, { align: 'center' });

    // Invoice Details Box
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.rect(15, 55, 180, 15);

    doc.setFontSize(10);
    doc.setTextColor(...darkColor);
    doc.text(`Invoice #: SB-ALL-${Date.now().toString().slice(-8)}`, 20, 63);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 63);
    doc.text(`Total Items: ${foods.length}`, 80, 63);

    // Donor Information Section
    doc.setFillColor(...lightColor);
    doc.rect(15, 75, 180, 35, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(15, 75, 180, 35);

    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("DONOR INFORMATION", 20, 85);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Name: ${user.displayName}`, 20, 95);
    doc.text(`Email: ${user.email}`, 110, 95);

    // Summary Statistics

    const availableItems = foods.filter(food => food.availability === "Available").length;
    const requestedItems = foods.filter(food => food.availability === "Requested").length;


    doc.text(`Available: ${availableItems} | Requested: ${requestedItems}`, 20, 105);

    // Food Items Table Header
    let currentY = 120;

    doc.setFillColor(...secondaryColor);
    doc.rect(15, currentY, 180, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Food Name", 20, currentY + 5);
    doc.text("Qty", 120, currentY + 5);
    doc.text("Status", 140, currentY + 5);
    doc.text("Expiry", 160, currentY + 5);

    currentY += 13;

    // Food Items Rows
    foods.forEach((food, index) => {
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;

        // Add table header on new page
        doc.setFillColor(...secondaryColor);
        doc.rect(15, currentY, 180, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Food Name", 20, currentY + 5);
        doc.text("Qty", 120, currentY + 5);
        doc.text("Status", 140, currentY + 5);
        doc.text("Expiry", 160, currentY + 5);
        currentY += 13;
      }

      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
      } else {
        doc.setFillColor(245, 245, 245);
      }
      doc.rect(15, currentY, 180, 10, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(15, currentY, 180, 10);

      doc.setTextColor(...darkColor);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      // Truncate long food names
      const foodName = food.name.length > 25 ? food.name.substring(0, 22) + '...' : food.name;
      doc.text(foodName, 20, currentY + 6);
      doc.text(food.quantity.toString(), 120, currentY + 6);

      // Status with color coding
      if (food.availability === "Available") {
        doc.setTextColor(0, 128, 0); // Green
      } else {
        doc.setTextColor(255, 0, 0); // Red
      }
      doc.text(food.availability, 140, currentY + 6);

      doc.setTextColor(...darkColor);
      const expiryDate = new Date(food.expire).toLocaleDateString();
      doc.text(expiryDate, 160, currentY + 6);

      currentY += 12;
    });

    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 270, 195, 270);

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text("Thank you for your continuous support in fighting food waste!", 105, 275, { align: 'center' });
    doc.text("This invoice summarizes all your food donations on Share Bite", 105, 280, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });

    // Save PDF
    doc.save(`all-donations-invoice-${user.displayName.replace(/\s+/g, '-')}.pdf`);

    // Close modal
    setTimeout(() => {
      setShowInvoiceModal(false);
    }, 500);
  };


  if (isLoading) return <div className="min-h-screen flex justify-center items-center">
    <LoadingSpinner></LoadingSpinner>
  </div>;

  return (

    <div className="bg-gradient-to-b from-[#fffaf5] to-white  min-h-screen">

      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-40 flex justify-center items-center z-[9999] p-4 overflow-y-auto ">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg relative  mt-32">
            <div className="bg-[#ff6d03] text-white py-4 px-6 rounded-t-lg">
              <h1 className="text-2xl font-bold text-center ">Share Bite</h1>
              <p className="text-sm text-center opacity-90">All Donations Invoice Preview</p>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-bold text-center text-gray-800 mb-4">ALL DONATIONS SUMMARY</h2>

              <div className="border border-[#ff6d03] rounded px-4 py-2 mb-4">
                <div className="md:flex justify-between text-sm text-gray-800">
                  <span>Invoice #: SB-ALL-{Date.now().toString().slice(-8)}</span>
                  <p>Date: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-sm text-gray-800 mt-1">
                  <span>Total Items: {foods.length}</span>
                </div>
              </div>

              <div className="bg-gray-100 border border-gray-300 rounded p-4 mb-4">
                <h3 className="font-bold text-gray-800 text-sm mb-2">DONOR INFORMATION</h3>
                <div className="text-xs text-gray-700 grid md:grid-cols-2 gap-2">
                  <p><span className="font-medium">Name:</span> {user.displayName}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>

                  <p><span className="font-medium">Available/Requested:</span> {foods.filter(f => f.availability === "Available").length}/{foods.filter(f => f.availability === "Requested").length}</p>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto mb-4">
                <div className="bg-[#2980b9] text-white text-xs font-bold py-2 px-4 rounded-t">
                  <div className="grid grid-cols-4">
                    <span>Food Name</span>
                    <span className="text-center">Qty</span>
                    <span className="text-center">Status</span>
                    <span className="text-right">Expiry</span>
                  </div>
                </div>
                {foods.map((food, index) => (
                  <div key={food._id} className={`border border-gray-300 border-t-0 py-2 px-4 text-xs ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <div className="grid grid-cols-4">
                      <span className="truncate">{food.name}</span>
                      <span className="text-center">{food.quantity}</span>
                      <span className={`text-center ${food.availability === "Available" ? 'text-green-600' : 'text-red-600'}`}>
                        {food.availability}
                      </span>
                      <span className="text-right">{new Date(food.expire).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-300 pt-4">
                <p className="text-xs text-gray-500 text-center">
                  This invoice summarizes all your food donations on Share Bite
                </p>
              </div>

              <div className="mt-6 flex justify-between bg-white py-2 ">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition font-medium"
                  onClick={() => setShowInvoiceModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="px-6 py-2 bg-[#ff6d03] text-white rounded hover:bg-[#e66500] transition font-medium"
                  onClick={downloadAllFoodsInvoice}
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8  ">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Manage Your Donations
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              View, update, or delete your food donations
            </p>
          </div>
          <button
            onClick={generateAllFoodsInvoice}
            className="inline-flex items-center px-4 py-2 mt-2 md:mt-0 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
          >
            <FaFileInvoice className="mr-2" />
            Generate Invoice
          </button>
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