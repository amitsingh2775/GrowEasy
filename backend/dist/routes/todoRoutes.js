"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/todos.ts
const express_1 = require("express");
const auth_js_1 = require("../middleware/auth.js");
const todoController_js_1 = require("../controllers/todoController.js");
const router = (0, express_1.Router)();
router.use(auth_js_1.protect);
router.get('/', todoController_js_1.getAllTodos);
router.post('/', todoController_js_1.createTodo);
router.put('/:id', todoController_js_1.updateTodo);
router.delete('/:id', todoController_js_1.deleteTodo);
exports.default = router;
