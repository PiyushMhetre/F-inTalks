import React from "react";
import { BsLinkedin } from "react-icons/bs";
import { CiLinkedin } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";

export default function AboutUs() {
  return (
    <div className="  bg-customGray absolute top-0 bottom-0">
      <div class="flex flex-col  mt-20 mx-[10%] laptop:mx-[20%] w-[80%] laptop:w-[60%] text-sm bg-white  p-6 rounded-lg shadow-md">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Welcome to INTALKS !</h1>
          <p class="mt-4 text-gray-700"></p>
          <p class="mt-2 text-gray-700 text-lg">
            INTALKS is a platform known as Interview Talks or Insight Talks,
            connecting aspiring students with real-life experiences shared by
            their peers and industry experts. We provide students with practical
            insights and knowledge from those who have gone through similar
            journeys. Whether you are preparing for placements or seeking to
            learn from other's experiences, INTALKS is here to support you.
          </p>
        </div>
        <div class="mb-6 ">
          <h2 class="text-2xl font-bold text-gray-900">Support</h2>
          <p class="mt-2 text-gray-700 text-lg">
            For any suggestions or feedback contact{" "}
            <a
              href="mailto:support@intalks.com"
              class="text-blue-600 hover:underline"
            >
              support@intalks.com
            </a>
            .
          </p>
        </div>
        {/* <h2 class="text-2xl font-bold text-gray-900">Founder</h2>
      <div class="mt-5 self-center">
        <div className="flex gap-3">
          <img
            src="http://res.cloudinary.com/dicevyk4v/image/upload/v1719590173/huu0stwxxoab76qwrmmw.jpg"
            alt="Profile"
            class="h-24 w-24 rounded-full cursor-pointer border-4 border-white shadow-lg"
          />
          <div className="  self-center">
            <div class="text-xl  laptop:text-2xl font-semibold text-gray-900">
              Piyush Mhetre
            </div>
            <div class="text-md text-gray-600">PICT</div>
          </div>
        </div>
      </div> */}
        <div class="">
          <h2 class="text-xl font-bold text-gray-900">Contact</h2>
          <p class="mt-2 text-gray-700 text-lg">
            You can reach out to me directly at{" "}
            <a
              href="mailto:piyushmhetre9596@gmail.com"
              class="text-blue-600 hover:underline"
            >
              piyushmhetre9596@gmail.com
            </a>
            .
          </p>
        </div>
        <div className="self-end flex gap-3">
          <div className="mt-[1px]">
            <a
              className="mt-4  hover:underline  "
              href="https://www.instagram.com/piyush__mhetre"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-[2.4em] text-red-500" />
            </a>
          </div>
          <div className=" mt-1">
            <a
              className="mt-4 text-blue-600 hover:underline self-end"
              href="https://www.linkedin.com/in/piyush-mhetre"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsLinkedin className="text-3xl" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
