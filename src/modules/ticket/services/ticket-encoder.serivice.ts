import { TicketQRCodeError } from "@shared/errors/errors.js";
import { IJwtProvider } from "@shared/providers/jwt/jwt.interface.js";
import { IQRCodeProvider } from "@shared/providers/qrcode/qrcode.interface.js";

export class TicketEncoderService {
  constructor(
    private readonly jwtProvider: IJwtProvider,
    private readonly qrcodeProvider: IQRCodeProvider,
  ) {}
  async execute(ticketId: string, ticketCode: string, eventId: string) {
    const payload = {
      sub: ticketId,
      ticketCode,
      eventId,
      type: "ENTRY_TICKET",
    };

    const TICKET_QR_CODE_SECRET = process.env.TICKET_QR_CODE_SECRET;

    if (!TICKET_QR_CODE_SECRET) {
      throw new TicketQRCodeError("TICKET_QR_CODE_SECRET is not defined");
    }

    const signedTicketQrCode = await this.jwtProvider.sign(
      payload,
      TICKET_QR_CODE_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const qrCodeBase64 =
      await this.qrcodeProvider.generateBase64(signedTicketQrCode);

    return {
      ticketId,
      qrCode: qrCodeBase64,
      ticketCode,
    };
  }
}
