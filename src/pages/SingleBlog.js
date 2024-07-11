import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import { TailSpin } from "react-loader-spinner";

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <TailSpin
        visible={true}
        height="80"
        width="80"
        color="#808080"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default function SingleBlog() {
  const [blog, setBlog] = useState([]);
  const { blogId } = useParams();
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    const getBlog = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_ROUTE}/blogById/${blogId}`
        );
        setBlog(response.data.data);
        setFlag(true);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    getBlog();
  }, [blogId]);

  return (
    <div className="laptop:mt-16 mt-9  min-h-screen bg-customGray  ">
      {flag ? (
        <Card key={blog._id} blog={blog} flag={true} />
      ) : (
        <LoadingScreen />
      )}
    </div>
  );
}
