import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDataContext } from "../DataContext";
import { Toaster, toast } from "react-hot-toast";

export default function CreatePost({ onClose, getAllBlogs, flag }) {
  const { register, handleSubmit } = useForm();
  const { fetchData } = useDataContext();
  async function postContent(data) {
    try {
      data.type = flag ? "blog" : "qna";
      await axios.post(`${process.env.REACT_APP_BASE_ROUTE}/postBlog`, data, {
        withCredentials: true,
      });
      toast.success("Blog posted !", {
        style: {
          boxShadow: "none",
          border: "1px solid #e0e0e0",
          padding: "10px",
          color: "#333",
          backgroundColor: "#fff",
        },
      });
    } catch (e) {
      console.error(e);
    }
    fetchData(); //to fetch blogs again so that newly posted blog also get rendered
    onClose();
  }

  return (
    <div className="bg-white flex flex-col w-[16.5em] laptop:h-[25em] laptop:w-[40em] z-30 rounded-lg relative">
      <Toaster />
      <button className="absolute right-0" onClick={onClose}>
        <IoClose />
      </button>

      <form className="flex flex-col " onSubmit={handleSubmit(postContent)}>
        {/* topic title */}
        {flag && (
          <>
            <label htmlFor="title" className="text-lg text-gray-600">
              Topic title
            </label>
            <input
              id="title"
              type="text" // Corrected to type="text"
              placeholder="Fintech | Software Engineer"
              className="focus:outline-none"
              {...register("title")}
            />
          </>
        )}

        {/* experience */}
        <label htmlFor="content" className="mt-2 text-lg text-gray-600">
          {flag ? ( // Use parentheses for clarity
            <div>Experience Details</div>
          ) : (
            <div>Your Question</div>
          )}
        </label>
        <textarea
          id="content"
          className={`${
            flag ? `h-[17em]` : `h-[20em]`
          }  focus:outline-none rounded-lg`}
           placeholder={
  flag
    ? "Describe your interview experience:\n1. Interview Type\n2. Interview Rounds\n3. Key Questions\n4. Preparation Tips\n5. Personal Experience\n6. Additional Thoughts\n\nOr:\nShare any insights or advice\nTell us about your journey"
    : "Need help? Ask your question here!"
}


          {...register("content")}
        ></textarea>

        {/* post */}
        <button
          type="submit"
          className="self-end w-[4.5em] px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Post
        </button>
      </form>
    </div>
  );
}
