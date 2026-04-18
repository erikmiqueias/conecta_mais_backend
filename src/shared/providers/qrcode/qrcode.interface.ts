export interface IQRCodeProvider {
  generateBase64(data: string): Promise<string>;
}
