import { FC } from "react";

interface PenSizesProps {
  selectedSize: number;
  onSelect: (_size: number) => void;
}

const sizes = [2, 5, 10, 15, 30, 50, 100];
const PenSizes: FC<PenSizesProps> = ({ selectedSize, onSelect }) => {
  return (
    <div className='flex bg-white items-center p-3 m-2 rounded-full'>
      <p className='text-black  font-bold mr-2'>pen size</p>
      {sizes.map((size) => (
        <div
          key={size}
          onClick={() => onSelect(size)}
          style={{ outlineColor: selectedSize === size ? "black" : "gray" }}
          className='cursor-pointer text-black bg-zinc-100 border py-1 px-2 outline outline-2 mx-1 rounded-full'
        >
          {size}
        </div>
      ))}
    </div>
  );
};

export default PenSizes;
