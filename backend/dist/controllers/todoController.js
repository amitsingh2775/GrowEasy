"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.createTodo = exports.getAllTodos = void 0;
const Todo_js_1 = __importDefault(require("../models/Todo.js"));
const getAllTodos = async (req, res) => {
    try {
        const userId = req.user._id;
        const todos = await Todo_js_1.default.find({ user: userId }).sort({ createdAt: -1 });
        res.json(todos);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to fetch todos' });
    }
};
exports.getAllTodos = getAllTodos;
const createTodo = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title)
            return res.status(400).json({ message: 'Title is required' });
        const todo = await Todo_js_1.default.create({ title, completed: false, user: req.user._id });
        res.status(201).json(todo);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to create todo' });
    }
};
exports.createTodo = createTodo;
const updateTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const todo = await Todo_js_1.default.findById(id);
        if (!todo)
            return res.status(404).json({ message: 'Todo not found' });
        if (todo.user.toString() !== req.user._id.toString())
            return res.status(403).json({ message: 'Forbidden' });
        Object.assign(todo, updates);
        await todo.save();
        res.json(todo);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to update todo' });
    }
};
exports.updateTodo = updateTodo;
const deleteTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const todo = await Todo_js_1.default.findById(id);
        if (!todo)
            return res.status(404).json({ message: 'Todo not found' });
        if (todo.user.toString() !== req.user._id.toString())
            return res.status(403).json({ message: 'Forbidden' });
        await todo.deleteOne();
        res.status(204).end();
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to delete todo' });
    }
};
exports.deleteTodo = deleteTodo;
