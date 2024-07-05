import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BsLinkedin } from "react-icons/bs";
import axios from "axios";
import icon from "../images/icon.jpg";
import Card from "../components/Card.js";
import { useDataContext } from "../DataContext.js";

export default function OtherUserProfile() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [college, setCollege] = useState("");
  const [qnaFlag, setQnaFlag] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Blogs");
  const [blogs, setBlogs] = useState([]);
  const [qna, setQna] = useState([]);
  const otherUserId = useLocation().state;
  const { allBlogs, allQA } = useDataContext();
  const [userProfile, setUserProfile] = useState();

  const userId = otherUserId.userId._id;

  async function getUserInfo() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_ROUTE}/profileInfo`,
        {
          params: { data: userId },
        }
      );
      setName(res.data.data.name);
      setCollege(res.data.data.college);
      setCompany(res.data.data.company);
      setLinkedin(res.data.data.linkedin);
      setUserProfile(res.data.data.profilePicture);
    } catch (error) {
      // Handle error
      console.error("error in getting user info", error);
    }
  }

  useEffect(() => {
    if (otherUserId && allBlogs) {
      const filteredBlogs = allBlogs.filter(
        (blog) => blog.author._id === userId && blog.type === "blog"
      );
      const filteredQA = allQA.filter(
        (blog) => blog.author._id === userId && blog.type === "qna"
      );
      setQna(filteredQA);
      setBlogs(filteredBlogs);
    }
  }, [allBlogs, allQA, otherUserId]);

  useEffect(() => {
    if (otherUserId) {
      const fetchData = async () => {
        await getUserInfo();
      };
      fetchData();
    }
  }, [otherUserId]);

  return (
    <div className="mt-16 flex flex-col items-center min-h-screen relative  bg-customGray">
      <div className="flex flex-col items-center mt-3 mx-[10%] laptop:mx-[20%] w-[80%] laptop:w-[60%] text-sm bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <img
              src={userProfile}
              alt="Profile"
              className="h-24 w-24 rounded-full cursor-pointer border-4 border-white shadow-lg"
            />
            <div className="ml-6 flex flex-col items-start">
              <div className="text-xl laptop:text-2xl font-semibold text-gray-900">
                {name}
              </div>
              <div className="text-lg text-gray-700">{company}</div>
              <div className="text-md text-gray-600">{college}</div>
            </div>
          </div>
          {linkedin && (
            <a
              className="mt-4 text-blue-600 hover:underline self-end"
              href={`https://${linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsLinkedin className="text-3xl" />
            </a>
          )}
        </div>
      <div className="mt-4 mb-2 w-[80%] border border-slate-200"></div>
      <div className="flex gap-10">
        <button
          className={`flex items-center text-[0.7em] laptop:text-[1.2em] ${
            selectedOption === "Blogs" ? "text-black" : "text-slate-400"
          }`}
          onClick={() => {
            setSelectedOption("Blogs");
            setQnaFlag(false);
          }}
        >
          Blogs
        </button>
        <button
          className={`flex items-center text-[0.7em] laptop:text-[1.2em] ${
            selectedOption === "qna" ? "text-black" : "text-slate-400"
          }`}
          onClick={() => {
            setSelectedOption("qna");
            setQnaFlag(true);
          }}
        >
          QnA's
        </button>
      </div>

      <div className="laptop:w-[85%] w-full">
        {qnaFlag
          ? qna.length > 0 && qna.map((blog) => (
              <Card
                key={blog._id}
                blog={blog}
                userId={otherUserId}
                flag={false}
              />
            ))
          : blogs.length > 0 && blogs.map((blog) => (
              <Card
                key={blog._id}
                blog={blog}
                userId={otherUserId}
                flag={true}
              />
            ))}
      </div>
    </div>
  );
}
