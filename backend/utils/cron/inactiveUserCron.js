import cron from "node-cron";
import { User } from "../../models/User.model.js";


export const deactivateInactiveUsers = () => {
  // Runs every day at midnight
  cron.schedule("0 0 * * *", async () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    try {
      const result = await User.updateMany(
        { lastActive: { $lt: sevenDaysAgo }, isActive: true },
        { $set: { isActive: false } }
      );

      console.log(
        `Cron: Deactivated ${result.modifiedCount} inactive users`
      );
    } catch (err) {
      console.error("Cron error:", err.message);
    }
  });
};
