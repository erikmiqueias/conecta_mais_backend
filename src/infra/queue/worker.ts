import { ResendMailProvider } from "@shared/providers/resend-mail-provider.provider.js";
import { Worker } from "bullmq";

console.log("👷‍♂️ [Worker] Iniciando o processador de e-mails...");

const mailProvider = new ResendMailProvider();

export const emailWorker = new Worker(
  "SendEmailQueue",
  async (job) => {
    const { to, subject, body } = job.data;

    console.log(`⏳ [Worker] Processando envio para: ${to}...`);

    try {
      await mailProvider.sendMail({
        to,
        subject,
        body,
      });

      console.log(`✅ [Worker] E-mail enviado com sucesso para: ${to}`);
    } catch (error) {
      console.error(`❌ [Worker] Falha ao enviar e-mail para ${to}:`, error);
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
  console.log(
    `⚠️ Job ${job?.id} falhou e voltará para a fila. Motivo: ${err.message}`,
  );
});
