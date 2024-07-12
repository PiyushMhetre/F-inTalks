import React, {  useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../images/Logo.jpg";
import icon from "../images/icon.jpg";
import { useNavigate } from "react-router-dom";
import { useDataContext } from "../DataContext";
import axios from "axios";
import { IoIosSearch } from "react-icons/io";

export default function FeedHeader() {
  const [selectedOption, setSelectedOption] = useState("Feed");
  const {
    setNewNotificationFlag,
    newNotificationFlag,
    newNotificationCount,
    allBlogs,
    allQA,
    setAllBlogs,
    setAllQA,
    userProfile,
  } = useDataContext();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState("http://res.cloudinary.com/dicevyk4v/image/upload/v1718561564/wbdquq18b6sy8e7uu1en.jpg")

  useEffect(() => {
    if(userProfile){

    setProfile(userProfile)
    }
  }, [userProfile])
  const handleNotificationClick = (e) => {
    setSelectedOption("Notifications");
    navigate("/notificaiton");
    setNewNotificationFlag(false); // Reset the new notification flag after fetching
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevent form submission from refreshing the page

    if (!query) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_ROUTE}/blogs/search`,
        {
          params: { query },
        }
      );

      // Bifurcate results based on type
      const searchResults = response.data.data;
      const blogs = searchResults.filter((item) => item.type === "blog");
      const qnas = searchResults.filter((item) => item.type === "qna");

      const unionById = (arr1, arr2) => {
        const map = new Map();

        arr1.concat(arr2).forEach((item) => {
          map.set(item._id, item);
        });

        return Array.from(map.values());
      };

      const uniqueBlogs = unionById(blogs, allBlogs);
      const uniqueQA = unionById(qnas, allQA);
      setAllBlogs(uniqueBlogs);
      setAllQA(uniqueQA);
    } catch (error) {
      console.error("Error searching for blogs:", error);
    }
  };

  const handleIconClick = () => {
    handleSearchSubmit();
  };

  return (
    <div className=" ">
      <div className="w-full fixed top-0 z-10 shadow-md laptop:p-1 flex justify-around bg-white">
      <div className="flex gap-6 desktop:gap-60 laptop:gap-28 laptop:justify-between mt-1">
        <div className="laptop:h-8 flex gap-2 laptop:gap-2">
          <img
            src={icon}
            alt="InTalks"
            loading="lazy"
            className="block mt-1 laptop:hidden h-7"
          />
          <img
            src={logo}
            alt="InTalks"
            loading="lazy"
            className="hidden pb-2 laptop:block laptop:w-28 laptop:h-14"
          />

          <div className="laptop:mt-4 relative flex items-center">
            <IoIosSearch
              className="absolute left-3 text-gray-400"
              onClick={handleIconClick}
            />
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="'Google', 'BNY', 'UBS', 'Web Dev', 'John Doe'"
                className="pl-10 text-xs laptop:text-[.8em] w-24 laptop:w-96 desktop:w-[40em] p-2 rounded-md focus:outline-none bg-slate-100"
                value={query}
                onChange={handleInputChange}
              />
            </form>
          </div>
        </div>

        <div className="flex gap-1 laptop:gap-3 desktop:gap-7 h-5 laptop:h-12 text-xs mt-1">
          <Link
            to="/feed"
            className={`flex items-center text-[0.8em] laptop:text-[1.3em] font-semibold ${
              selectedOption === "Feed"
                ? "text-black border-b-2 border-black"
                : "text-slate-400"
            }`}
            onClick={() => setSelectedOption("Feed")}
          >
            Feed
          </Link>

          <Link
            to="/q&a"
            className={`flex items-center text-[0.8em] laptop:text-[1.3em] font-semibold ${
              selectedOption === "Q&A"
                ? "text-black border-b-2 border-black"
                : "text-slate-400"
            }`}
            onClick={() => setSelectedOption("Q&A")}
          >
            Q&A
          </Link>

          <div
            className={`relative flex items-center text-[0.8em] laptop:text-[1.3em] cursor-pointer font-semibold ${
              selectedOption === "Notifications"
                ? "text-black border-b-2 border-black"
                : "text-slate-400"
            }`}
            onClick={handleNotificationClick}
          >
            Notifications
            {newNotificationFlag && (
              <span className="absolute laptop:top-3 mobile:bottom-2 -right-1 laptop:-right-2 transform bg-red-600 text-white rounded-full laptop:w-4 laptop:h-4 z-10 w-3 h-3">
                <div className="absolute text-xs right-1 ">
                  {newNotificationCount}
                </div>
              </span>
            )}
          </div>

          <Link
            to="/inTalks/profile"
            state={{ option: "Me" }}
            className={`flex items-center text-[0.8em] laptop:text-[1.3em] font-semibold ${
              selectedOption === "Me" ? "text-black" : "text-slate-400"
            }`}
            onClick={() => setSelectedOption("Me")}
          >
            <img
              src={userProfile}
              alt="Profile"
              className="h-5 w-5 laptop:h-9 laptop:w-9 rounded-full cursor-pointer border-2 shadow-lg"
            />
          </Link>

          <Link
            to="/aboutUs"
            className={`flex items-center text-[0.8em] laptop:text-[1.3em] font-semibold ${
              selectedOption === "aboutUs" ? "text-black" : "text-slate-400"
            }`}
            onClick={() => setSelectedOption("aboutUs")}
          >
            About Us
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
