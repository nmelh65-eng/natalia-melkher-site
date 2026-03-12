import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Наталья Мельхер — Поэзия и Вдохновение";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%)", fontFamily:"serif" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:120, height:120, borderRadius:30, background:"linear-gradient(135deg, #a855f7, #f59e0b)", marginBottom:40, color:"white", fontSize:48, fontWeight:700 }}>НМ</div>
        <div style={{ fontSize:72, fontWeight:700, background:"linear-gradient(135deg, #c084fc, #fbbf24)", backgroundClip:"text", color:"transparent", marginBottom:20 }}>Наталья Мельхер</div>
        <div style={{ fontSize:28, color:"#9ca3af", fontStyle:"italic" }}>Поэзия · Проза · Вдохновение</div>
      </div>
    ),
    { ...size }
  );
}
