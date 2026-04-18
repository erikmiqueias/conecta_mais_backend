import { IQRCodeProvider } from "@shared/providers/qrcode/qrcode.interface.js";
import QRCode from "qrcode";

export class QrCodeProvider implements IQRCodeProvider {
  async generateBase64(data: string): Promise<string> {
    return QRCode.toDataURL(data, {
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 300,
      margin: 2,
      errorCorrectionLevel: "H",
    });
  }
}
