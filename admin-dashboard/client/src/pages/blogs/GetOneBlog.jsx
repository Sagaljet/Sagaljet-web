import React, { useEffect } from "react";
import BlogHeader from "./BlogHeader";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOneBlogFn } from "@/redux/slices/blog/GetOneBlog";
import Comment from "./Comment";

const GetOneBlog = () => {
  const blog = useSelector((state) => state.getOneBlog);

  const dispatch = useDispatch();

  const { title } = useParams();

  useEffect(() => {
    dispatch(getOneBlogFn(title));
  }, [dispatch, title]);

  // Fallbacks for metadata in case data is not loaded
  const metaTitle =
    blog.data?.title || "Protecting The Digital Kingdom - SkillUp Blogs";
  const metaDescription =
    blog.data?.content?.slice(0, 150) ||
    "Discover insights and tips from our blog. Explore trends, innovations, and expert advice.";
  const metaImage = blog.data?.image || "/default-blog-image.jpg";
  const metaAuthor = blog.data?.author || "Anonymous";

  return (
    <div className="w-full bg-white">
      {/* Dynamic SEO Metadata */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="author" content={metaAuthor} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`${window.location.origin}/blog/${blog.title}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImage} />
      </Helmet>

      {/* Blog Header */}
      <BlogHeader />

      {/* Blog Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-navy-900 mb-4">From our blog</h1>

        <h2 className="text-3xl font-bold text-navy-900 mb-6">
          {blog.data?.title || "Protecting The Digital Kingdom"}
        </h2>

        <div className="mb-8">
          <img
            src={blog.data?.image || "/placeholder.svg?height=300&width=800"}
            alt={blog.data?.title || "Blog post featured image"}
            className="w-full h-[300px] object-cover rounded-lg shadow-md"
          />
        </div>

        <div className="flex items-center mb-6">
          <div className="text-sm text-gray-600">
            Written by{" "}
            <span className="font-medium">
              {blog.data?.author || "Anonymous"}
            </span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            {blog.data?.content ||
              "Cybersecurity is a high-stakes world for the work I have to do between now and Tuesday."}
          </p>
        </div>
      </main>

      {/* Comments Section */}
      <Comment />
    </div>
  );
};

export default GetOneBlog;
