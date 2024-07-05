import React, { useEffect, useState } from "react";
import FeedHeader from "../components/FeedHeader.js";
import { useLocation } from "react-router-dom";
import CreatePost from "../components/CreatePost.js";
import Card from "../components/Card.js";
import { useDataContext } from "../DataContext";
import { FaArrowUpLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
export default function Feed() {
  const location = useLocation();
  const [notifiedBlog, setNotifiedBlog] = useState(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { allBlogs, userId, blogNotificationFlag, setBlogNotificationFlag, fetchData, loginFlag } = useDataContext();
  function handleOpenCreatePost() {
    setIsCreatePostOpen(true);
  }

  function handleCloseCreatePost() {
    setIsCreatePostOpen(false);
  }

  useEffect(() => {
    if (location.state && location.state.NotifiedPost) {
      setNotifiedBlog(location.state.NotifiedPost);
    }
  }, [location.state])

  return (
    <div className="laptop:mt-16 mt-10 overflow-x-hidden ">
    {
      loginFlag ? (
         <div className=" flex flex-col items-center bg-[#F3F6FB]">
        {/* Semi-transparent overlay */}
        {isCreatePostOpen && (
          <div className="fixed top-0 left-0 bottom-0 right-0 bg-slidecolor"></div>
        )}

        {/* Button to open CreatePost */}
        <div className="  ">
          <div className=" laptop:w-[40em] w-[20em]  flex justify-center laptop:h-12 mt-2 mb-4 bg-white shadow rounded-full border-b-2 border-slate-300  ">
            <button
              onClick={handleOpenCreatePost}
              className="text-xs w-[15em]  p-1 laptop:text-[1em] laptop:m-1 text-gray-400 laptop:bg-white laptop:w-[35em] laptop:h-10 rounded-full"
            >
              Share your experience here..
            </button>
          </div>
        </div>

        {/* CreatePost component */}
        {isCreatePostOpen && (
          <div className="z-50">
            <div className="bg-white p-4 left-[11%] laptop:left-[17%] flex desktop:left-[30%] rounded-md shadow-md z-30 absolute">
              <CreatePost onClose={handleCloseCreatePost} flag={true} />
            </div>
          </div>
        )}

        <div className="mb-2 w-[80%] border border-slate-200 "></div>

        {blogNotificationFlag && (
        <div className="fixed gap-1 flex top-10 left-1/2 transform -translate-x-1/2 mt-24 bg-slate-700 text-sm text-white p-1 px-3 rounded-full
         shadow-md cursor-pointer z-50" onClick={()=>{
          setBlogNotificationFlag(false)
          window.scrollTo({ top: 0, behavior: 'smooth' })
          // fetchData() //first check that notifications are adding the blog on the top rightfully or not
         }}>
          New blog <span className="mt-[4.5px]  text-xs"><FaArrowUpLong/></span>
        </div>
      )}

        <div className=" w-full">

          {allBlogs.map((blog) => (
            <Card key={blog._id} blog={blog} userId={userId} flag={true} />
          ))}
        </div>
      </div>
      ) : (
           <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
        <p className="text-xl font-semibold mb-4">Login Required</p>
        <p className="text-gray-700 mb-4">Please log in to access this page.</p>
        <Link to="/" className="text-blue-500 hover:underline">Go to Login Page</Link>
      </div>
    </div>
      )
    }
    </div>
  );
}
