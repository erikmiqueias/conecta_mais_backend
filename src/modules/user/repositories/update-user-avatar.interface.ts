export interface IUpdateUserAvatarRepository {
  execute(userId: string, avatarUrl: string): Promise<void>;
}
