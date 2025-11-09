import React, { useEffect, useMemo, useRef, useState } from "react";
export type VideoMode = "mjpeg" | "ws";
type Status = "idle" | "loading" | "playing" | "no-signal" | "error";

export interface VideoStreamProps {
  src: string;
  mode: VideoMode;
  noSignalTimeoutMs?: number;
  reconnectBaseDelayMs?: number;
  reconnectMaxDelayMs?: number;
  className?: string;
  style?: React.CSSProperties;
  onStatusChange?: (s: Status) => void;
  ariaLabel?: string;
}

const containerStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  aspectRatio: "16/9",
  background: "#000",
  borderRadius: "12px",
  overflow: "hidden",
  userSelect: "none",
};

const overlayStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  textAlign: "center",
  padding: "10px",
  background: "rgba(0,0,0,0.35)",
  fontSize: 14,
};

const badgeStyle: React.CSSProperties = {
  position: "absolute",
  top: 8,
  left: 8,
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
  padding: "4px 8px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
};

const btnStyle: React.CSSProperties = {
  position: "absolute",
  bottom: 8,
  right: 8,
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
  padding: "4px 8px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
};


export default function VideoStream({
  src,
  mode,
  noSignalTimeoutMs = 5000,
  reconnectBaseDelayMs = 1000,
  reconnectMaxDelayMs = 10000,
  className,
  style,
  onStatusChange,
  ariaLabel,
}: VideoStreamProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [manualPaused, setManualPaused] = useState(false);


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const noSignalTimerRef = useRef<number | null>(null);


  const badgeText = useMemo(() => {
    switch (status) {
      case "idle":
        return "Idle";
      case "loading":
        return "Connecting…";
      case "playing":
        return "Live";
      case "no-signal":
        return "No signal";
      case "error":
        return "Error";
      default:
        return "Idle";
    }
  }, [status]);


  const setStatusSafe = (s: Status) => {
    setStatus(s);
    onStatusChange?.(s);
  };


  useEffect(() => {
    if (status === "playing") return;
    if (noSignalTimerRef.current) window.clearTimeout(noSignalTimerRef.current);
    noSignalTimerRef.current = window.setTimeout(() => {
      setStatusSafe("no-signal");
    }, noSignalTimeoutMs) as unknown as number;
    return () => {
      if (noSignalTimerRef.current) window.clearTimeout(noSignalTimerRef.current);
    };
  }, [status, noSignalTimeoutMs]);


  useEffect(() => {
    if (mode !== "mjpeg") return;
    if (!src) return;
    if (manualPaused) return;


    setErrorMsg(null);
    setStatusSafe("loading");


    const img = imgRef.current;
    if (!img) return;


    const bust = Date.now();
    const finalSrc = src.includes("?") ? `${src}&_=${bust}` : `${src}?_=${bust}`;


    const onLoad = () => {
      setStatusSafe("playing");
    };


    const onError = () => {
      setErrorMsg("Stream error");
      setStatusSafe("error");
    };


    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);
    img.src = finalSrc;


    return () => {
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
      img.src = "";
    };
  }, [mode, src, manualPaused]);


  useEffect(() => {
    if (mode !== "ws") return;
    if (!src) return;
    if (manualPaused) return;


    let closed = false;
    let retryTimer: number | null = null;
    let localRetry = retryCount;
    let ws: WebSocket | null = null;


    const drawFrame = (dataUrl: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const im = new Image();
      im.onload = () => {
        canvas.width = im.width;
        canvas.height = im.height;
        ctx.drawImage(im, 0, 0, canvas.width, canvas.height);
      };
      im.src = dataUrl;
    };


    const scheduleRetry = () => {
      if (retryTimer) window.clearTimeout(retryTimer);
      localRetry += 1;
      const delay = Math.min(reconnectMaxDelayMs, reconnectBaseDelayMs * Math.pow(2, localRetry - 1));
      setRetryCount(localRetry);
      retryTimer = window.setTimeout(connect, delay) as unknown as number;
    };


    const connect = () => {
      setStatusSafe("loading");
      setErrorMsg(null);
      try {
        ws = new WebSocket(src);
        wsRef.current = ws;
      } catch (err: any) {
        setStatusSafe("error");
        setErrorMsg(err?.message ?? "Failed to open WebSocket");
        scheduleRetry();
        return;
      }
      if (!ws) return;
      ws.onopen = () => {
        localRetry = 0;
      };
      ws.onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          if (payload && payload.type === "frame" && typeof payload.data === "string") {
            drawFrame(payload.data);
            setStatusSafe("playing");
            return;
          }
        } catch {}
        if (typeof ev.data === "string" && ev.data.startsWith("data:image")) {
          drawFrame(ev.data);
          setStatusSafe("playing");
        }
      };
      ws.onerror = () => {
        setStatusSafe("error");
        setErrorMsg("WebSocket error");
      };
      ws.onclose = () => {
        if (closed) return;
        scheduleRetry();
      };
    };


    connect();


    return () => {
      closed = true;
      if (retryTimer) window.clearTimeout(retryTimer);
      if (ws && ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [mode, src, manualPaused, reconnectBaseDelayMs, reconnectMaxDelayMs, retryCount]);


  const handleTogglePause = () => {
    setManualPaused((p) => !p);
    if (mode === "ws") {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) ws.close();
    } else if (mode === "mjpeg") {
      const img = imgRef.current;
      if (img) img.src = "";
    }
    setStatusSafe("idle");
  };


  return (
    <div
      className={className}
      style={{ ...containerStyle, ...style }}
      aria-label={ariaLabel ?? "Live video stream player"}
      role="region"
    >
      {mode === "mjpeg" ? (
        <img ref={imgRef} alt="Live video" draggable={false} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      ) : (
        <canvas ref={canvasRef} aria-label="Live canvas" style={{ width: "100%", height: "100%" }} />
      )}


      <div style={badgeStyle} aria-live="polite" aria-atomic>
        {badgeText}
      </div>


      <button type="button" style={btnStyle} onClick={handleTogglePause}>
        {manualPaused ? "Resume" : "Pause"}
      </button>


      {status !== "playing" && (
        <div style={overlayStyle}>
          <div style={{ maxWidth: 560, padding: 8 }}>
            <p style={{ fontWeight: 600, margin: 0 }}>
              {status === "error" ? "Stream error" : status === "no-signal" ? "No video received" : status === "loading" ? "Connecting to camera…" : "Waiting for stream…"}
            </p>
            {errorMsg && (
              <p role="alert" style={{ fontSize: 12, marginTop: 6, color: "#ffcccc" }}>
                {errorMsg}
              </p>
            )}
            <p style={{ fontSize: 12, marginTop: 6, color: "#ddd", wordBreak: "break-all" }}>
              Ensure your backend is reachable at: {src}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


