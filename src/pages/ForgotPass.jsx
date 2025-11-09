import React, { use, useState } from "react";
import Lottie from "lottie-react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { AuthContext } from "../provider/AuthContext";
import loginLottie from "../assets/login-animation.json"; 

const ForgotPass = () => {
  const { resetPassword } = use(AuthContext); 
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value) => {
    
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      toast.success("Password reset email sent. Check your inbox (and spam).");
      setEmail("");
    } catch (err) {
      // keep error message for Firebase-style errors
      toast.error(err?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center px-4 py-[5%] bg-gradient-to-b from-[#fffaf5] to-white">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Card */}
        <div className="w-full max-w-md mx-auto p-8 bg-white shadow-xl rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#ff6d03]">
            Forgot Password
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            Enter the email associated with your account and we’ll send a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff6d03] text-gray-700"
                placeholder="you@example.com"
                required
                aria-required="true"
                aria-label="Email address for password reset"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 mt-2 ${
                loading ? "bg-[#ffb588] cursor-not-allowed" : "bg-[#ff6d03] hover:bg-[#ff7c47]"
              } text-white font-semibold rounded transition`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-gray-600">
            Remembered your password?{" "}
            <Link to="/login">
              <span className="text-[#ff6d03] font-semibold underline">Login</span>
            </Link>
          </div>

          <div className="mt-4 text-xs text-center text-gray-400">
            If you don’t receive an email within a few minutes, check your spam folder.
          </div>
        </div>

        {/* Illustration (hidden on small screens) */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-80 max-h-full">
            <Lottie animationData={loginLottie} loop autoplay />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPass;
