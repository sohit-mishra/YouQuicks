const Blog = require("@/models/Blog");
const cloudinary = require("@/config/cloudinary");

const AllBlog = async (req, res) => {
  try {
    const allblogs = await Blog.find().populate(
      "authorId",
      "firstName lastName email"
    );
    const formatedBlog = allblogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      authorName: blog.authorId
        ? `${blog.authorId.firstName || ""} ${
            blog.authorId.lastName || ""
          }`.trim()
        : "",
      authorEmail: blog.authorId?.email || "",
      isPublished: blog.isPublished,
      createdAt: blog.createdAt,
    }));
    res.status(200).json(formatedBlog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const GetAllBlogEmployeeId = async (req, res) => {
  const employeeId = req.userId;
  try {
    const blogs = await Blog.find({ authorId: employeeId });

    res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const CreateBlog = async (req, res) => {
  try {
    const employeeId = req.userId;
    console.log(employeeId);
    const { title, content, tags, coverImage, isPublished } = req.body;

    const newBlog = {
      title,
      content,
      authorId: employeeId,
      tags,
      coverImage,
      isPublished,
    };

    await newBlog.save();
    res.status(201).json({ message: "Blog Created Successfullly" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const UpdateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.userId;

    const blog = Blog.findById(id);

    if (String(blog.authorId) !== String(employeeId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, content, tags, coverImage, isPublished } = req.body;

    const updated = await Blog.findByIdAndUpdate(
      id,
      { title, content, tags, coverImage, isPublished },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Page Not Found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const DeleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(403).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog Deleted Sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const SingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).select("-authorId");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog",
    });

    res.status(200).json({
      message: "Image uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

module.exports = {
  AllBlog,
  GetAllBlogEmployeeId,
  CreateBlog,
  UpdateBlog,
  DeleteBlog,
  SingleBlog,
  uploadImage,
};
