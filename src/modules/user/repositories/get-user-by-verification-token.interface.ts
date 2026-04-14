export interface IGetUserByVerificationTokenRepository {
  execute(
    token: string,
  ): Promise<{ id: string; verificationTokenExpiry: Date | null } | null>;
}
