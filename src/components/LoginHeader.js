import React from "react";
import logo from  "../images/Logo.jpg"
import { useState } from "react";
import { Link } from "react-router-dom";
export default function LoginHeader(){

    return(
        <div className="flex justify-between gap-20 w-[97%]">
            <div > 
                <img className="w-20 laptop:w-36" src={logo} alt=""/>                
            </div>

            <div className="text-sm laptop:text-xl flex gap-3 laptop:gap-10 ">
                <Link className={`object-cover laptop:h-12 h-8 p-1 px-2 laptop:p-2  laptop:px-5 rounded-full text-blue-600 border border-blue-500 `}
                 to="/">
                    login 
                </Link>
                <Link className={` object-cover h-12 p-1 laptop:p-2  rounded-full text-blue-600 `}
                    to="/signup">
                    Sign Up 
                </Link>
            </div>
        </div>
    )
}