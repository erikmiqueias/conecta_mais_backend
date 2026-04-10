export interface SendMailDTO {
  to: string;
  subject: string;
  body: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    enconding?: string;
  }>;
}

export interface IMailProvider {
  sendMail(data: SendMailDTO): Promise<void>;
}
