"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenseController_1 = require("../controllers/expenseController");
const router = (0, express_1.Router)();
// Redirect root to the category endpoint for now
router.get("/", (req, res) => {
    res.redirect("/expenses/category");
});
router.get("/category", expenseController_1.getExpensesByCategory);
exports.default = router;
