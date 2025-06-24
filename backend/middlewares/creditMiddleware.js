export const ensureCredits = (req, res, next) => {
  if (req.user.credits <= 0) {
    return res.status(402).json({ message: "Not enough credits. Please recharge." });
  }
  next();
};
