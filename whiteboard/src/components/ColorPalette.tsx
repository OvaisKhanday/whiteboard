import { FC } from "react";

interface ColorPaletteProps {
  selected: string;
  onSelect: (_col: string) => null;
}

const colors = ["red", "blue", "black", "purple", "green", "white", "gray", "cyan", "magenta", "orange", "yellow"];
const ColorPalette: FC<ColorPaletteProps> = ({ selected, onSelect }) => {
  return (
    <div className='flex bg-slate-200 p-3 rounded-full m-2 items-center'>
      {/* <p className='text-black  font-bold mr-2'>color</p> */}

      {colors.map((col) => (
        <div
          key={col}
          onClick={() => onSelect(col)}
          className='mx-1 w-6 h-6 p-1 rounded-full border outline-2 outline outline-black'
          style={{ backgroundColor: col, outlineColor: selected === col ? "black" : "gray" }}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
