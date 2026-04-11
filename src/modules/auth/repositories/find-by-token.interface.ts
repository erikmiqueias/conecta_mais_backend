import { Token } from "@generated/prisma/client.js";

export interface IFindByTokenRepository {
  execute(token: string): Promise<Token | null>;
}
