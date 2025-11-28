import React, { useState } from "react";
import { use } from "react";
import { AuthContext } from "../provider/AuthContext";
import toast from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";

const AddFood = () => {

  const { user } = use(AuthContext);
  const axiosSecure = useAxiosSecure()

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const today = dayjs().format('YYYY-MM-DDTHH:mm');


  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    const form = e.target

    const name = form.name.value
    const img = form.image.files[0]
    const quantity = parseInt(form.quantity.value);
    const expire = form.expireAt.value
    const location = form.location.value
    const notes = form.notes.value
    const userEmail = user.email
    const userName = user.displayName
    const availability = "Available"
    const formData = new FormData();

    formData.append('name', name);
    formData.append('image', img); // 
    formData.append('quantity', quantity);
    formData.append('expire', expire);
    formData.append('location', location);
    formData.append('notes', notes);
    formData.append('userEmail', userEmail);
    formData.append('userName', userName);
    formData.append('availability', availability);


    axiosSecure.post("/foods", formData)
      .then(res => {
        setIsSubmitting(false)
        const addedFood = res.data.data;
        setInvoiceData(addedFood);
        setShowInvoice(true);
        toast.success(`${name} added successfully!`)
        form.reset();
      })
      .catch(err => {
        setIsSubmitting(false)
        toast.error("Something Went Wrong")

        form.reset();
      })

  };

const downloadInvoice = () => {
    if (!invoiceData) return toast.error("Invoice content not available");

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
    doc.text("Food Donation Invoice", 105, 25, { align: 'center' });
    
    // Invoice Title
    doc.setTextColor(...darkColor);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("DONATION INVOICE", 105, 45, { align: 'center' });
    
    // Invoice Details Box
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.rect(15, 55, 180, 15);
    
    doc.setFontSize(10);
    doc.setTextColor(...darkColor);
    doc.text(`Invoice #: SB-${invoiceData._id.toString().slice(-8).toUpperCase()}`, 20, 63);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 63);
    
    // Donor Information Section
    doc.setFillColor(...lightColor);
    doc.rect(15, 75, 87, 40, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(15, 75, 87, 40);
    
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("DONOR INFORMATION", 20, 85);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Name: ${invoiceData.userName}`, 20, 95);
    doc.text(`Email: ${invoiceData.userEmail}`, 20, 102);
    doc.text(`Donation Date: ${new Date().toLocaleDateString()}`, 20, 109);
    
    // Food Details Section
    doc.setFillColor(...lightColor);
    doc.rect(108, 75, 87, 40, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(108, 75, 87, 40);
    
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("FOOD DETAILS", 113, 85);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Status: Donated`, 113, 95);
    doc.text(`Availability: Available`, 113, 102);
  
    
    // Food Information Table Header
    doc.setFillColor(...secondaryColor);
    doc.rect(15, 125, 180, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Description", 20, 130);
    doc.text("Quantity", 120, 130);
    doc.text("Expiry", 160, 130);
    
    // Food Information Row
    doc.setFillColor(250, 250, 250);
    doc.rect(15, 133, 180, 15, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(15, 133, 180, 15);
    
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "normal");
    doc.text(invoiceData.name, 20, 141);
    doc.text(invoiceData.quantity.toString(), 120, 141);
    doc.text(new Date(invoiceData.expire).toLocaleDateString(), 160, 141);
    
    
    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 250, 195, 250);
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text("Thank you for your generous donation! Together we can reduce food waste and help those in need.", 105, 255, { align: 'center' });
    doc.text("This is an auto-generated invoice from Share Bite Food Donation Platform", 105, 260, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 265, { align: 'center' });
    
    // Save 
    doc.save(`donation-invoice-${invoiceData._id}.pdf`);
    
    // Close modal auto 
    setTimeout(() => {
      setShowInvoice(false);
      setInvoiceData(null);
    }, 500);
  };

  return (
    <>
     {showInvoice && invoiceData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs bg-opacity-40 flex justify-center items-center z-[9999] p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg relative">
            {/* Header - Matching PDF */}
            <div className="bg-[#ff6d03] text-white py-4 px-6 rounded-t-lg">
              <h1 className="text-2xl font-bold text-center">Share Bite</h1>
              <p className="text-sm text-center opacity-90">Food Donation Invoice</p>
            </div>

            <div className="p-6">
              {/* Invoice Title */}
              <h2 className="text-xl font-bold text-center text-gray-800 mb-4">DONATION INVOICE</h2>

              {/* Invoice Details Box */}
              <div className="border border-[#ff6d03] rounded px-4 py-2 mb-4">
                <div className="flex justify-between text-sm text-gray-800">
                  <span>Invoice #: SB-{invoiceData._id.toString().slice(-8).toUpperCase()}</span>
                  <span>Date: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Donor Information */}
                <div className="bg-gray-100 border border-gray-300 rounded p-4">
                  <h3 className="font-bold text-gray-800 text-sm mb-2">DONOR INFORMATION</h3>
                  <div className="text-xs text-gray-700 space-y-1">
                    <p><span className="font-medium">Name:</span> {invoiceData.userName}</p>
                    <p><span className="font-medium">Email:</span> {invoiceData.userEmail}</p>
                    <p><span className="font-medium">Donation Date:</span> {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Food Details */}
                <div className="bg-gray-100 border border-gray-300 rounded p-4">
                  <h3 className="font-bold text-gray-800 text-sm mb-2">FOOD DETAILS</h3>
                  <div className="text-xs text-gray-700 space-y-1">
                    <p><span className="font-medium">Status:</span> Donated</p>
                    <p><span className="font-medium">Availability:</span> Available</p>
                  </div>
                </div>
              </div>

              {/* Food Information Table */}
              <div className="mb-6">
                {/* Table Header */}
                <div className="bg-[#2980b9] text-white text-xs font-bold py-2 px-4 rounded-t">
                  <div className="grid grid-cols-3">
                    <span>Description</span>
                    <span className="text-center">Quantity</span>
                    <span className="text-right">Expiry</span>
                  </div>
                </div>
                
                {/* Table Row */}
                <div className="bg-gray-50 border border-gray-300 border-t-0 py-3 px-4 text-xs text-gray-800">
                  <div className="grid grid-cols-3">
                    <span>{invoiceData.name}</span>
                    <span className="text-center">{invoiceData.quantity}</span>
                    <span className="text-right">{new Date(invoiceData.expire).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

          

              {/* Footer */}
              <div className="border-t border-gray-300 pt-4 mt-6">
                <p className="text-xs text-gray-500 text-center mb-1">
                  Thank you for your generous donation! Together we can reduce food waste and help those in need.
                </p>
                <p className="text-xs text-gray-500 text-center mb-1">
                  This is an auto-generated invoice from Share Bite Food Donation Platform
                </p>
                <p className="text-xs text-gray-500 text-center">
                  Generated on: {new Date().toLocaleString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition font-medium"
                  onClick={() => {
                    setShowInvoice(false);
                    setInvoiceData(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="px-6 py-2 bg-[#ff6d03] text-white rounded hover:bg-[#e66500] transition font-medium"
                  onClick={downloadInvoice}
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
                  type="file"
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
    </>
  );
};

export default AddFood;







