import { FC, useState } from "react";
import Whiteboard from "./Whiteboard";
import ColorPalette from "./ColorPalette";
import PenSizes from "./PenSizes";

interface WhiteboardScreenProps {}

const WhiteboardScreen: FC<WhiteboardScreenProps> = () => {
  const [selectedColor, setSelectedColor] = useState<string>("black");
  const [selectedPenSize, setSelectedPenSize] = useState<number>(2);
  function onColorChange(col: string) {
    setSelectedColor(col);
    return null;
  }
  function onPenSizeChange(size: number) {
    setSelectedPenSize(size);
    return null;
  }
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col lg:flex-row justify-center items-center'>
        <ColorPalette selected={selectedColor} onSelect={onColorChange} />
        <PenSizes selectedSize={selectedPenSize} onSelect={onPenSizeChange} />
      </div>
      <Whiteboard color={selectedColor} penSize={selectedPenSize} />

      <div className='mt-10'>
        session id: <span className='font-bold '>{localStorage.getItem("roomId")}</span>
        <span
          className='bg-blue-700 rounded-lg p-2 ml-4 cursor-pointer'
          title='copy'
          onClick={() => {
            navigator.clipboard.writeText(localStorage.getItem("roomId") ?? "");
          }}
        >
          📄
        </span>
        <p>Share the id for other collaborators to let them join.</p>
      </div>
    </div>
  );
};

export default WhiteboardScreen;
