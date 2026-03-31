import { CreateUserRepository } from "../repositories/create-user.repo.js";
import { DeleteUserRepository } from "../repositories/delete-user.repo.js";
import { GetUserByEmailRepository } from "../repositories/get-user-by-email.repo.js";
import { GetUserByIdRepository } from "../repositories/get-user-by-id.repo.js";
import { UpdateUserRepository } from "../repositories/update-user.repo.js";
import { CreateUserUseCase } from "../use-cases/create-user.use-case.js";
import { DeleteUserUseCase } from "../use-cases/delete-user.use-case.js";
import { GetUserByIdUseCase, UpdateUserUseCase } from "../use-cases/index.js";

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
  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    getUserByEmailRepository,
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
  const updateUserUseCase = new UpdateUserUseCase(
    updateUserRepository,
    getUserByIdRepository,
    getUserByEmailRepository,
  );
  return updateUserUseCase;
};
