import type { Request, Response } from 'express';
import Todo from '../models/Todo.js';


export const getAllTodos = async (req: Request & { user?: any }, res: Response) => {
try {
const userId = req.user._id;
const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });
res.json(todos);
} catch (err: any) {
res.status(500).json({ message: err.message || 'Failed to fetch todos' });
}
};


export const createTodo = async (req: Request & { user?: any }, res: Response) => {
try {
const { title } = req.body;
if (!title) return res.status(400).json({ message: 'Title is required' });


const todo = await Todo.create({ title, completed: false, user: req.user._id });
res.status(201).json(todo);
} catch (err: any) {
res.status(500).json({ message: err.message || 'Failed to create todo' });
}
};


export const updateTodo = async (req: Request & { user?: any }, res: Response) => {
try {
const id = req.params.id;
const updates = req.body;


const todo = await Todo.findById(id);
if (!todo) return res.status(404).json({ message: 'Todo not found' });
if (todo.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });


Object.assign(todo, updates);
await todo.save();


res.json(todo);
} catch (err: any) {
res.status(500).json({ message: err.message || 'Failed to update todo' });
}
};


export const deleteTodo = async (req: Request & { user?: any }, res: Response) => {
try {
const id = req.params.id;
const todo = await Todo.findById(id);
if (!todo) return res.status(404).json({ message: 'Todo not found' });
if (todo.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });


await todo.deleteOne();
res.status(204).end();
} catch (err: any) {
res.status(500).json({ message: err.message || 'Failed to delete todo' });
}
};