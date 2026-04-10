import { Resend } from "resend";

import {
  IMailProvider,
  SendMailDTO,
} from "./interfaces/mail-provider.interface.js";

export class ResendMailProvider implements IMailProvider {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendMail({ body, subject, to }: SendMailDTO): Promise<void> {
    const { data: _data, error } = await this.resend.emails.send({
      from: "Conecta + <onboardin@resend.dev>",
      to: [to],
      subject,
      html: body,
    });

    if (error) {
      console.error("Error on send email", error);
      throw new Error(`Error on send email: ${error}`);
    }
  }
}
