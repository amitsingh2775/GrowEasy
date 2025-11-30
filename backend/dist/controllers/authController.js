"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.logout = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = __importDefault(require("../models/User.js"));
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'keyboard_cat';
    const expiresIn = '30d';
    return jsonwebtoken_1.default.sign({ id }, secret, { expiresIn });
};
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Please provide name, email and password' });
        const existing = await User_js_1.default.findOne({ email });
        if (existing)
            return res.status(400).json({ message: 'Email already in use' });
        const user = await User_js_1.default.create({ name, email, password });
        const token = generateToken(user._id.toString());
        res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Server error' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Please provide email and password' });
        const user = await User_js_1.default.findOne({ email });
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials' });
        const isMatch = await user.matchPassword(password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid credentials' });
        const token = generateToken(user._id.toString());
        res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Server error' });
    }
};
exports.login = login;
const logout = async (_req, res) => {
    // Stateless JWT: simply return success. If you want invalidation, implement blacklist store.
    res.status(200).json({ message: 'Logged out' });
};
exports.logout = logout;
const getProfile = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        res.json({ id: req.user._id, name: req.user.name, email: req.user.email });
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Server error' });
    }
};
exports.getProfile = getProfile;
