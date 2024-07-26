import React from "react";
import { useForm, useWatch } from "react-hook-form";
import logo from "../images/Logo.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState("");
  const password = useWatch({ control, name: "password" });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const notifyOtpSent = () => toast.success("OTP sent successfully!");
  const notifyOtpVerified = () =>
    toast.success("OTP verified successfully. Redirecting to login...");

  async function handleVerifyOtp() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_ROUTE}/verify-otp`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setSignupError(errorData.message || "OTP verification failed");
        return;
      }

      notifyOtpVerified(); // Notify OTP verification success
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("OTP verification failed:", error.message);
      setSignupError("OTP verification failed, please try again.");
    }
  }

  async function handleSignUp(data) {
    setEmail(data.email);
    setSignupError("");
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_ROUTE}/signup`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setIsLoading(false);
        if (response.status === 409) {
          setSignupError("User already exists");
        } else {
          setSignupError(errorData.message || "Signup failed");
        }
        return;
      }

      setIsLoading(false);
      setIsOtpSent(true);
      notifyOtpSent(); // Notify OTP sent success
    } catch (error) {
      console.error("Signup failed:", error.message);
      setSignupError("Signup failed, please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center mt-10 overflow-x-hidden">
      <Toaster />
      <div className="self-center pb-4">
        <img src={logo} loading="lazy" alt="logo" className="w-20 laptop:w-40" />
      </div>

      <div className="text-xl text-center laptop:text-2xl mb-5 text-red-700">
        Connect with peers and gain insights.
      </div>

      {isOtpSent ? (
        <div className="flex flex-col items-center shadow-md border-t-1 shadow-slate-300 object-cover rounded-md w-[19em] laptop:w-[38em] p-5">
          <div className="mb-1">
            <label htmlFor="otp" className="text-sm laptop:text-base font-medium text-gray-700">
              OTP Sent at {email}
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="flex mt-1 h-12 w-[18em] laptop:w-[30em] rounded-md border border-gray-400 bg-transparent px-3 text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50"
              placeholder="Enter OTP"
            />
          </div>
          {signupError && (
            <span className="text-sm text-red-500 my-1">{signupError}</span>
          )}
          <button
            type="button"
            onClick={handleVerifyOtp}
            className="inline-flex h-12 w-[18em] laptop:w-[26em] items-center justify-center rounded-md bg-indigo-600 text-base font-semibold leading-7 text-white hover:bg-indigo-500"
          >
            Verify OTP
          </button>
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40">
           <p className="mt-2 px-10 text-lg text-gray-700">Sending OTP at {email}, please wait...</p>
</div>
          ) : (
            <div className="flex flex-col items-center shadow-md border-t-1 shadow-slate-300 object-cover rounded-md w-[19em] laptop:w-[38em] p-5">
              {signupError && (
                <span className="text-sm text-red-500 my-1">{signupError}</span>
              )}
              <form onSubmit={handleSubmit(handleSignUp)} className="flex flex-col items-center">
                {/* name */}
                <div className="mb-3">
                  <label htmlFor="name" className="text-sm laptop:text-base font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    {...register("name", { required: true })}
                    className="flex mt-1 h-12 w-[18em] laptop:w-[30em] rounded-md border border-gray-400 bg-transparent px-3 text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50"
                  />
                </div>

                {/* email */}
                <div className="mb-3">
                  <label htmlFor="email" className="text-sm laptop:text-base font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                    className={`flex mt-1 h-12 w-[18em] laptop:w-[30em] rounded-md border border-gray-400 bg-transparent px-3 text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <span className="text-sm text-red-500">Invalid email address</span>
                  )}
                </div>

                {/* password */}
                <div className="mb-3">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="flex mt-1 h-12 w-[18em] laptop:w-[30em] rounded-md border border-gray-400 bg-transparent px-3 text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password", { required: true })}
                  />
                </div>

                {/* confirm password */}
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    {...register("confirmPassword", {
                      required: true,
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className={`flex mt-1 h-12 w-[18em] laptop:w-[30em] rounded-md border border-gray-400 bg-transparent px-3 text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                  />
                  {errors.confirmPassword && (
                    <span className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>

                {/* college */}
            <div className="mb-3">
              <label htmlFor="college" className="text-sm font-medium text-gray-700">
                College
              </label>
              <input
                className="flex mt-1 h-12 w-[18em] laptop:w-[30em] rounded-md border border-gray-400 bg-transparent px-3 text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50"
                type="text"
                placeholder="Enter your college name"
                {...register("college")}
              />
            </div>

            {/* company */}
            <div className="mb-3">
              <label htmlFor="company" className="text-sm font-medium text-gray-700">
                Company | Job profile
              </label>
              <input
                className="flex mt-1 h-12 w-[18em] laptop:w-[30em] rounded-md border border-gray-400 bg-transparent px-3 text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50"
                type="text"
                placeholder="Google | Software Engineer"
                {...register("company")}
              />
            </div>

            {/* LinkedIn */}
            <div className="mb-7">
              <label htmlFor="linkedin" className="text-sm font-medium text-gray-700">
                LinkedIn ID
              </label>
              <input
                className="flex mt-1 h-12 w-[18em] laptop:w-[30em] rounded-md border border-gray-400 bg-transparent px-3 text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50"
                type="text"
                placeholder="Enter your LinkedIn ID"
                {...register("linkedin")}
              />
            </div>

                <button
                  type="submit"
                  className="inline-flex h-12 w-[18em] laptop:w-[30em] items-center justify-center rounded-md bg-indigo-600 text-base font-semibold leading-7 text-white hover:bg-indigo-500"
                >
                  Sign Up
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
