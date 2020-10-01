import { Arg, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";
import { validateRegisterInput } from "../lib";
import { RegisterInput, UserResonse } from "./types";
import { User } from "../entities/User";

@Resolver()
export class UserResolver {
  @Mutation(() => UserResonse)
  async register(
    @Arg("options") { password, email, username }: RegisterInput
  ): Promise<UserResonse> {
    const errors = validateRegisterInput({ password, email, username });

    if (errors) return { errors };

    const hashedPassword = await argon2.hash(password);

    let user;

    try {
      user = await User.create({
        email,
        password: hashedPassword,
        username,
      }).save();
      console.log(user);
    } catch (err) {
      return {
        errors: [
          {
            field: "username",
            message: err.message,
          },
        ],
      };
    }

    return {
      user,
    };
  }
}
