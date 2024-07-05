import React, { useEffect } from "react";
import LoginHeader from "../components/LoginHeader.js";
import { useForm } from "react-hook-form";
import loginImage from "../images/loginImage.jpg";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useDataContext } from "../DataContext";

export default function LoginPage() {
  const { setLoginFlag, userInfoSetter } = useDataContext();
  const [loginError, setLoginError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  async function handleLogin(data) {

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_ROUTE}/login`,
        {
          credentials: "include",
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        setLoginError("Invalid email or password");
        return;
      }
      const responseData = await response.json();
      const { token, user } = responseData;
      userInfoSetter.setName(user.name);
      userInfoSetter.setCollege(user.college);
      userInfoSetter.setCompany(user.company);
      userInfoSetter.setNotifications(user.notifications.reverse());
      userInfoSetter.setUserId(user._id);
      userInfoSetter.setLinkedin(user.linkedin);
      userInfoSetter.setUserProfile(user.profilePicture);

      // Store the token in localStorage
      localStorage.setItem("token", token);

      // sentCookie();
      setLoginFlag(true);
      navigate("/feed");
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  }

  return (
    <div className="mt-[2.5rem] flex-col pl-5 overflow-x-hidden mx-[5%] laptop:mx-[10%] ">
      <LoginHeader />

      <div className="slogan font-thin text-red-700 absolute laptop:mt-20 desktop:mt-20 laptop:text-2xl desktop:text-5xl text-xl">
        Empowering Futures,
        <br /> One Interview Experience at a Time!
      </div>

      <div className="laptop:flex mt-16 justify-between ">
        <div>
          <form
            className=" mt-10 laptop:mt-32 desktop:mt-40  "
            onSubmit={handleSubmit(handleLogin)}
          >
            {/* email  */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="text-base  font-medium text-gray-700 dark:text-gray-200"
              >
                Email
              </label>
              <input
                id="email"
                className="flex mt-1 h-12 w-[21em] laptop:w-[24em] desktop:w-[30em]  rounded-md border border-gray-400 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                type="email"
                placeholder="enter your email"
                {...register("email", { required: true })}
              />
            </div>

            {/* password */}
            <div className="mb-9">
              <label
                htmlFor="name"
                className="text-base mb-9 font-medium text-gray-700 dark:text-gray-200"
              >
                Passord
              </label>

              <input
                className={`flex mt-1 h-12 w-[21em] laptop:w-[24em] desktop:w-[30em]  rounded-md border border-gray-400 bg-transparent px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900 ${
                  errors.password || errors.email ? "border-red-500" : ""
                }`}
                type="password"
                placeholder="password"
                {...register("password", { required: true })}
              />
              {loginError && (
                <span className="absolute text-sm text-red-500">
                  {loginError}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex h-12 w-[18.5em] laptop:w-[21em] desktop:w-[26.5em] items-center justify-center rounded-md bg-indigo-600  text-base font-semibold leading-7 text-white hover:bg-indigo-500"
            >
              Login
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

          <div className="flex justify-end mt-4">
            <Link
              to="/forgetpassword"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="w-[19em] mt-7 laptop:w-96 desktop:w-[40em] laptop:mt-15">
          <img src={loginImage} alt="" loading="lazy" />
        </div>
      </div>
    </div>
  );
}
