import { SelectButton } from "../molecules/selectButton";
import { Scanner } from "../organisms/qrCode";

export function ScannerQrCode() {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-[url('src/assets/images/pattern.png')] bg-cover bg-center">
      <div className="flex flex-grow items-center justify-center">
        <div className=" w-full md:w-1/4 bg-secondary p-5 rounded-2xl ">
          <Scanner />
        </div>
      </div>
      <footer className="w-full bg-secondary py-4 flex justify-center">
        <SelectButton />
      </footer>
    </div>
  );
}
