import { RiStickyNoteAddFill } from "react-icons/ri";
import { PiQrCodeFill } from "react-icons/pi";
import { MdAccountCircle } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { RiPresentationFill } from "react-icons/ri";

export function SelectButton() {
  const navigate = useNavigate();
  return (
    <div className="flex gap-2 md:gap-5 outline-none border-none">
      <button
        className="bg-orange-200 p-2 rounded-xl"
        onClick={() => navigate("/list")}
      >
        <IoMdHome size={25} color="white" />
      </button>

      <button
        className="bg-blue-200 p-2 rounded-xl"
        onClick={() => navigate("/forms")}
      >
        <RiStickyNoteAddFill size={25} color="white" />
      </button>

      <button
        className="bg-yellow-300 p-2 rounded-xl"
        onClick={() => navigate("/qrcode")}
      >
        <PiQrCodeFill size={25} color="white" />
      </button>
      <button
        className="bg-purple-200 p-2 rounded-xl"
        onClick={() => navigate("/attendance/presentes")}
      >
        <RiPresentationFill size={25} color="white" />
      </button>

      <button
        className="bg-green-300 p-2 rounded-xl"
        onClick={() => navigate("/profile")}
      >
        <MdAccountCircle size={25} color="white" />
      </button>
    </div>
  );
}
