import { InvalidTokenError } from "@shared/errors/errors.js";
import { isAfter } from "date-fns";

import { InputUpdateUserDTO } from "../dtos/user.dto.js";
import { IGetUserByVerificationTokenRepository } from "../repositories/get-user-by-verification-token.interface.js";
import { IUpdateUserRepository } from "../repositories/update-user.interface.js";

export class VerifyEmailUseCase {
  constructor(
    private readonly getUserByVerificationTokenRepository: IGetUserByVerificationTokenRepository,
    private readonly updateUserRepository: IUpdateUserRepository,
  ) {}
  async execute(token: string): Promise<boolean> {
    const user = await this.getUserByVerificationTokenRepository.execute(token);

    if (!user) throw new InvalidTokenError("Invalid token error!");

    const now = new Date();
    if (
      user.verificationTokenExpiry &&
      isAfter(now, user.verificationTokenExpiry)
    )
      throw new InvalidTokenError("Token expired");

    const updatePayload = {
      emailVerified: true,
      verificationToken: null,
    };

    return !!(await this.updateUserRepository.execute(
      user.id,
      updatePayload as InputUpdateUserDTO,
    ));
  }
}
