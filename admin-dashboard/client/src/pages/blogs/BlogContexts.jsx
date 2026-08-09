import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { getBlogFn } from "@/redux/slices/blog/GetBlog";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const BlogContexts = () => {
  const blog = useSelector((state) => state.getAllBlogs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBlogFn());
  }, []);

  // Extract metadata for the last blog if available
  const latestBlog =
    Array.isArray(blog?.data) && blog.data.length > 0 ? blog.data[0] : null;
  return (
    <>
      <Helmet>
        <title>
          {latestBlog ? `${latestBlog.title} - SkillUp Blogs` : "SkillUp Blogs"}
        </title>
        <meta
          name="description"
          content={
            latestBlog
              ? `${latestBlog.content.slice(0, 150)}...`
              : "Explore our recent blogs for insights, trends, and expert tips in technology and innovation."
          }
        />
        <meta
          name="keywords"
          content="Technology Blogs, SkillUp, Tech Trends, Innovation, Expert Tips"
        />
        <meta
          property="og:title"
          content={latestBlog ? latestBlog.title : "SkillUp Blogs"}
        />
        <meta
          property="og:description"
          content={
            latestBlog
              ? `${latestBlog.content.slice(0, 150)}...`
              : "Explore our recent blogs for insights, trends, and expert tips in technology and innovation."
          }
        />
        <meta
          property="og:image"
          content={latestBlog ? latestBlog.image : "/default-blog-image.jpg"}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={latestBlog ? latestBlog.title : "SkillUp Blogs"}
        />
        <meta
          name="twitter:description"
          content={
            latestBlog
              ? `${latestBlog.content.slice(0, 150)}...`
              : "Explore our recent blogs for insights, trends, and expert tips in technology and innovation."
          }
        />
        <meta
          name="twitter:image"
          content={latestBlog ? latestBlog.image : "/default-blog-image.jpg"}
        />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-4">
          Explore Our Recent Blogs Created by SkillUp Technology
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Unlock insights, trends, and expert tips in technology and innovation.
        </p>

        {Array.isArray(blog.data) && blog.data.length > 0 ? (
          blog.data.slice(0, 1).map((blog) => (
            <div className="grid lg:grid-cols-2 gap-8 mb-16" key={blog.id}>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="object-cover rounded-md"
                  fill
                />
              </div>
              <div className="flex flex-col justify-center">
                <Badge className="w-fit mb-4 bg-red-100 text-red-500 hover:bg-red-100">
                  Last Blog
                </Badge>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  {blog.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="text-red-500">{blog.author}</span>
                  <span>{dayjs(blog.updateAt).format("MMM DD, YYYY")}</span>
                </div>
                <p className="text-gray-600">
                  {blog.content.slice(0, 250) + "..."}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No blogs available.</p>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(blog?.data) && blog.data.length > 0 ? (
            blog.data.map((blog) => (
              <div key={blog.id} className="group">
                <Link to={`/blog/${blog.title}`}>
                  <div className="relative h-[240px] rounded-lg overflow-hidden mb-4">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="object-cover cursor-pointer transition-transform group-hover:scale-105"
                      fill
                    />
                    <Badge className="absolute top-4 left-4 bg-red-100 text-red-500 hover:bg-red-100">
                      Blog
                    </Badge>
                  </div>
                </Link>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-500">
                  {blog.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span className="text-red-500">{blog.author}</span>
                  <span className="text-[#AAB9C8]">
                    {dayjs(blog.updateAt).format("MMM DD, YYYY")}
                  </span>
                </div>
                <p className="text-sm text-[#AAB9C8]">
                  {blog.content?.slice(0, 150) + "..."}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center">No blogs available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogContexts;
