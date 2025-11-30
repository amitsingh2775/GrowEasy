"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const db_js_1 = __importDefault(require("./config/db.js"));
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const todoRoutes_js_1 = __importDefault(require("./routes/todoRoutes.js"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_js_1.default);
app.use('/api/todos', todoRoutes_js_1.default);
// Health route
app.get('/api', (_req, res) => res.json({ ok: true }));
// Error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
});
// Connect DB and start server
(0, db_js_1.default)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}/api`);
    });
})
    .catch((err) => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
});
