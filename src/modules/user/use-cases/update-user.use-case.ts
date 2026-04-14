import { Prisma } from "@generated/prisma/client.js";
import {
  EmailAlreadyExistsError,
  UserNotFoundError,
} from "@shared/errors/errors.js";
import { IMailQueueProvider } from "@shared/providers/queue/mail-queue-provider.interface.js";

import { InputUpdateUserDTO, OutputUpdateUserDTO } from "../dtos/user.dto.js";
import {
  IGetUserByEmailRepository,
  IGetUserByIdRepository,
  IUpdateUserRepository,
} from "../repositories/index.js";

export class UpdateUserUseCase {
  constructor(
    private readonly updateUserRepository: IUpdateUserRepository,
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly getUserByEmailRepository: IGetUserByEmailRepository,
    private readonly mailProvider: IMailQueueProvider,
  ) {}
  async execute(
    userId: string,
    data: InputUpdateUserDTO,
  ): Promise<OutputUpdateUserDTO | null> {
    const [currentUser, userWithSameEmail] = await Promise.all([
      this.getUserByIdRepository.execute(userId),
      data.email
        ? this.getUserByEmailRepository.execute(data.email)
        : Promise.resolve(null),
    ]);

    if (!currentUser) {
      throw new UserNotFoundError();
    }

    if (userWithSameEmail && userWithSameEmail.id !== userId) {
      throw new EmailAlreadyExistsError();
    }

    const updatePayload: Prisma.UserUpdateInput = {};

    if (data.username) {
      updatePayload.username = data.username;
    }

    if (data.email && data.email !== currentUser.email) {
      updatePayload.email = data.email;

      updatePayload.emailVerified = false;

      const newToken = crypto.randomUUID();
      updatePayload.verificationToken = newToken;

      await this.mailProvider.addJob({
        to: data.email,
        subject: "Confirme seu novo e-mail no Conecta+",
        body: `Clique aqui para validar o seu novo e-mail: https://conectamais.app/verify?token=${newToken}`,
      });
    }

    return await this.updateUserRepository.execute(
      userId,
      updatePayload as InputUpdateUserDTO,
    );
  }
}
