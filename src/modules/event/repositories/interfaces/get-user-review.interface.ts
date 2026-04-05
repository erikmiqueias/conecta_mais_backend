export interface IGetUserReviewRepository {
  execute(eventId: string): Promise<boolean>;
}
