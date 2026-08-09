import React from "react";
import BlogHeader from "./BlogHeader";
import BlogContexts from "./BlogContexts";

const Blog = () => {
  return (
    <>
      <div className="flex flex-col w-full">
        <BlogHeader />
        <BlogContexts />
      </div>
    </>
  );
};

export default Blog;
