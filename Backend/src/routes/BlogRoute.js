const express = require("express");
const router = express.Router();

const {
  AllBlog,
  GetAllBlogEmployeeId,
  CreateBlog,
  UpdateBlog,
  DeleteBlog,
  SingleBlog,
  uploadImage,
} = require("@/controllers/BlogController");

const { authenticateToken, authorizeRoles } = require("@/middlewares/authMiddleware");
const upload = require("@/middlewares/uploadMiddleware");

router.get("/all", authenticateToken,authorizeRoles("ADMIN", "EMPLOYEE"), AllBlog);
router.get("/employee", authenticateToken, authorizeRoles("EMPLOYEE"), GetAllBlogEmployeeId);
router.post("/", authenticateToken, authorizeRoles("ADMIN","EMPLOYEE"), CreateBlog);
router.put("/:id", authenticateToken, authorizeRoles("ADMIN","EMPLOYEE"), UpdateBlog);
router.delete("/:id", authenticateToken, authorizeRoles("ADMIN", "EMPLOYEE"), DeleteBlog);
router.get("/:id", SingleBlog);
router.post("/upload/image", authenticateToken, authorizeRoles("EMPLOYEE"), upload.single("avatar"), uploadImage);

module.exports = router;
