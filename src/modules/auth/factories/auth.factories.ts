import { DeleteTokenRepository } from "@infra/database/prisma/repositories/auth/delete-token.repo.js";
import { FindByTokenRepository } from "@infra/database/prisma/repositories/auth/find-by-token.repo.js";
import { GenerateForgotPasswordTokenRepository } from "@infra/database/prisma/repositories/auth/generate-token.repo.js";
import { GetUserByEmailRepository } from "@infra/database/prisma/repositories/user/get-user-by-email.repo.js";
import { UpdatePasswordRepository } from "@infra/database/prisma/repositories/user/update-password.repo.js";
import { BullMQMailQueueProvider } from "@infra/providers/queue/mail-queue-provider.js";

import { GenerateForgotPasswordTokenUseCase } from "../use-cases/generate-token.use-case.js";
import { ResetPasswordUseCase } from "../use-cases/reset-password.use-case.js";

export const makeGenerateForgotPasswordTokenUseCase = () => {
  const getUserByEmailRepository = new GetUserByEmailRepository();
  const generateForgotPasswordTokenRepository =
    new GenerateForgotPasswordTokenRepository();
  const mailProvider = new BullMQMailQueueProvider();
  const generateForgotPasswordTokenUseCase =
    new GenerateForgotPasswordTokenUseCase(
      getUserByEmailRepository,
      generateForgotPasswordTokenRepository,
      mailProvider,
    );

  return generateForgotPasswordTokenUseCase;
};

export const makeResetPasswordUseCase = () => {
  const findByTokenRepository = new FindByTokenRepository();
  const deleteTokenRepository = new DeleteTokenRepository();
  const updatePasswordRepository = new UpdatePasswordRepository();
  const resetPasswordUseCase = new ResetPasswordUseCase(
    findByTokenRepository,
    deleteTokenRepository,
    updatePasswordRepository,
  );

  return resetPasswordUseCase;
};
