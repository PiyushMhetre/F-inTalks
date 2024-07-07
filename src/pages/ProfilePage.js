import React, {  useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsLinkedin } from "react-icons/bs";
import axios from "axios";
import Modal from "react-modal";
import Cropper from "react-easy-crop";
import { useDataContext } from "../DataContext.js";
import { getCroppedImg } from "../components/cropImage.js"; // Utility function to get cropped image
import Card from "../components/Card.js";
import "../App.css";
import { CiCamera } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { BsThreeDots } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";

Modal.setAppElement("#root"); // This is to avoid screen readers issues

export default function ProfilePage() {
  const {
    userBlogs,
    userQnAs,
    userId,
    userInfo,
    savedPosts,
    loginFlag,
  } = useDataContext();
  const [selectedOption, setSelectedOption] = useState("Blogs");

  // State for modal and image cropping
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  // const [ ,setCroppedImage] = useState(null);
  const [zoom, setZoom] = useState(1); // State for zoom level in Cropper
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { register, handleSubmit } = useForm();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const navigate = useNavigate();

  async function setProfile({ profileUrl }) {
    try {
        await axios.put(
        `${process.env.REACT_APP_BASE_ROUTE}/setProfile`,
        {
          data: userId,
          profile: profileUrl,
        }
      );
       toast.success("Profile picture updated !", {
        style: {
          boxShadow: "none",
          border: "1px solid #e0e0e0",
          padding: "10px",
          color: "#333",
          backgroundColor: "#fff",
        },
      });
    } catch (error) {
      console.error("error in updating user profile", error);
    }
  }

  // Handlers for profile picture modal
  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setIsModalOpen(false);
        setIsCropModalOpen(true);
      };
    }
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(
        selectedImage,
        croppedAreaPixels
      );
      // setCroppedImage(croppedImage);
      setIsCropModalOpen(false);
      // Now you can upload the croppedImage to the server and update the user's profile picture
      const formData = new FormData();
      formData.append("file", croppedImage);
      formData.append("upload_preset", "inTalks");
      formData.append("cloud_name", "dicevyk4v");
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dicevyk4v/upload",
        formData
      );
      userInfo.setUserProfile(response.data.url.toString());
      const profileUrl = response.data.url.toString();
      setProfile({ profileUrl });
    } catch (e) {
      console.error(e);
    }
  };

  const handleThreeDotsClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCancelClick = () => {
    setIsEditFormOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BASE_ROUTE}/logout`);
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }

    // Redirect or perform any other necessary actions after logout
  };

  const handleEditClick = () => {
    setIsEditFormOpen(true);
    setIsDropdownOpen(false);
  };

  const handleFormSubmit = async (data) => {
    try {
       await axios.put(
        `${process.env.REACT_APP_BASE_ROUTE}/updateProfile`,
        { userId: userId, ...data }
      );
      toast.success("Profile updated !", {
        style: {
          boxShadow: "none",
          border: "1px solid #e0e0e0",
          padding: "10px",
          color: "#333",
          backgroundColor: "#fff",
        },
      });
      // Update UI with new user info
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setIsEditFormOpen(false);
  };

  return (
    <>
      <Toaster />
      <div className=" min-h-screen relative  bg-customGray">
        <div className="laptop:mt-16 mt-9">
          {loginFlag ? (
            <div className="">
              <div className="mt-1 flex flex-col items-center ">
                <div className="flex flex-col items-center mt-3 mx-[10%] laptop:mx-[20%] w-[80%] laptop:w-[60%] text-sm bg-white p-6 rounded-lg shadow-md">
                  <div
                    className="relative self-end text-lg pb-2 cursor-pointer"
                    onClick={handleThreeDotsClick}
                  >
                    <BsThreeDots />
                    {isDropdownOpen && (
                      <div className="absolute p-1 -right-2 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                        <ul>
                          <li
                            className="px-4 py-1 cursor-pointer hover:bg-gray-200 rounded-lg text-base"
                            onClick={handleEditClick}
                          >
                            Edit
                          </li>
                          <li
                            className="px-4 py-1 cursor-pointer hover:bg-gray-200 rounded-lg text-base"
                            onClick={handleLogout}
                          >
                            Logout
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <img
                      src={userInfo.userProfile}
                      alt="Profile"
                      onClick={handleProfileClick}
                      loading="lazy"
                      className="h-24 w-24 rounded-full cursor-pointer border-4 border-white shadow-lg"
                    />
                    <div className="ml-6 flex flex-col items-start">
                      <div className="text-xl laptop:text-2xl font-semibold text-gray-900">
                        {userInfo.name}
                      </div>
                      <div className="text-lg text-gray-700">
                        {userInfo.company}
                      </div>
                      <div className="text-md text-gray-600">
                        {userInfo.college}
                      </div>
                    </div>
                  </div>
                  {userInfo.linkedin && (
                    <a
                      className="mt-4 text-blue-600 hover:underline self-end"
                      href={`https://${userInfo.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BsLinkedin className="text-3xl" />
                    </a>
                  )}
                  {isEditFormOpen && (
                    <form
                      onSubmit={handleSubmit(handleFormSubmit)}
                      className="mt-6 flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md w-full"
                    >
                      <label className="self-start mb-2 text-gray-700 font-semibold">
                        Name
                      </label>
                      <input
                        type="text"
                        {...register("name")}
                        placeholder="Name"
                        defaultValue={userInfo.name}
                        className="mb-2 p-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <label className="self-start mb-2 text-gray-700 font-semibold">
                        College
                      </label>
                      <input
                        type="text"
                        {...register("college")}
                        placeholder="College"
                        defaultValue={userInfo.college}
                        className="mb-2 p-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <label className="self-start mb-2 text-gray-700 font-semibold">
                        Company
                      </label>
                      <input
                        type="text"
                        {...register("company")}
                        placeholder="Company"
                        defaultValue={userInfo.company}
                        className="mb-2 p-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <label className="self-start mb-2 text-gray-700 font-semibold">
                        LinkedIn Profile
                      </label>
                      <input
                        type="text"
                        {...register("linkedin")}
                        placeholder="LinkedIn Profile"
                        defaultValue={userInfo.linkedin}
                        className="mb-2 p-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <div className="flex justify-between w-full">
                        <button
                          type="button"
                          onClick={handleCancelClick}
                          className="px-4 py-2 mt-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                        >
                          Update
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="mt-4 mb-2 w-[80%] border border-slate-200"></div>
                <div className="flex gap-10">
                  <button
                    className={`flex items-center text-[0.7em] laptop:text-[1.2em] ${
                      selectedOption === "Blogs"
                        ? "text-black"
                        : "text-slate-400"
                    }`}
                    onClick={() => {
                      setSelectedOption("Blogs");
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
                    }}
                  >
                    QnA's
                  </button>

                  <button
                    className={`flex items-center text-[0.7em] laptop:text-[1.2em] ${
                      selectedOption === "saved"
                        ? "text-black"
                        : "text-slate-400"
                    }`}
                    onClick={() => {
                      setSelectedOption("saved");
                    }}
                  >
                    Saved
                  </button>
                </div>

                <div className="laptop:w-[85%] w-full ">
                  {selectedOption === "Blogs" && (
                    <>
                      {userBlogs.map((blog) => (
                        <Card
                          key={blog._id}
                          blog={blog}
                          userId={userId}
                          flag={true}
                        />
                      ))}
                    </>
                  )}
                  {selectedOption === "qna" && (
                    <>
                      {userQnAs.map((blog) => (
                        <Card
                          key={blog._id}
                          blog={blog}
                          userId={userId}
                          flag={false}
                        />
                      ))}
                    </>
                  )}
                  {selectedOption === "saved" && (
                    <>
                      {savedPosts.reverse().map((blog) => (
                        <Card
                          key={blog._id}
                          blog={blog}
                          userId={userId}
                          flag={true}
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Profile Picture Modal */}
              <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Profile Picture Modal"
                className="fixed  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1c1c1c] z-0 laptop:h-[28em] laptop:w-[48em] h-[10em] w-[18em]  rounded-md shadow-md outline-none"
                overlayClassName="overlay"
              >
                <div
                  className=" text-xl absolute right-3 top-2 text-white cursor-pointer"
                  onClick={() => setIsModalOpen(false)}
                >
                  <RxCross2 />
                </div>
                <div className=" text-white p-2 text-lg ml-3 font-medium">
                  Profile photo
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src={userInfo.userProfile}
                    alt="Profile"
                    className="laptop:w-72 laptop:h-72 w-20 h-20 z-20 rounded-full laptop:mt-7 outline-1  "
                  />
                  <div className="absolute  left-5 bottom-4">
                    <label
                      htmlFor="addPhoto"
                      className="cursor-pointer text-white mt-2"
                    >
                      {" "}
                      {
                        <div className="flex gap-2 ">
                          <CiCamera className=" text-2xl" />
                          Add Photo
                        </div>
                      }
                    </label>
                    <input
                      id="addPhoto"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </Modal>

              {/* Crop Modal */}

              <Modal
                isOpen={isCropModalOpen}
                onRequestClose={() => setIsCropModalOpen(false)}
                contentLabel="Crop Modal"
                className="fixed  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-0 laptop:h-[25em] laptop:w-[48em] h-[10em] w-[18em]  rounded-md shadow-md outline-none"
                overlayClassName="overlay"
              >
                <div className=" w-auto h-full bg-[#1c1c1c]  rounded-md">
                  <Cropper
                    image={selectedImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                    cropShape="round" // Set the crop shape to round for circular cropping
                    showGrid={false}
                  />
                </div>
                <div className=" flex justify-end p-3 bg-white bottom-2 rounded-b-lg ">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleCrop}
                  >
                    Save photo
                  </button>
                </div>
              </Modal>
            </div>
          ) : (
            <div className="flex justify-center items-center h-screen bg-gray-100">
              <div className="text-center">
                <p className="text-xl font-semibold mb-4">Login Required</p>
                <p className="text-gray-700 mb-4">
                  Please log in to access this page.
                </p>
                <Link to="/" className="text-blue-500 hover:underline">
                  Go to Login Page
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
