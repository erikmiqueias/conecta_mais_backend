export interface IUpdatePasswordRepository {
  execute(userIdToken: string, newPassword: string): Promise<boolean>;
}
