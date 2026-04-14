import { GetUserByVerificationTokenRepository } from "@infra/database/prisma/repositories/user/get-user-by-verification-token.repo.js";
import {
  CreateUserRepository,
  DeleteUserRepository,
  GetUserByEmailRepository,
  GetUserByIdRepository,
  UpdateUserRepository,
} from "@infra/database/prisma/repositories/user/index.js";
import { UpdateUserAvatarRepository } from "@infra/database/prisma/repositories/user/update-user-avatar.repo.js";
import { CloudinaryProvider } from "@infra/providers/image-upload/cloudinary.provider.js";
import { BullMQMailQueueProvider } from "@infra/providers/queue/mail-queue-provider.js";

import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from "../use-cases/index.js";
import { UpdateUserAvatarUseCase } from "../use-cases/update-user-avatar.use-case.js";
import { VerifyEmailUseCase } from "../use-cases/verify-email.use-case.js";

export const makeDeleteUserUseCase = () => {
  const deleteUserRepository = new DeleteUserRepository();
  const getUserByIdRepository = new GetUserByIdRepository();
  const deleteUserUseCase = new DeleteUserUseCase(
    getUserByIdRepository,
    deleteUserRepository,
  );
  return deleteUserUseCase;
};

export const makeCreateUserUseCase = () => {
  const getUserByEmailRepository = new GetUserByEmailRepository();
  const createUserRepository = new CreateUserRepository();
  const mailQueueProvider = new BullMQMailQueueProvider();
  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    getUserByEmailRepository,
    mailQueueProvider,
  );
  return createUserUseCase;
};

export const makeGetUserByIdUseCase = () => {
  const getUserByIdRepository = new GetUserByIdRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
  return getUserByIdUseCase;
};

export const makeUpdateUserUseCase = () => {
  const getUserByEmailRepository = new GetUserByEmailRepository();
  const getUserByIdRepository = new GetUserByIdRepository();
  const updateUserRepository = new UpdateUserRepository();
  const mailProvider = new BullMQMailQueueProvider();
  const updateUserUseCase = new UpdateUserUseCase(
    updateUserRepository,
    getUserByIdRepository,
    getUserByEmailRepository,
    mailProvider,
  );
  return updateUserUseCase;
};

export const makeUpdateUserAvatarUseCase = () => {
  const updateUserAvatarRepository = new UpdateUserAvatarRepository();
  const getUserByIdRepository = new GetUserByIdRepository();
  const uploadImageProvider = new CloudinaryProvider();
  const updateUserAvatarUseCase = new UpdateUserAvatarUseCase(
    updateUserAvatarRepository,
    getUserByIdRepository,
    uploadImageProvider,
  );

  return updateUserAvatarUseCase;
};

export const makeVerifyEmailUseCase = () => {
  const getUserByVerificationTokenRepository =
    new GetUserByVerificationTokenRepository();
  const updateUserRepository = new UpdateUserRepository();
  const verifyEmailUseCase = new VerifyEmailUseCase(
    getUserByVerificationTokenRepository,
    updateUserRepository,
  );
  return verifyEmailUseCase;
};
