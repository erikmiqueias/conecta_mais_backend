export interface IJwtProvider {
  sign(payload: object, secret: string, options?: object): Promise<string>;
}
