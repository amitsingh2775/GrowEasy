
import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getAllTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todoController.js';

const router = Router();


router.use(protect);


router.get('/', getAllTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
