// ForgotPass.jsx
import React, { use, useState } from "react";
import { Link } from "react-router";
import Lottie from "lottie-react";
import toast from "react-hot-toast";
import { AuthContext } from "../provider/AuthContext";
import loginLottie from "../assets/login-animation.json"; // reuse or swap

const ForgotPass = () => {
  const { resetPassword } = use(AuthContext);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setSending(true);
      await resetPassword(email);
      setSent(true);
      toast.success("Password reset email sent. Check your inbox and spam folder.");
    } catch (err) {
      
      toast.error(err?.message || "Failed to send reset email. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center px-4 py-[5%] bg-gradient-to-b from-[#fffaf5] to-white">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="w-full max-w-md mx-auto p-8 bg-white shadow-xl rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#ff6d03]">
            Forgot Password
          </h2>

          {!sent ? (
            <>
              <p className="text-center text-sm text-gray-600 mb-6">
                Enter your account email and we'll send a password reset link.
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
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className={`w-full py-2 mt-2 ${
                    sending ? "bg-[#ffb588] cursor-not-allowed" : "bg-[#ff6d03] hover:bg-[#ff7c47]"
                  } text-white font-semibold rounded transition`}
                >
                  {sending ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-6 text-sm text-center text-gray-600">
                Remembered your password?{" "}
                <Link to="/login">
                  <span className="text-[#ff6d03] font-semibold underline">Login</span>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                We sent a password reset link to <span className="font-medium">{email}</span>.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                If you don’t see it, check your spam folder or try again.
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    setSent(false);
                    setEmail("");
                  }}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Send again
                </button>
                <Link to="/login" className="px-4 py-2 bg-[#ff6d03] text-white rounded-md hover:bg-[#ff7c47]">
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>

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
