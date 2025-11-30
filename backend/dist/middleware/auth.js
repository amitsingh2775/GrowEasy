"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = __importDefault(require("../models/User.js"));
const protect = async (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = auth.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const secret = process.env.JWT_SECRET || 'keyboard_cat';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // runtime check: ensure decoded is an object and has an 'id' property
        if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
            return res.status(401).json({ message: 'Token invalid or expired' });
        }
        // TypeScript still doesn't know the shape, narrow it with `as`
        const payload = decoded;
        const user = await User_js_1.default.findById(payload.id).select('-password');
        if (!user)
            return res.status(401).json({ message: 'User not found' });
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token invalid or expired' });
    }
};
exports.protect = protect;
