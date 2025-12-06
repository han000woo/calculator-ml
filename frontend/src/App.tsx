import { useRef } from "react";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const sendToServer = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");

    const res = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: dataURL }),
    });

    const json = await res.json();
    alert("예측된 숫자: " + json.prediction);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1>손글씨 숫자 인식 테스트</h1>

      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        style={{ border: "1px solid black" }}
        onMouseDown={(e) => {
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext("2d");
          if (!ctx || !canvas) return;

          ctx.lineWidth = 20;
          ctx.lineCap = "round";
          let drawing = true;

          const draw = (ev: MouseEvent) => {
            if (!drawing) return;
            const rect = canvas.getBoundingClientRect();
            ctx.lineTo(ev.clientX - rect.left, ev.clientY - rect.top);
            ctx.stroke();
          };

          const stop = () => {
            drawing = false;
            window.removeEventListener("mousemove", draw);
            window.removeEventListener("mouseup", stop);
            ctx.beginPath();
          };

          window.addEventListener("mousemove", draw);
          window.addEventListener("mouseup", stop);
        }}
      ></canvas>

      <div style={{ marginTop: 20 }}>
        <button onClick={sendToServer}>예측하기</button>
        <button onClick={clearCanvas} style={{ marginLeft: 10 }}>
          지우기
        </button>
      </div>
    </div>
  );
}

export default App;
