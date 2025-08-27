export const validateExpense = (req, res, next) => {
  const { amount, category_id, date, type, start_date, end_date } = req.body;
  if (!amount || isNaN(amount)) return res.status(400).json({ message: 'Amount is required and must be a number' });
  if (!category_id) return res.status(400).json({ message: 'Category ID is required' });
  if (type === 'one-time' && (!date || isNaN(Date.parse(date)))) return res.status(400).json({ message: 'Date is required for one-time expenses' });
  if (type === 'recurring' && (!start_date || isNaN(Date.parse(start_date)))) return res.status(400).json({ message: 'Start date is required for recurring expenses' });
  if (type === 'recurring' && end_date && Date.parse(end_date) < Date.parse(start_date)) return res.status(400).json({ message: 'End date must be after start date' });
  next();
};

export default { validateExpense };