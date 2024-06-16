// import Konva from "konva";
// import { LineCap, LineJoin } from "konva/lib/Shape";
// import { LineConfig } from "konva/lib/shapes/Line";
// import { FC, useEffect, useRef, useState } from "react";
// import { KonvaNodeComponent, Line, Layer, Stage, Text } from "react-konva";
// import { Socket } from "socket.io-client";

// interface WhiteboardProps {
//   socket: Socket;
// }

// const Whiteboard: FC<WhiteboardProps> = ({ socket }) => {
//   const [tool, setTool] = useState("pen");

//   //   const [history, setHistory] = useState<LineProps[]>([]);
//   const [lines, setLines] = useState<{ tool: string; points: number[] }[]>([]);
//   const isDrawing = useRef(false);

//   useEffect(() => {
//     socket.on("new_line_resp", (resp) => {
//       setLines((prev) => [...prev, { tool, points: [resp.line] }]);
//       console.log(resp);
//       console.log(lines);
//     });
//   }, [socket]);
//   const handleMouseDown = (e: Konva.KonvaEventObject<globalThis.MouseEvent>) => {
//     isDrawing.current = true;
//     const pos = e.target.getStage()?.getPointerPosition();
//     setLines([...lines, { tool, points: [pos!.x, pos!.y] }]);
//     // console.log(lines);
//   };

//   const handleMouseMove = (e: Konva.KonvaEventObject<globalThis.MouseEvent>) => {
//     // no drawing - skipping
//     if (!isDrawing.current) {
//       return;
//     }
//     const stage = e.target.getStage();
//     const point = stage?.getPointerPosition();
//     const lastLine = lines[lines.length - 1];
//     // add point
//     lastLine.points = lastLine.points.concat([point!.x, point!.y]);

//     // replace last
//     lines.splice(lines.length - 1, 1, lastLine);
//     setLines(lines.concat());
//   };

//   interface LineProps extends KonvaNodeComponent<Line<LineConfig>, LineConfig> {
//     points: number[];
//     stroke: string | CanvasGradient;
//     strokeWidth: number;
//     lineCap: LineCap;
//     lineJoin: LineJoin;
//     globalCompositeOperation: "destination-out" | "source-over";
//   }

//   const handleMouseUp = (e: Konva.KonvaEventObject<globalThis.MouseEvent>) => {
//     // console.log(e.currentTarget.pointerClickEndShape.attrs.points);
//     // const lineAttrs = e.currentTarget.pointerClickEndShape;
//     // const line: LineProps = {
//     //   points: lineAttrs.points,
//     //   stroke: lineAttrs.stroke,
//     //   strokeWidth: lineAttrs.strokeWidth,
//     //   lineCap: lineAttrs.lineCap,
//     //   lineJoin: lineAttrs.lineJoin,
//     //   globalCompositeOperation: lineAttrs.globalCompositionOperation,
//     // };
//     // setHistory((prev) => [...prev, line]);
//     console.log("line", e.currentTarget.pointerClickEndShape.attrs.points);
//     isDrawing.current = false;
//     socket.emit("new_line", {
//       line: e.currentTarget.pointerClickEndShape.attrs.points,
//       // name: localStorage.getItem('userName'),
//       id: `${socket.id}${Math.random()}`,
//       socketID: socket.id,
//     });
//   };

//   //   console.log(history);
//   return (
//     <div style={{ backgroundColor: "white" }}>
//       <button onClick={() => {}}>send</button>
//       <Stage
//         width={window.innerWidth}
//         height={window.innerHeight}
//         onMouseDown={handleMouseDown}
//         onMousemove={handleMouseMove}
//         onMouseup={handleMouseUp}
//       >
//         <Layer>
//           <Text text='Just start drawing' x={5} y={30} />
//           {lines.map((line, i) => (
//             <Line
//               key={i}
//               points={line.points}
//               stroke='#158fad'
//               strokeWidth={5}
//               tension={0.5}
//               lineCap='round'
//               lineJoin='round'
//               globalCompositeOperation={"source-over"}
//             />
//           ))}
//         </Layer>
//       </Stage>
//       <select
//         value={tool}
//         onChange={(e) => {
//           setTool(e.target.value);
//         }}
//       >
//         <option value='pen'>Pen</option>
//         <option value='eraser'>Eraser</option>
//       </select>
//     </div>
//   );
// };

// export default Whiteboard;
