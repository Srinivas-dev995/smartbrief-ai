export const checkUserHasCredits = (user) => {
  return user.credits > 0;
};

export const deductCredit = async (user) => {
  user.credits -= 1;
  await user.save();
};

export const addCredits = async (user, amount) => {
  user.credits += amount;
  await user.save();
};
