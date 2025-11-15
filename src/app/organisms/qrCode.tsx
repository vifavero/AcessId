import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

export function MyQrScanner() {
  const [data, setData] = useState("Nenhum dado escaneado ainda");

  return (
    <div>
      <h2>Leitor de QR Code</h2>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.getText);
          }
          if (!!error) {
            console.error(error);
          }
        }}
        constraints={{ facingMode: "environment" }}
      />
      <p>Resultado: {data}</p>
    </div>
  );
}

export default MyQrScanner;
