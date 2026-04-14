import { SendMailError } from "@shared/errors/errors.js";
import {
  IMailProvider,
  SendMailDTO,
} from "@shared/providers/mail/mail-provider.interface.js";
import { Resend } from "resend";

export class ResendMailProvider implements IMailProvider {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendMail({
    body,
    subject,
    to,
    attachments,
  }: SendMailDTO): Promise<void> {
    const { data: _data, error } = await this.resend.emails.send({
      from: `Conecta + <no-reply@${process.env.MAIL_HOST}>`,
      to: [to],
      subject,
      html: body,
      attachments,
    });

    if (error) {
      throw new SendMailError(error.message);
    }
  }
}
