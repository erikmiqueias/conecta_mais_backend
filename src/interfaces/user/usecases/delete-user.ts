export interface IDeleteUserUseCase {
  execute(userId: string): Promise<boolean>;
}
