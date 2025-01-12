import { QRCodeCanvas } from 'qrcode.react';

import { useUser } from "@/context/UserContext";

export const QrCode = ({
  invitationUrl,
} : {
  invitationUrl: string | undefined | null,
}) => {
  const { userInfo } = useUser();

  return (
    <div className="text-center">
      <div className="
        mb-4
        text-gray-500
        font-bold
      ">
        <span className="text-4xl lg:text-6xl">{userInfo?.coin}</span>
        <span className="lg:text-2xl">コイン</span>
      </div>
      <p>たまったコインをAmazonポイントに変えるには、最初にパパやママにQRコードを教えて、登録してもらってね！</p>
      <div className="my-4 flex justify-center">
        {invitationUrl && (
          <QRCodeCanvas
            value={invitationUrl}
            size={150}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        )}
      </div>
      <p>{invitationUrl}</p>
    </div>
  );
}
