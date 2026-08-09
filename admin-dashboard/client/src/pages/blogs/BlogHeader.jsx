import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";

const BlogHeader = () => {
  return (
    <div className="w-full">
      <div className="relative w-full h-[40vh] bg-[#1a1e2e] overflow-hidden">
        {/* Curved lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C150,150 350,-50 500,50 C650,150 850,-50 1000,50"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
          <path
            d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100 L1000,0 L0,0 Z"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
        </svg>

        {/* Title */}
        <h1 className="absolute top-[46px] left-1/2 transform -translate-x-1/2 text-white text-5xl font-bold mb-4 z-20">
          Blogs
        </h1>

        {/* Content */}
        <div className="absolute top-[126px] left-1/2 transform -translate-x-1/2 bg-white/10 rounded-[10px] px-6 py-4 flex items-center justify-center space-x-3 z-20">
          {/* Home Icon and Link */}
          <AiOutlineHome className="text-white text-lg" />
          <Link
            to="/"
            className="text-white text-base hover:text-gray-300 font-sora font-normal"
          >
            Home
          </Link>
          {/* Arrow Icon */}
          <MdKeyboardArrowRight className="text-gray-400 text-lg" />
          {/* Services */}
          <span className="text-red-500 text-base font-sora font-normal">
            Blogs
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
