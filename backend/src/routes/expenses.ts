import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  const expenses = await prisma.expense.findMany({
    include: { category: true },
    orderBy: { spentAt: "desc" },
  });
  res.json(expenses);
});

router.post("/", async (req, res) => {
  const { description, amount, categoryId, spentAt } = req.body;
  if (!description || amount == null || !categoryId) {
    return res.status(400).json({ error: "description, amount, categoryId are required" });
  }
  try {
    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        categoryId: Number(categoryId),
        ...(spentAt && { spentAt: new Date(spentAt) }),
      },
      include: { category: true },
    });
    res.status(201).json(expense);
  } catch {
    res.status(400).json({ error: "invalid data or unknown category" });
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { description, amount, categoryId, spentAt } = req.body;
  try {
    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...(description && { description }),
        ...(amount != null && { amount }),
        ...(categoryId && { categoryId: Number(categoryId) }),
        ...(spentAt && { spentAt: new Date(spentAt) }),
      },
      include: { category: true },
    });
    res.json(expense);
  } catch {
    res.status(404).json({ error: "expense not found" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.expense.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "expense not found" });
  }
});

router.get("/summary", async (_req, res) => {
  const totals = await prisma.expense.groupBy({
    by: ["categoryId"],
    _sum: { amount: true },
  });
  res.json(totals);
});

export default router;