export interface IOSMProvider {
  getCoordinatesFromAddress(
    address: string,
  ): Promise<{ latitude: number; longitude: number }>;
  getAddressFromCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<{ address: string }>;
}
