export interface EnqueueMailProvider {
  to: string;
  subject: string;
  body: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    enconding?: string;
  }>;
}

export interface IMailQueueProvider {
  addJob(data: EnqueueMailProvider): Promise<void>;
}
