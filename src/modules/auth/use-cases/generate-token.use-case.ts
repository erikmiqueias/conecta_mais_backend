import { IGetUserByEmailRepository } from "@modules/user/repositories/get-user-by-email.interface.js";
import { IMailQueueProvider } from "@shared/providers/queue/mail-queue-provider.interface.js";
import { addHours } from "date-fns";

import { IGenerateForgotPasswordTokenRepository } from "../repositories/generate-token.interface.js";

export class GenerateForgotPasswordTokenUseCase {
  constructor(
    private readonly getUserByEmailRepository: IGetUserByEmailRepository,
    private readonly generateForgotPassordTokenRepository: IGenerateForgotPasswordTokenRepository,
    private readonly mailProvider: IMailQueueProvider,
  ) {}
  async execute(email: string): Promise<void> {
    const userExists = await this.getUserByEmailRepository.execute(email);

    if (!userExists) return;

    const expiresIn = addHours(new Date(), 2);

    const token = await this.generateForgotPassordTokenRepository.execute(
      userExists.id,
      expiresIn,
    );

    const resetLink = `http://localhost:${process.env.PORT}/reset-password?token=${token.code}`;

    await this.mailProvider.addJob({
      to: userExists.email,
      subject: "Conecta +: Recuperação de Senha",
      body: `
        <h1>Recuperação de Senha</h1>
        <p>Para recuperar sua senha clique no link abaixo:</p>
        <a href="${resetLink}">Redefinir minha senha.</a>
        <p>Este link expira em 2 horas.</p>
      `,
    });
  }
}
