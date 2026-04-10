export interface EnqueueMailProvider {
  to: string;
  subject: string;
  body: string;
}

export interface IMailQueueProvider {
  addJob(data: EnqueueMailProvider): Promise<void>;
}
