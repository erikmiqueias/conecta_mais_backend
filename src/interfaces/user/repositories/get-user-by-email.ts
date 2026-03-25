export interface IGetUserByEmailRepository {
  execute(email: string): Promise<unknown>;
}
