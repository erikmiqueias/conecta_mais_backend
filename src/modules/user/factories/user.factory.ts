import {
  CreateUserRepository,
  DeleteUserRepository,
  GetUserByEmailRepository,
  GetUserByIdRepository,
  UpdateUserRepository,
} from "../repositories/index.js";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from "../use-cases/index.js";

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
