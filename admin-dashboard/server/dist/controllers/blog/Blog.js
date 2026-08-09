"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogBySlug = exports.updateBlog = exports.deleteBlog = exports.getOneBlog = exports.getAllBlogs = exports.createNewBlog = exports.uploadMiddleware = void 0;
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const uploadToR2_1 = require("../../lib/uploadToR2");
const prisma = new client_1.PrismaClient();
// Configure multer for in-memory file storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
exports.uploadMiddleware = upload.single("image");
const createNewBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, author } = req.body;
        // Validate required fields
        if (!title || !content || !author) {
            return res.status(400).json({
                message: "Please provide all required fields!",
                isSuccess: false,
            });
        }
        // Handle image upload if provided
        let imageUrl = "";
        if (req.file) {
            imageUrl = yield (0, uploadToR2_1.uploadToR2)(req.file); // Assuming uploadToR2 returns the image URL
        }
        function generateSlug(title) {
            return title
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");
        }
        const slug = generateSlug(title);
        // Create a new blog post in the database
        const newBlog = yield prisma.blog.create({
            data: {
                author,
                title,
                image: imageUrl,
                content,
                slug,
            },
        });
        return res.json({
            result: newBlog,
            message: "Blog has been successfully added.",
            isSuccess: true,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error!",
            isSuccess: false,
        });
    }
});
exports.createNewBlog = createNewBlog;
//get-all Blogs
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBlogs = yield prisma.blog.findMany({
            orderBy: { updateAt: "desc" },
        });
        res.json({
            result: [...allBlogs],
            isSuccess: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "server error",
        });
    }
});
exports.getAllBlogs = getAllBlogs;
//get-one Blog
const getOneBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.query;
        const blog = yield prisma.blog.findFirst({
            where: {
                title: title === null || title === void 0 ? void 0 : title.toString(),
            },
        });
        if (!blog) {
            res.status(404).json({
                message: "Not Found Data!.",
                isSuccess: false,
            });
            return;
        }
        res.json({
            result: Object.assign({}, blog),
            isSuccess: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "server error",
        });
    }
});
exports.getOneBlog = getOneBlog;
//delete Blog
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const blog = yield prisma.blog.findFirst({
            where: {
                id: +id,
            },
        });
        if (!blog) {
            res.status(404).json({
                message: "Not Found Data!.",
                isSuccess: false,
            });
            return;
        }
        const deleteBlog = yield prisma.blog.delete({
            where: {
                id: +id,
            },
        });
        res.json({
            result: Object.assign({}, deleteBlog),
            isSuccess: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "server error",
        });
    }
});
exports.deleteBlog = deleteBlog;
//update
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, author, id } = req.body;
        // Validate required fields
        if (!title || !content || !author) {
            res.status(400).json({
                message: "Please provide all required fields!",
                isSuccess: false,
            });
            return;
        }
        // Handle image upload if provided
        let imageUrl = "";
        if (req.file) {
            imageUrl = yield (0, uploadToR2_1.uploadToR2)(req.file); // Assuming uploadToR2 returns the image URL
        }
        // Create a new blog post in the database
        const newBlog = yield prisma.blog.update({
            where: {
                id: +id,
            },
            data: {
                author,
                title,
                image: imageUrl,
                content,
            },
        });
        return res.json({
            result: newBlog,
            message: "Blog has been successfully added.",
            isSuccess: true,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error!",
            isSuccess: false,
        });
    }
});
exports.updateBlog = updateBlog;
const getBlogBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        // First try to find by slug field if it exists
        let blog = yield prisma.blog.findFirst({
            where: {
                slug: slug,
            },
        });
        // If not found by slug, try to find by ID (if slug is numeric)
        if (!blog && !isNaN(Number(slug))) {
            blog = yield prisma.blog.findUnique({
                where: {
                    id: parseInt(slug),
                },
            });
        }
        // If still not found, try to generate slug from title and search
        if (!blog) {
            const blogs = yield prisma.blog.findMany();
            blog =
                blogs.find((e) => e.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "") === slug) || null;
        }
        if (!blog) {
            return res.status(404).json({
                message: `blog with slug ${slug} not found.`,
                success: false,
            });
        }
        res.json({
            result: blog,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-blog-by-slug)",
            error: error,
            success: false,
        });
    }
});
exports.getBlogBySlug = getBlogBySlug;
