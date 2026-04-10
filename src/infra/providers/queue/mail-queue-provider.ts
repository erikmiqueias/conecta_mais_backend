import {
  EnqueueMailProvider,
  IMailQueueProvider,
} from "@shared/providers/queue/mail-queue-provider.interface.js";
import { Queue } from "bullmq";

export class BullMQMailQueueProvider implements IMailQueueProvider {
  private emailQueue: Queue;
  constructor() {
    this.emailQueue = new Queue("SendEmailQueue", {
      connection: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT!,
      },
    });
  }

  async addJob(data: EnqueueMailProvider): Promise<void> {
    await this.emailQueue.add("send-confirmation-email", data, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    });
    console.log(`📦 [Queue] E-mail to ${data.to} has been added to the queue!`);
  }
}
