export interface IDeleteUserRepository {
  execute(userId: string): Promise<boolean>;
}
