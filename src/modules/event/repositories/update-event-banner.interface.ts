export interface IUpdateEventBannerRepository {
  execute(eventId: string, bannerUrl: string): Promise<void>;
}
