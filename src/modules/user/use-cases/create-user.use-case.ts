import {
  hasMailServer,
  isDisposableEmail,
} from "@infra/providers/mail/utils/email-validator.js";
import {
  DomainEmailError,
  EmailAlreadyExistsError,
} from "@shared/errors/errors.js";
import { IMailQueueProvider } from "@shared/providers/queue/mail-queue-provider.interface.js";
import bcrypt from "bcryptjs";
import { addHours } from "date-fns";

import { InputCreateUserDTO } from "../dtos/user.dto.js";
import {
  ICreateUserRepository,
  IGetUserByEmailRepository,
} from "../repositories/index.js";

export class CreateUserUseCase {
  constructor(
    private readonly createUserRepository: ICreateUserRepository,
    private readonly getUserByEmailRepository: IGetUserByEmailRepository,
    private readonly mailProvider: IMailQueueProvider,
  ) {}
  async execute(data: InputCreateUserDTO) {
    const emailAlreadyExists = await this.getUserByEmailRepository.execute(
      data.email,
    );
    const mailServerExists = await hasMailServer(data.email);
    const emailIsDisposable = isDisposableEmail(data.email);

    if (!mailServerExists || emailIsDisposable) {
      throw new DomainEmailError();
    }
    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError();
    }

    const generatedToken = crypto.randomUUID();
    const expiryDate = addHours(new Date(), 24);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.createUserRepository.execute({
      ...data,
      password: hashedPassword,
      verificationToken: generatedToken,
      verificationTokenExpiry: expiryDate,
    });

    if (user) {
      await this.mailProvider.addJob({
        to: user.email,
        subject: `Bem-vindo ao Conecta +! 🎉`,
        body: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Olá, ${user.username}!</h2>
          <p>Que incrível ter você com a gente. Sua conta no <strong>Conecta +</strong> foi criada com sucesso.</p>
          <p>Agora você já pode explorar os melhores eventos da região ou criar os seus próprios.</p>
          <br/>
          <p>Um abraço,<br/>Equipe Conecta +</p>
        </div>
        `,
      });

      await this.mailProvider.addJob({
        to: user.email,
        subject: `Bem-vindo ao Conecta +! 🎉`,
        body: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Olá, ${user.username}!</h2>
        <p>Que incrível ter você com a gente. Sua conta no <strong>Conecta +</strong> foi criada com sucesso.</p>
        <p>Por seguranca, por favor, confirme seu email clicando no link abaixo:</p><p><a href="http://localhost:3000/verify-email?token=${generatedToken}">Confirmar Email</a></p>
        </div>`,
      });
    }
    return user;
  }
}
