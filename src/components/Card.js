import React, {  useEffect } from "react";
import { BiLike } from "react-icons/bi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BiCommentDetail } from "react-icons/bi";
import Comment from "./Comment.js";
import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";
import { useDataContext } from "../DataContext.js";
import { FiEdit } from "react-icons/fi";
import { IoBookmarkOutline } from "react-icons/io5";
import { Toaster, toast } from "react-hot-toast";
import { RxCopy } from "react-icons/rx";

export default function Card({ blog, flag }) {
  const name = blog.author.name;
  const profile = blog.author.profilePicture;
  const blogOwnerId = blog.author._id;
  const content = blog.content;
  const comments = blog.comments;
  const likes = blog.likes;
  const [allComments, setAllComments] = useState(comments);
  const [firstTwoComments, setFirstTwoComments] = useState(
    allComments.slice(0, 2)
  );
  const [commentData, setCommentData] = useState(firstTwoComments); //this data is used for .map , rendering on UI
  const [commentPosted, setCommentPosted] = useState(false);
  const [seeAllComments, setSeeAllComments] = useState(false);
  const [likesCount, setLikesCount] = useState(likes.length);
  const [dropDown, setDropDown] = useState(false);
  const {
    setAllBlogs,
    setAllQA,
    allBlogs,
    allQA,
    userBlogs,
    userQnAs,
    setUserBlogs,
    setUserQnAs,
    setSavedPosts,
    savedPosts,
    formatTimeDifference,
    userId,
  } = useDataContext();
  const { register, handleSubmit, setValue } = useForm();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setValue("title", blog.title);
      setValue("content", blog.content);
    }
  }, [isEditing, blog, setValue]);

  async function handleUpdateBlog(data) {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_ROUTE}/updateBlog/${blog._id}`,
        { title: data.title, content: data.content },
        { withCredentials: true }
      );
      if (response.status === 200) {
        const updatedBlog = response.data.blog;
        if (updatedBlog.type === "blog") {
          setAllBlogs(
            allBlogs.map((b) => (b._id === blog._id ? updatedBlog : b))
          );
          setUserBlogs(
            userBlogs.map((b) => (b._id === blog._id ? updatedBlog : b))
          );
        } else {
          setAllQA(allQA.map((b) => (b._id === blog._id ? updatedBlog : b)));
          setUserQnAs(
            userQnAs.map((b) => (b._id === blog._id ? updatedBlog : b))
          );
        }

        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  }

  async function getAllComments() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_ROUTE}/getAllComments/${blog._id}`,
        {
          data: userId,
        }
      );
      setAllComments(response.data.comments);
      setFirstTwoComments(response.data.comments.slice(0, 2));
      if (seeAllComments) {
        setCommentData(response.data.comments);
      } else {
        setCommentData(response.data.comments.slice(0, 2));
      }
    } catch (e) {
      console.error("Error getting comments:", e);
    }
  }
  function PostComment({ parentCommentId }) {
    const [inputValue, setInputValue] = useState("");
    const { register, handleSubmit } = useForm();
    async function handleComment(data) {
      const newData = {
        comment: data.comment,
        blogId: blog._id,
        parentCommentId: parentCommentId,
        userId: userId,
      };
      try {
          await axios.put(
          `${process.env.REACT_APP_BASE_ROUTE}/postComment`,
          newData
        );
        setInputValue("");
        getAllComments();
        toast.success("Comment added !", {
          style: {
            boxShadow: "none",
            border: "1px solid #e0e0e0",
            padding: "10px",
            color: "#333",
            backgroundColor: "#fff",
          },
        });
      } catch (error) {
        // Handle errors
        console.error("Error adding comment:", error);
      }
    }

    function handleCommentChange(event) {
      setInputValue(event.target.value);
    }

    return (
      <div>
        <form
          onSubmit={handleSubmit(handleComment)}
          className="border flex flex-col rounded-md h-full"
        >
          <input
            type="comment"
            id="comment"
            placeholder="Type your comment here..."
            {...register("comment")}
            value={inputValue}
            onChange={handleCommentChange}
            className="w-full  focus:outline-none pl-2 "
            autoComplete="off" // to turnoff the suggestions
          />
          <button
            type="submit"
            className="px-3 py-1 self-end border text-xs laptop:text-sm rounded-sm  bg-slate-200"
          >
            Post
          </button>
        </form>
      </div>
    );
  }

  async function handleLike() {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_ROUTE}/handleLike/${blog._id}`,
        { data: userId }
      );
      setLikesCount(response.data.updatedBlog.likes.length);
      if(response.data.message === "Like successful"){
        toast.success("Like added !", {
          style: {
            boxShadow: "none",
            border: "1px solid #e0e0e0",
            padding: "10px",
            color: "#333",
            backgroundColor: "#fff",
          },
        });
      }      
      return likesCount;
    } catch (error) {
      console.error("Error getting in handling likes :", error);
    }
  }

  async function deleteBlog(blogId) {
    try {
       await axios.delete(
        `${process.env.REACT_APP_BASE_ROUTE}/deleteBlog/${blogId}`
      );

      // Update replies state to remove deleted comment
      setAllBlogs(allBlogs.filter((blog) => blog._id !== blogId));
      setAllQA(allQA.filter((QA) => QA._id !== blogId));
      toast.success("Blog deleted successfully !", {
          style: {
            boxShadow: "none",
            border: "1px solid #e0e0e0",
            padding: "10px",
            color: "#333",
            backgroundColor: "#fff",
          },
        });
    } catch (error) {
      console.error(error); // Handle errors
    }
  }

  async function savePost(blogId) {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_ROUTE}/savePost/${blogId}`,
        { data: userId }
      );
      const message = response.data.message;

      if (message === "post added to saved") {
        const updatedSavedPosts = [...savedPosts, blog];
        setSavedPosts(updatedSavedPosts);
      }

      toast.success(message, {
        style: {
          boxShadow: "none",
          border: "1px solid #e0e0e0",
          padding: "10px",
          color: "#333",
          backgroundColor: "#fff",
        },
      });
      setDropDown(false);
    } catch (error) {
      console.error("error in saving post ", error);
    }
  }

  const copyToClipboard = () => {
    const path = `/feed/${blog._id}`; // Construct the path with blog ID
    const url = `${window.location.origin}${path}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Link copied successfully !", {
          style: {
            boxShadow: "none",
            border: "1px solid #e0e0e0",
            padding: "10px",
            color: "#333",
            backgroundColor: "#fff",
          },
        });
      })
      .catch((error) => {
        toast.error(`Failed to copy link: ${error.message}`);
      }); // Copy full URL to clipboard
    setDropDown(false);
  };

  return (
    <div className="my-2 mx-[10%] laptop:mx-[15%] text-sm bg-white  rounded-md shadow-md">
      <Toaster />

      {/* title and content */}
      <div className="text-sm p-4">
  <div className="flex justify-between">
    <Link
      to={`/profile/${name}`}
      state={{ userId: blog.author }}
      className="dm-sans text-[1.1em] laptop:text-lg font-bold flex gap-2 py-4"
    >
      <img
        src={profile}
        loading="lazy"
        alt=""
        className="h-12 w-12 rounded-full"
      />
      <div className="mt-1.5 flex flex-col">
        {name}
        <span className="text-xs text-gray-600 font-normal">
          {formatTimeDifference(new Date(blog.createAt))}
        </span>
      </div>
    </Link>
    <div className="flex gap-2 laptop:gap-4 z-0 laptop:text-lg relative">
      <button
        className="grid grid-flow-col gap-1 absolute z-0 -left-12 top-1 items-center"
        onClick={handleLike}
      >
        <div className="text-sm">{likesCount}</div>
        <BiLike className="text-xl text-blue-500" />
      </button>

      <div className="relative">
        <button
          onClick={() => setDropDown(!dropDown)}
          className="text-xl text-gray-500 hover:text-gray-700 mt-1"
        >
          <BsThreeDots />
        </button>

        {dropDown && (
          <div className="absolute laptop:text-base text-xs w-52 right-0 z-50 mt-2 border p-1 rounded-lg bg-white shadow-lg">
            <div className="flex flex-col gap-1 px-2 py-1">
              {blogOwnerId === userId && (
                <>
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:bg-red-100 p-1 rounded"
                    onClick={() => {
                      deleteBlog(blog._id);
                      setDropDown(false);
                    }}
                  >
                    <FaRegTrashCan className="mr-1" />
                    Delete Blog
                  </div>
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:bg-blue-100 p-1 rounded"
                    onClick={() => {
                      setIsEditing(true);
                      setDropDown(false);
                    }}
                  >
                    <FiEdit />
                    Edit Blog
                  </div>
                </>
              )}
              <div
                className="flex items-center gap-1 cursor-pointer hover:bg-green-100 p-1 rounded"
                onClick={copyToClipboard}
              >
                <RxCopy className="mr-1" />
                Copy link to post
              </div>
              {blogOwnerId !== userId && (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:bg-yellow-100 p-1 rounded"
                  onClick={() => {
                    savePost(blog._id);
                  }}
                >
                  <IoBookmarkOutline className="mr-1 mt-1" />
                  Save
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>

  {isEditing ? (
    <form onSubmit={handleSubmit(handleUpdateBlog)}>
      <input
        type="text"
        defaultValue={blog.title}
        {...register("title")}
        className="w-full border p-2 mb-2"
      />
      <textarea
        defaultValue={blog.content}
        {...register("content", { required: true })}
        className="w-full h-72 border p-2 mb-2 resize-none"
        style={{ maxHeight: "18rem" }} // Limiting height to avoid overflow
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-3 py-1 border text-xs laptop:text-sm rounded-sm bg-slate-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 border text-xs laptop:text-sm rounded-sm bg-slate-200"
        >
          Update
        </button>
      </div>
    </form>
  ) : (
    <>
      <div className="mukta-regular mt-3 laptop:text-base font-semibold mb-1">
        {blog.title}
      </div>
      <div className={`w-full laptop:text-base ${flag ? "font-normal" : "font-semibold"}`}>
        {content}
      </div>
    </>
  )}
</div>


      {/* comment */}
      <>
        <div className=" mt-5 laptop:mt-6 p-2  border-y border-grey-100 relative ">
          <div className="flex ">
            <BiCommentDetail className="laptop:text-base" />
            <div className=" absolute left-7 bottom-[7px] text-[.9em] ">
              Comments
            </div>
          </div>
        </div>

        <div className="p-4">
          <PostComment />

          <div className="flex flex-col">
            {commentData.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                PostComment={PostComment}
                commentPosted={commentPosted}
                setCommentPosted={setCommentPosted}
                userId={userId}
                getAllComments={getAllComments}
              />
            ))}

            {seeAllComments ? (
              <button
                className="text-blue-500"
                onClick={() => {
                  setCommentData(firstTwoComments);
                  setSeeAllComments(false);
                }}
              >
                {" "}
                Show Less{" "}
              </button>
            ) : (
              <button
                className="text-blue-500"
                onClick={() => {
                  setCommentData(allComments);
                  setSeeAllComments(true);
                }}
              >
                {" "}
                See All Comments{" "}
              </button>
            )}
          </div>
        </div>
      </>
    </div>
  );
}
