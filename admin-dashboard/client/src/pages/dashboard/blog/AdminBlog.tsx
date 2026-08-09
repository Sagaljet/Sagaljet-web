"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBlogFn } from "@/redux/slices/blog/GetBlog";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { Eye, Calendar, User } from "lucide-react";
import type { RootState } from "@/redux/store";
import UpdateBlogDialog from "./UpdateBlogDialog";
import DeleteBlogDialog from "./DeleteBlogDialog";
import CreateBlogDialog from "./CreateBlogDialog";

export default function AdminBlog() {
  const [screenSize, setScreenSize] = useState("large");
  const [expandedContent, setExpandedContent] = useState({});
  const blog = useSelector((state: RootState) => state.getAllBlogs);
  const dispatch = useDispatch();

  useEffect(() => {
    //@ts-ignore
    dispatch(getBlogFn());

    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("small");
      } else if (window.innerWidth < 1024) {
        setScreenSize("medium");
      } else {
        setScreenSize("large");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  // Function to strip HTML tags and get plain text
  const getPlainText = (htmlContent: any) => {
    if (!htmlContent) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = DOMPurify.sanitize(htmlContent);
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // Function to safely render HTML content
  const renderHTMLContent = (htmlContent: any, maxLength = 100) => {
    if (!htmlContent) return <span>No content</span>;

    const sanitizedHTML = DOMPurify.sanitize(htmlContent);
    const plainText = getPlainText(sanitizedHTML);

    if (plainText.length <= maxLength) {
      return (
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
      );
    }

    return (
      <div className="prose prose-sm max-w-none">
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              htmlContent.substring(0, maxLength) + "..."
            ),
          }}
        />
      </div>
    );
  };

  // Function to toggle content expansion
  const toggleContentExpansion = (blogId: any) => {
    setExpandedContent((prev) => ({
      ...prev,
      //@ts-ignore
      [blogId]: !prev[blogId],
    }));
  };

  const renderBlogCard = (blogItem: any) => (
    <Card key={blogItem.id} className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={blogItem.image || "/placeholder.svg"}
                alt={blogItem.title}
              />
              <AvatarFallback>
                {blogItem.title?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-lg line-clamp-2">
                {blogItem.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                <User className="h-3 w-3" />
                <span>{blogItem.author}</span>
                <Calendar className="h-3 w-3 ml-2" />
                <span>{new Date(blogItem.createAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <UpdateBlogDialog blog={blogItem} />
            <DeleteBlogDialog blog={blogItem.id} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm">
            {/* @ts-ignore */}
            {expandedContent[blogItem.id] ? (
              <div className="prose prose-sm max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(blogItem.content),
                  }}
                />
              </div>
            ) : (
              renderHTMLContent(blogItem.content, 150)
            )}

            {getPlainText(blogItem.content).length > 150 && (
              <button
                onClick={() => toggleContentExpansion(blogItem.id)}
                className="text-primary hover:underline text-sm mt-2 flex items-center"
              >
                <Eye className="h-3 w-3 mr-1" />
                {/* @ts-ignore */}
                {expandedContent[blogItem.id] ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <Badge variant="secondary">ID: {blogItem.id}</Badge>
            <span>
              {
                getPlainText(blogItem.content)
                  .split(" ")
                  .filter((word) => word.length > 0).length
              }{" "}
              words
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderBlogTable = () => (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Title</TableHead>
              <TableHead className="hidden md:table-cell min-w-[300px]">
                Content
              </TableHead>
              <TableHead className="hidden lg:table-cell">Author</TableHead>
              <TableHead>Image</TableHead>
              <TableHead className="hidden md:table-cell">Created At</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(blog?.data) && blog.data.length > 0 ? (
              blog.data.map((blogItem: any) => (
                <TableRow key={blogItem.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-[200px]">
                      <h4 className="font-semibold line-clamp-2">
                        {blogItem.title}
                      </h4>
                      <Badge variant="outline" className="mt-1 text-xs">
                        ID: {blogItem.id}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    <div className="max-w-[300px]">
                      {/* @ts-ignore */}
                      {expandedContent[`table-${blogItem.id}`] ? (
                        <div className="prose prose-sm max-w-none">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(blogItem.content),
                            }}
                          />
                        </div>
                      ) : (
                        <div>{renderHTMLContent(blogItem.content, 80)}</div>
                      )}

                      {getPlainText(blogItem.content).length > 80 && (
                        <button
                          onClick={() =>
                            toggleContentExpansion(`table-${blogItem.id}`)
                          }
                          className="text-primary hover:underline text-xs mt-1 flex items-center"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          {/* @ts-ignore */}
                          {expandedContent[`table-${blogItem.id}`]
                            ? "Less"
                            : "More"}
                        </button>
                      )}

                      <div className="text-xs text-muted-foreground mt-1">
                        {
                          getPlainText(blogItem.content)
                            .split(" ")
                            .filter((word) => word.length > 0).length
                        }{" "}
                        words
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3" />
                      <span className="text-sm">{blogItem.author}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={blogItem.image || "/placeholder.svg"}
                        alt={blogItem.title}
                      />
                      <AvatarFallback>
                        {blogItem.title?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(blogItem.createAt).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <UpdateBlogDialog blog={blogItem} />
                      <DeleteBlogDialog blog={blogItem.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center space-y-2">
                    <p className="text-muted-foreground">No blogs found.</p>
                    <CreateBlogDialog />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .prose {
          color: inherit;
        }

        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4,
        .prose h5,
        .prose h6 {
          color: inherit;
          margin: 0.5em 0;
        }
        
        .prose p {
          margin: 0.5em 0;
        }
        
        .prose ul, .prose ol {
          margin: 0.5em 0;
          padding-left: 1.5em;
        }
        
        .prose blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 0.5em 0;
          font-style: italic;
        }
        
        .prose code {
          background-color: #f3f4f6;
          padding: 0.125em 0.25em;
          border-radius: 0.25em;
          font-size: 0.875em;
        }
        
        .prose pre {
          background-color: #f3f4f6;
          padding: 1em;
          border-radius: 0.5em;
          overflow-x: auto;
        }
        
        .prose a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .prose strong {
          font-weight: 600;
        }
        
        .prose em {
          font-style: italic;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Blog Management</h1>
            <p className="text-muted-foreground mt-1">
              {Array.isArray(blog?.data) ? blog.data.length : 0} blog(s) total
            </p>
          </div>
          <CreateBlogDialog />
        </div>

        {screenSize === "small" ? (
          <div className="space-y-4">
            {Array.isArray(blog?.data) && blog.data.length > 0 ? (
              blog.data.map(renderBlogCard)
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No blogs found.</p>
                <CreateBlogDialog />
              </div>
            )}
          </div>
        ) : (
          renderBlogTable()
        )}
      </div>
    </>
  );
}
