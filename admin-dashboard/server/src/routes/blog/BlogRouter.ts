import { Router } from "express";
import {
  createNewBlog,
  deleteBlog,
  getAllBlogs,
  getBlogBySlug,
  getOneBlog,
  updateBlog,
  uploadMiddleware,
} from "../../controllers/blog/Blog";
const router = Router();

router.post("/new-blog", uploadMiddleware, createNewBlog);
router.put("/update-blog", uploadMiddleware, updateBlog);
router.get("/get-blog-by-slug/:slug", getBlogBySlug);
router.get("/all-blogs", getAllBlogs);
router.get("/", getOneBlog);
router.delete("/delete-blog/:id", deleteBlog);

export default router;
