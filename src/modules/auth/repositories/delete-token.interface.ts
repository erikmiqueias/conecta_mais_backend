export interface IDeleteTokenRepository {
  execute(tokenId: string): Promise<boolean>;
}
