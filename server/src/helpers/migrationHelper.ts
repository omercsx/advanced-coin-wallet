import { UserRoles } from "../interfaces/IUser";
import { IMigration, MigrationModel } from "../models/migration";
import User from "../models/user";

export class MigrationHelper {
  static migrations: IMigration[] = [];

  public static async migrate() {
    try {
      for (const migration of MigrationHelper.migrations) {
        const existingMigration = await MigrationModel.findOne({ name: migration.name }, { executed: 1, _id: 0 });
        if (!existingMigration || !existingMigration?.executed) {
          console.log(`Executing migration "${migration.name}"`);
          await MigrationModel.create({ name: migration.name, executed: true });
          await migration.migration();
          console.log("Migration executed");
        }
      }

      return;
    } catch (error: any) {
      console.log(error, error.stack);
      return;
    }
  }
}

export const addUserRoleMigration: IMigration = {
  name: "addUserRoleMigration",
  async migration() {
    const updateResult = await User.updateMany({ role: undefined }, { $set: { role: UserRoles.user } });
    console.log("addUserRoleMigration", updateResult.modifiedCount);
    return;
  },
};

MigrationHelper.migrations.push(addUserRoleMigration);
