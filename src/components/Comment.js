import react, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { BsThreeDots } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useDataContext } from "../DataContext";

export default function Comment({
  comment,
  PostComment,
  userId,
  getAllComments,
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState(comment.nestedComments);
  const [repliesToComment, setRepliesToComment] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const { formatTimeDifference } = useDataContext();


  async function deleteComment(commentId) {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_ROUTE}/deleteComment/${commentId}`,
        {
          withCredentials: true,
        }
      );
      // Update replies state to remove deleted comment
      setReplies(replies.filter((reply) => reply._id !== commentId));
      getAllComments(); // Still call getAllComments for parent component updates
    } catch (error) {
      console.error(error); // Handle errors
    }
  }

  return (
    <div className=" flex-col">
      <div className="m-2 mt-3 flex gap-3">
        <Link
          to={`/profile/${comment.postedBy.name}`}
          state={{ userId: comment.postedBy }}
        >
          <img
            src={comment.postedBy.profilePicture}
            loading="lazy"
            alt=""
            className="h-8 w-8 laptop:h-10 laptop:w-10 rounded-full mt-[1px]"
          />
        </Link>

        <div className="flex-grow">
          <div className="border border-slate-200 p-1 laptop:p-2 rounded-md bg-white shadow-sm">
            <div className="flex justify-between items-center mb-1 laptop:mb-2">
              <Link
                to={`/profile/${comment.postedBy.name}`}
                state={{ userId: comment.postedBy }}
                className=" font-semibold hover:underline"
              >
                {comment.postedBy.name}
              </Link>
              <div className="relative flex gap-2 laptop:gap-3">

                <span className="text-xs text-gray-600 font-normal">
                  {formatTimeDifference(new Date(comment.createdAt))}
                </span>

                <button
                  onClick={() => {
                    if (comment.postedBy._id === userId) {
                      setIsDeleteVisible(!isDeleteVisible);
                    }
                  }}
                  className="text-gray-800 hover:text-gray-800 focus:outline-none"
                > 
                  <BsThreeDots />
                </button>

                {isDeleteVisible && (
                  <div
                    className="absolute right-0 top-8 flex items-center gap-1 bg-white border p-1 laptop:p-2 rounded-lg shadow-lg cursor-pointer text-sm text-gray-700"
                    onClick={() => {
                      deleteComment(comment._id);
                      setIsDeleteVisible(!isDeleteVisible);
                    }}
                  >
                    <div>Delete</div>
                    <FaRegTrashCan className="text-red-300" />
                  </div>
                )}
              </div>
            </div>

            <div className="text-gray-800 mb-1 laptop:mb-2">{comment.text}</div>

            <div className="flex gap-2 text-xs text-gray-600">
              <button
                className="hover:underline"
                onClick={() => {
                  setRepliesToComment(!repliesToComment);
                }}
              >
                reply
              </button>

              {comment.nestedComments.length > 0 && (
                <button
                  className="hover:underline"
                  onClick={() => {
                    setShowReplies(!showReplies);
                  }}
                >
                  {showReplies
                    ? "Hide Replies"
                    : `Show ${comment.nestedComments.length} Replies`}
                </button>
              )}
            </div>
          </div>
          {repliesToComment && (
            <div className="ml-2 laptop:ml-3 mt-2 laptop:mt-3">
              <PostComment parentCommentId={comment._id} />
            </div>
          )}
        </div>
      </div>

      {showReplies && (
        <div className="ml-2 laptop:ml-3 mt-2">
          {comment.nestedComments.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              PostComment={PostComment}
              userId={userId}
              getAllComments={getAllComments}
              indentLevel={1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
