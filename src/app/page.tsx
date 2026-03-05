import Link from "next/link";
export default function Home() {
  return (
    <main style={{
      minHeight:"100vh",background:"linear-gradient(135deg,#0f172a,#1e1b4b)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:"40px 20px",fontFamily:"system-ui,sans-serif",color:"#e2e8f0"
    }}>
      <div style={{ fontSize:64, marginBottom:16 }}>📚</div>
      <h1 style={{
        fontSize:40,fontWeight:800,margin:"0 0 12px",
        background:"linear-gradient(135deg,#a5b4fc,#c4b5fd)",
        WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
      }}>Assignment LogBook API</h1>
      <p style={{ color:"#94a3b8",fontSize:16,marginBottom:32,textAlign:"center" }}>
        YourName · Next.js 14 · TypeScript · Swagger UI
      </p>
      <Link href="/api-docs" style={{
        background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",
        padding:"14px 36px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16
      }}>
        📖 Open Swagger Docs
      </Link>
    </main>
  );
}