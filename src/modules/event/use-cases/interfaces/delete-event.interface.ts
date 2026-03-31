export interface IDeleteEventUseCase {
  execute(organizerId: string): Promise<boolean>;
}
