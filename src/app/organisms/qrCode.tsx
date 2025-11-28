import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { toast } from "sonner";

export function Scanner() {
  const [resultado, setResultado] = useState<string>("");
  const [scanning, setScanning] = useState(false);
  const [erroPermissao, setErroPermissao] = useState("");
  const API_URL = import.meta.env.API_URL;

  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const ultimoResultadoRef = useRef<string>("");

  const enviarSaida = async (qrCodeId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token não encontrado. Faça login novamente.");
      return;
    }

    // validação
    const qrCodeIdNum = Number(qrCodeId);
    if (isNaN(qrCodeIdNum) || qrCodeIdNum <= 0) {
      toast.error("QR Code inválido. Deve ser um número positivo.");
      return;
    }

    const payload = { qrCodeId: qrCodeIdNum };

    try {
      const res = await fetch(`${API_URL}/qrcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error) {
          if (typeof data.error === "string") {
            toast.error(data.error);
          } else if (data.error.qrCodeId) {
            toast.error(`Erro no QR Code: ${data.error.qrCodeId[0]}`);
          } else if (data.error.kidId) {
            toast.error(`Erro na criança: ${data.error.kidId[0]}`);
          } else {
            toast.error("Erro ao registrar saída");
          }
        } else {
          toast.error(`Erro ${res.status}: ${res.statusText}`);
        }
        return;
      }

      toast.success(`✅ ${data.message || "Saída registrada com sucesso!"}`);
      setResultado(qrCodeIdNum.toString());
    } catch (err) {
      toast.error("Erro ao conectar com o servidor");
    }
  };

  // scanner
  useEffect(() => {
    if (!html5QrcodeRef.current) {
      html5QrcodeRef.current = new Html5Qrcode("reader");
    }

    return () => {
      const scanner = html5QrcodeRef.current;
      if (scanner) {
        const state = scanner.getState();
        if (
          state === Html5QrcodeScannerState.SCANNING ||
          state === Html5QrcodeScannerState.PAUSED
        ) {
          scanner.stop().finally(() => scanner.clear());
        } else {
          scanner.clear();
        }
      }
    };
  }, []);

  const startScanner = async () => {
    const scanner = html5QrcodeRef.current;
    if (!scanner) return;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          // validação
          const id = Number(decodedText.trim());
          if (!isNaN(id) && id > 0) {
            if (decodedText !== ultimoResultadoRef.current) {
              ultimoResultadoRef.current = decodedText;
              enviarSaida(id);
            }
          } else {
            toast.error("QR Code inválido. Deve ser um número positivo.");
          }
        },
        (errorMessage) => {
          // Ignora erros de leitura normais
          if (!errorMessage.includes("No MultiFormat Readers")) {
            console.log("⚠️ Erro de leitura:", errorMessage);
          }
        }
      );

      //       await scanner.start(
      //   { facingMode: "environment" },
      //   { fps: 10, qrbox: 250 },
      //   async (decodedText) => {
      //     console.log("📷 QR Code lido:", decodedText);

      //     const id = Number(decodedText.trim());
      //     if (!isNaN(id) && id > 0) {
      //       if (decodedText !== ultimoResultadoRef.current) {
      //         ultimoResultadoRef.current = decodedText;
      //         await enviarSaida(id); // envia para a API
      //         await stopScanner(); // PARA o scanner automaticamente
      //       }
      //     } else {
      //       toast.error("QR Code inválido. Deve ser um número positivo.");
      //     }
      //   },
      //   (errorMessage) => {
      //     if (!errorMessage.includes("No MultiFormat Readers")) {
      //       console.log("⚠️ Erro de leitura:", errorMessage);
      //     }
      //   }
      // );

      setScanning(true);
      setErroPermissao("");
    } catch (err) {
      setErroPermissao(
        "Erro ao iniciar scanner. Verifique permissão de câmera."
      );
    }
  };

  const stopScanner = async () => {
    const scanner = html5QrcodeRef.current;
    if (!scanner) return;

    try {
      const state = scanner.getState();
      if (
        state === Html5QrcodeScannerState.SCANNING ||
        state === Html5QrcodeScannerState.PAUSED
      ) {
        await scanner.stop();
        setScanning(false);
        setResultado("");
        ultimoResultadoRef.current = "";
      }
    } catch (err) {}
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div id="reader" className="w-3xs mb-4 rounded-2xl" />
      <p>
        <strong>Código da pulseira:</strong> {resultado || "-"}
      </p>

      {!scanning ? (
        <button
          onClick={startScanner}
          disabled={!!erroPermissao}
          className="px-4 py-2 bg-blue-500 text-white bg-chart-5 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Iniciar Scanner
        </button>
      ) : (
        <button
          onClick={stopScanner}
          className="px-4 py-2 bg-red-500 text-white bg-chart-1 rounded hover:bg-red-600"
        >
          Parar Scanner
        </button>
      )}

      {erroPermissao && <p className="text-red-500">{erroPermissao}</p>}
    </div>
  );
}
