import mongoose from 'mongoose';


export interface ITodo extends mongoose.Document {
title: string;
completed: boolean;
user: mongoose.Types.ObjectId;
createdAt: Date;
updatedAt: Date;
}


const todoSchema = new mongoose.Schema<ITodo>(
{
title: { type: String, required: true },
completed: { type: Boolean, default: false },
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
{ timestamps: true }
);


const Todo = mongoose.model<ITodo>('Todo', todoSchema);
export default Todo;