export interface IGetUserReviewRepository {
  execute(eventId: string, userId: string): Promise<boolean>;
}
