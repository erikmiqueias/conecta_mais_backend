import { ResendMailProvider } from "@infra/providers/mail/resend-mail-provider.provider.js";
import { Worker } from "bullmq";

console.log("👷‍♂️ [Worker] Starting e-mail processor...");

const mailProvider = new ResendMailProvider();

export const emailWorker = new Worker(
  "SendEmailQueue",
  async (job) => {
    const { to, subject, body, attachments } = job.data;

    try {
      await mailProvider.sendMail({
        to,
        subject,
        body,
        attachments,
      });
    } catch (error) {
      console.error(`❌ [Worker] Error sending e-mail to ${to}:`, error);
      throw error;
    }
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);

emailWorker.on("failed", (job, err) => {
  console.log(`⚠️ Job ${job?.id} failed with error: ${err.message}`);
});
