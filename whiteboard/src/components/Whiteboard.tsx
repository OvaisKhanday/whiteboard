import Konva from "konva";
import { Stage as StageType } from "konva/lib/Stage";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Image, Layer, Line, Rect, Stage } from "react-konva";
import { throttle } from "throttle-typescript";
import { socket } from "../socket";
// import { type Stage as StageType } from "konva/lib/Stage";

interface WhiteboardProps {
  // socket: Socket;
  color: string;
  penSize: number;
}
function base64ToImage(base64String: string) {
  return new Promise((resolve, reject) => {
    const img: HTMLImageElement = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = base64String;
  });
}

interface UserMouse {
  name: string;
  id: string;
  pos: {
    x: number;
    y: number;
  };
}
interface RawMousePos {
  mouse: {
    x: number;
    y: number;
  };
  user: { name: string; id: string };
  size: {
    width: number;
    height: number;
  };
}

const Whiteboard: FC<WhiteboardProps> = ({ color, penSize }) => {
  const isDrawing = useRef<boolean>(false);
  const [history, setHistory] = useState<HTMLImageElement[]>([]);
  const [users, setUsers] = useState<UserMouse[]>([]);
  const [redoHistory, setRedoHistory] = useState<HTMLImageElement[]>([]);
  const [canvasWidth, setCanvasWidth] = useState(Math.min(1200, window.innerWidth * 0.8));
  const stageRef = useRef<StageType | null>(null);
  const [lastCanvasImage, setLastCanvasImage] = useState<HTMLImageElement | null>(null);
  const [line, setLine] = useState<number[]>([]);

  useEffect(() => {
    socket.on("connect", () => console.log("socket connected"));
    socket.on("disconnect", () => console.log("socket disconnected"));

    socket.on("receive_last_canvas", (imageData: string) => {
      base64ToImage(imageData).then((img) => {
        setLastCanvasImage(img as HTMLImageElement);
        setHistory((prev) => [...prev, img as HTMLImageElement]);
        setRedoHistory([]);
      });
    });

    return () => {
      socket.off("receive_last_canvas");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("receive_mouse_move", (data: RawMousePos) => {
      const width = stageRef.current?.bufferCanvas.width ?? 0;
      const height = stageRef.current?.bufferCanvas.height ?? 0;
      console.log(data);
      console.log(users);
      console.log(users.find((_user) => _user.id === data.user.id));
      if (users.find((_user) => _user.id === data.user.id)) {
        console.log("match");
        const newUsers = users.map((_user) => {
          if (_user.id === data.user.id) {
            const newUserConfig: UserMouse = {
              id: _user.id,
              name: _user.name,
              pos: {
                x: ((data.mouse.x - 70) / data.size.width) * width,
                y: ((data.mouse.y - 160) / data.size.height) * height,
              },
            };
            return newUserConfig;
          } else return _user;
        });
        setUsers(newUsers);
      } else {
        /// add this mouse as well
        const newUserConfig: UserMouse = {
          id: data.user.id,
          name: data.user.name,
          pos: {
            x: ((data.mouse.x - 70) / data.size.width) * width,
            y: ((data.mouse.y - 160) / data.size.height) * height,
          },
        };
        setUsers((prev) => [...prev, newUserConfig]);
      }
    });
    return () => {
      socket.off("receive_mouse_move");
    };
  }, [users]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "z" && event.ctrlKey) {
        console.log("inside undo");
        console.log(history);
        //undo
        if (history.length > 0) {
          const length = history.length;
          const lastImage = history[length - 1];
          setLastCanvasImage(lastImage);
          setRedoHistory((prev) => [...prev, lastImage]);
          setHistory((prev) => prev.slice(0, length - 1));
          socket.emit("last_canvas", {
            roomId: localStorage.getItem("roomId"),
            payload: lastImage.src,
          });
        }
      } else if (event.key === "y" && event.ctrlKey) {
        // redo
        console.log("inside redo");
        console.log(redoHistory);
        if (redoHistory.length > 0) {
          const length = redoHistory.length;
          const lastRedo = redoHistory[length - 1];
          setLastCanvasImage(lastRedo);
          setHistory((prev) => [...prev, lastRedo]);
          setRedoHistory((prev) => prev.slice(0, length - 1));
          socket.emit("last_canvas", {
            roomId: localStorage.getItem("roomId"),
            payload: lastRedo.src,
          });
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [history, redoHistory]);

  useLayoutEffect(() => {
    function handleResize() {
      setCanvasWidth(Math.min(1200, window.innerWidth * 0.8));
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    function handleMouseMove(e: Event) {
      socket.emit("mouse_move", {
        roomId: localStorage.getItem("roomId"),
        payload: {
          mouse: {
            x: (e as MouseEvent).x,
            y: (e as MouseEvent).y,
          },
          user: { name: localStorage.getItem("userName"), id: localStorage.getItem("userId") },
          size: {
            width: stageRef.current?.bufferCanvas.width,
            height: stageRef.current?.bufferCanvas.height,
          },
        },
      });
    }
    const stage = stageRef.current;
    stage?.addEventListener("mousemove", throttle(handleMouseMove, 50));
    return () => {
      stage?.removeEventListener("mousemove");
    };
  }, []);

  const handleMouseDown = (e: Konva.KonvaEventObject<globalThis.MouseEvent>) => {
    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    setLine([pos!.x, pos!.y]);
  };
  const handleMouseMove = (e: Konva.KonvaEventObject<globalThis.MouseEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    // add point
    setLine([...line, point!.x, point!.y]);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMouseUp = (_e: Konva.KonvaEventObject<globalThis.MouseEvent>) => {
    isDrawing.current = false;
    // socket.emit("new_line", lines[lines.length - 1]);
    // socket.emit("lines", line);
    // console.log(stageRef.current.toDataURL());
    const imageBase64 = stageRef.current?.toDataURL({ pixelRatio: 3 });
    socket.emit("last_canvas", {
      roomId: localStorage.getItem("roomId"),
      payload: imageBase64,
    });

    base64ToImage(imageBase64 ?? "").then((img) => {
      setRedoHistory([]);
      setHistory((prev) => [...prev, img as HTMLImageElement]);
      setLastCanvasImage(img as HTMLImageElement);
      setLine([]);
    });
  };

  function downloadURI() {
    const uri = stageRef.current?.toDataURL({
      pixelRatio: 5,
    });
    if (!uri) return;
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      <div className='relative'>
        <div className=' pointer-events-none z-[99999] text-black absolute'>
          {users.map((user) => (
            <div key={user.id} className='absolute' style={{ top: user.pos.y, left: user.pos.x }}>
              <div className=' h-4 w-4 bg-red-500 rounded-full' />
              <p className='-mt-2'>{user.name}</p>
            </div>
          ))}
        </div>
        <Stage
          style={{ backgroundColor: "white" }}
          ref={stageRef}
          width={canvasWidth}
          height={canvasWidth / 2}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            <Rect fill='white' height={canvasWidth / 2} width={canvasWidth} />
            <Image x={0} y={0} height={canvasWidth / 2} width={canvasWidth} image={lastCanvasImage!} stroke={"red"} />
          </Layer>
          <Layer>
            <Line points={line} stroke={color} strokeWidth={penSize} />
          </Layer>
        </Stage>
      </div>
      <div className='mt-4'>
        <button className='bg-blue-700' onClick={downloadURI}>
          save as image
        </button>
      </div>
    </div>
  );
};

export default Whiteboard;
