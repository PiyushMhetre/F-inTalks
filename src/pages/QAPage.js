import React from "react";
import {  useLocation } from "react-router-dom";
import {Link} from 'react-router-dom'
import { useEffect, useState } from "react";
import CreatePost from "../components/CreatePost.js";
import Card from "../components/Card.js";
import { useDataContext } from "../DataContext";

export default function QAPage() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  // const [userId, setUserId] = useState()//getting userId 
  // const [allBlogs, setAllblogs] = useState([]);
  const location = useLocation();
  const [notifiedBlog, setNotifiedBlog] = useState(null);
  const { allQA, setAllBlogs, userId, loginFlag } = useDataContext();
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
  }, [location.state]);

  return (
    <div className="laptop:mt-16 mt-10">
    {
      loginFlag ? (
         <div className=" flex flex-col items-center bg-customGray">
        {/* Semi-transparent overlay */}
        {isCreatePostOpen && (
          <div className="fixed top-0 left-0 bottom-0 right-0 bg-slidecolor"></div>
        )}

        {/* Button to open CreatePost */}

        <div className=" laptop:w-[40em]  flex justify-center laptop:h-12 mt-2 mb-4 bg-white shadow rounded-full border-b-2 border-slate-300  ">
          <button
            onClick={handleOpenCreatePost}
            className="text-xs mobile:w-[15em]  p-1 laptop:text-[1em] laptop:m-1 text-gray-400 laptop:bg-white laptop:w-[35em] laptop:h-10 rounded-full"
          >
            Ask your question here...!
          </button>
        </div>
        
        {isCreatePostOpen && (
          <div className=" z-50">
            <div className="bg-white p-4 left-[11%] laptop:left-[17%] flex desktop:left-[30%] rounded-md shadow-md absolute">
              <CreatePost onClose={handleCloseCreatePost}  flag={false} />
            </div>
          </div>
        )}

        <div className="mb-2 w-[80%] border border-slate-200 "></div>

        <div className="w-full">
         
          {allQA.map((blog) => (
            <Card key={blog._id} blog={blog} userId={userId} flag={false}  />
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
