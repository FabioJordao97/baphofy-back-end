import { User } from "../business/entities/User";
import { CustomError } from "../business/error/CustomError";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  private static TABLE_NAME = "baphofy_users";
  public async createUser(user: User): Promise<void> {
    try {
      await BaseDatabase.connection
        .insert(user)
        .into(UserDatabase.TABLE_NAME);
    } catch (error) {
      throw new CustomError(500, "Deu ruim rapá");
    }
  }

  public async getUserByEmail(email: string): Promise<User> {
    try {
      const result = await BaseDatabase.connection
      .select("*")
      .from(UserDatabase.TABLE_NAME)
      .where(email)

      return new User(
        result[0].id,
        result[0].name,
        result[0].email,
        result[0].password,
        result[0].nickname,
        result[0].profilePicture
      )

    } catch(error){
      throw new CustomError(500, "Deu ruim rapá");
    }
  }
}