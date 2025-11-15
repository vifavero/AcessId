import { Button } from "@/components/ui/button";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { PiQrCodeFill } from "react-icons/pi";
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export function SelectButton() {
  const navigate = useNavigate();
  return (
    <footer>
      <div className="flex gap-5 items-center justify-center outline-none border-none">
        <button className="bg-orange-200" onClick={() => navigate("/forms")}>
          <RiStickyNoteAddFill
            size={25}
            color="white"
            className="shadow-lg shadow-orange-100"
          />
        </button>
        <button className="bg-yellow-300" onClick={() => navigate("")}>
          <PiQrCodeFill
            size={25}
            color="white"
            className="shadow-lg shadow-yellow-200"
          />
        </button>
        <button className="bg-green-300" onClick={() => navigate("")}>
          <MdAccountCircle
            size={25}
            color="white"
            className="shadow-lg shadow-green-200"
          />
        </button>
      </div>
    </footer>
  );
}
