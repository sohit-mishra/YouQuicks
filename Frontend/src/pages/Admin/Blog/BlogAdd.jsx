import React, { useState } from "react";

export default function BlogAdd() {
  const [title, setTitle] = useState("Title");
  const [content, setContent] = useState("Write your blog content here...");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("tag1, tag2");

  return (
    <div className="flex flex-col items-center gap-6 p-6 max-w-4xl mx-auto">
      {/* Editable Title */}
      <h2
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => setTitle(e.target.innerText)}
        className="text-4xl font-bold outline-none max-w-2xl overflow-hidden text-ellipsis break-words"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {title}
      </h2>

      {/* Editable Content */}
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => setContent(e.target.innerText)}
        className="w-full border border-gray-300 p-4 min-h-[100px] rounded-md outline-none"
      >
        {content}
      </div>

      {/* Editable Cover Image URL */}
      <div className="w-full">
        <p className="font-semibold mb-1">Cover Image URL (edit below):</p>
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setCoverImage(e.target.innerText)}
          className="border border-dashed border-gray-400 p-2 rounded-md outline-none text-sm"
        >
          {coverImage || "https://your-image-url.jpg"}
        </p>
        {coverImage && (
          <img
            src={coverImage}
            alt="cover"
            className="mt-4 max-w-sm rounded shadow"
          />
        )}
      </div>

      {/* Editable Tags */}
      <div className="w-full">
        <p className="font-semibold mb-1">Tags (comma separated):</p>
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setTags(e.target.innerText)}
          className="border border-dashed border-gray-400 p-2 rounded-md outline-none text-sm"
        >
          {tags}
        </p>
      </div>
    </div>
  );
}
