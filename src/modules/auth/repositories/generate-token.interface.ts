export interface IGenerateForgotPasswordTokenRepository {
  execute(userId: string, expiresAt: Date): Promise<{ code: string }>;
}
