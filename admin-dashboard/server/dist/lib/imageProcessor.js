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
exports.processImage = void 0;
// lib/imageProcessor.ts
const sharp_1 = __importDefault(require("sharp"));
const processImage = (file, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { maxWidth = 1920, maxHeight = 1080, quality = 80 } = options || {};
    try {
        const processedBuffer = yield (0, sharp_1.default)(file.buffer)
            .resize(maxWidth, maxHeight, {
            fit: 'inside',
            withoutEnlargement: true,
        })
            .webp({ quality }) // Convert to WebP for smaller size
            .toBuffer();
        return {
            buffer: processedBuffer,
            mimetype: 'image/webp',
            originalname: file.originalname.replace(/\.[^.]+$/, '.webp'),
        };
    }
    catch (error) {
        console.error('Image processing error:', error);
        // Return original if processing fails
        return {
            buffer: file.buffer,
            mimetype: file.mimetype,
            originalname: file.originalname,
        };
    }
});
exports.processImage = processImage;
