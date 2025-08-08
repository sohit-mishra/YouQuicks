import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";

export default function BlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/blog/${id}`
        );
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading...</div>;
  }

  if (!blog) {
    return <div className="p-6 text-red-500">Blog not found.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-3xl mx-auto"
    >
      {blog.coverImage && (
        <>
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full max-h-96 object-cover rounded-lg mb-6"
          />
        </>
      )}

      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

      {blog.tags?.length > 0 && (
        <>
          <div className="mb-4 space-x-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="text-sm bg-gray-200 rounded-full px-3 py-1 text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </>
      )}

      <div
        className="prose max-w-full [h1, h2, h3, h4, h5, h6]:mt-[10px] prose-p:mb-4"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
      />

      {blog.comments?.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-8 mb-2">Comments</h2>
          {blog.comments.map((comment, index) => (
            <div key={index} className="border p-3 mb-2 rounded-md bg-gray-50">
              <p className="text-sm text-gray-800">{comment.text}</p>
              <p className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </>
      )}
    </motion.div>
  );
}
