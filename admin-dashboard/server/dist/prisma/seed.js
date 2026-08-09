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
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if admin already exists
        const existingAdmin = yield prisma.user.findUnique({
            where: {
                email: "admin@example.com",
            },
        });
        if (existingAdmin) {
            console.log("⚠️ Admin user already exists, skipping seed...");
            return;
        }
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = yield bcryptjs_1.default.hash("Admin@123", saltRounds);
        // Create admin user
        const admin = yield prisma.user.create({
            data: {
                userName: "Admin",
                email: "admin@example.com",
                password: hashedPassword,
                role: client_1.Role.ADMIN,
            },
        });
        console.log("✅ Admin user created successfully:");
        console.log({
            id: admin.id,
            userName: admin.userName,
            email: admin.email,
            role: admin.role,
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error("❌ Error seeding database:", e);
    yield prisma.$disconnect();
    process.exit(1);
}));
