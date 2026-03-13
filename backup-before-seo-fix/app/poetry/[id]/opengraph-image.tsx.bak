import { ImageResponse } from "next/og";
import { getWorkById } from "@/data/works";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage({ params }: { params: { id: string } }) {
  const work = getWorkById(params.id);
  const title = work?.title || "Поэзия";
  const excerpt = work?.excerpt?.slice(0, 80) || "";

  return new ImageResponse(
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#0a0a1a,#1a0a2e)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:60, fontFamily:"serif" }}>
      <div style={{ fontSize:18, color:"#a855f7", marginBottom:20, letterSpacing:"0.2em" }}>НАТАЛЬЯ МЕЛЬХЕР</div>
      <div style={{ fontSize:56, fontWeight:800, color:"white", textAlign:"center", maxWidth:900, lineHeight:1.2 }}>{title}</div>
      {excerpt && <div style={{ fontSize:24, color:"rgba(255,255,255,0.5)", textAlign:"center", marginTop:24, maxWidth:700, fontStyle:"italic" }}>{excerpt}</div>}
      <div style={{ position:"absolute", bottom:40, fontSize:16, color:"rgba(255,255,255,0.3)" }}>natalia-melkher.vercel.app</div>
    </div>,
    { ...size }
  );
}
