import React from "react";
import { useForm, useWatch } from "react-hook-form";
import logo from "../images/Logo.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function SignUp() {
  //register using to store input field data
  const {register, handleSubmit, control, formState: { errors }, } = useForm();
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState("");
  const password = useWatch({ control, name: "password" });

  async function handleSignUp(data) {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_ROUTE}/signup`, {
        method: "POST",
        mode:'cors',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          setSignupError("User already exists");
        } else {
          setSignupError(errorData.message || "Signup failed");
        }
        return;
      }

      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error.message);
      // Handle signup error, e.g., display error message to the user
    }
  }

  return (
    <div className="flex flex-col items-center mt-10 overflow-x-hidden  ">
      <div className="self-center pb-4">
        <img src={logo} loading="lazy" alt="logo" className="w-20 laptop:w-40" />
      </div>

      <div className="text-xl text-center  laptop:text-2xl mb-5 text-red-700 ">
        Connect with peers and gain insights.
      </div>
      <div className="flex flex-col items-center shadow-md border-t-1 shadow-slate-300 object-cover rounded-md  w-[19em] laptop:w-[38em] p-5 ">
        <form
          onSubmit={handleSubmit(handleSignUp)}
          className=" flex flex-col items-center"
        >
          {/* name */}
          <div className="mb-3">
            <label
              htmlFor="name"
              className="text-sm laptop:text-base font-medium text-gray-700 dark:text-gray-200"
            >
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register("name", { required: true })}
              className="flex mt-1 h-12 w-[18em] laptop:w-[30em] rounded-md border border-gray-400 bg-transparent px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
            />
          </div>
          
          {/* email */}
          <div className="mb-3">
            <label
              htmlFor="email"
              className="text-sm laptop:text-base font-medium text-gray-700 dark:text-gray-200"
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
              className={`flex mt-1 h-12 w-[18em] laptop:w-[30em] rounded-md border border-gray-400 bg-transparent px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <span className="">
                Invalid email address
              </span>
            )}
            {signupError && (
              <span className="text-sm text-red-500">{signupError}</span>
            )}
          </div>

          {/* password */}
          <div className="mb-3">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
            <input
              className="flex mt-1 h-12 w-[18em] laptop:w-[30em] rounded-md border border-gray-400 bg-transparent px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: true })}
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                required: true,
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className={`flex mt-1 h-12 w-[18em] laptop:w-[30em] rounded-md border border-gray-400 bg-transparent px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            {errors.confirmPassword && (
              <span className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div className="mb-3">
            <label
              htmlFor="college"
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              College Name
            </label>
            <input
              className="flex mt-1 h-12 w-[18em] laptop:w-[30em] rounded-md border border-gray-400 bg-transparent px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
              type="text"
              placeholder="Enter your college name"
              {...register("college")}
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="company"
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Company (If applicable)
            </label>
            <input
              className="flex mt-1 h-12 w-[18em] laptop:w-[30em] rounded-md border border-gray-400 bg-transparent px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
              type="text"
              placeholder="Enter your company name"
              {...register("company")}
            />
          </div>

          <div className="mb-7">
            <label
              htmlFor="linkedin"
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              LinkedIn ID
            </label>
            <input
              className="flex mt-1 h-12 w-[18em] laptop:w-[30em] rounded-md border border-gray-400 bg-transparent px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
              type="text"
              placeholder="Enter your LinkedIn ID"
              {...register("linkedin")}
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-indigo-600  text-base font-semibold leading-7 text-white hover:bg-indigo-500"
          >
            Sign Up
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="ml-2 h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
