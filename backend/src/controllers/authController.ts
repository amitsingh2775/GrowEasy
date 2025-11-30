import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const generateToken = (id: string) => {
const secret = process.env.JWT_SECRET || 'keyboard_cat';
const expiresIn = '30d';
return jwt.sign({ id }, secret, { expiresIn });
};


export const signup = async (req: Request, res: Response) => {
try {
const { name, email, password } = req.body;
if (!name || !email || !password) return res.status(400).json({ message: 'Please provide name, email and password' });


const existing = await User.findOne({ email });
if (existing) return res.status(400).json({ message: 'Email already in use' });


const user = await User.create({ name, email, password });


const token = generateToken(user._id.toString());


res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
} catch (err: any) {
res.status(500).json({ message: err.message || 'Server error' });
}
};


export const login = async (req: Request, res: Response) => {
try {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });


const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });


const isMatch = await user.matchPassword(password);
if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });


const token = generateToken(user._id.toString());


res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
} catch (err: any) {
res.status(500).json({ message: err.message || 'Server error' });
}
};


export const logout = async (_req: Request, res: Response) => {
// Stateless JWT: simply return success. If you want invalidation, implement blacklist store.
res.status(200).json({ message: 'Logged out' });
};


export const getProfile = async (req: Request & { user?: any }, res: Response) => {
try {
if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
res.json({ id: req.user._id, name: req.user.name, email: req.user.email });
} catch (err: any) {
res.status(500).json({ message: err.message || 'Server error' });
}
};