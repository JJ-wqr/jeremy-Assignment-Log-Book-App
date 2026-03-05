"use client";
import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);
  useEffect(() => {
    fetch("/api/docs/swagger.json").then((r) => r.json()).then(setSpec);
  }, []);
  return (
    <div>
      <div style={{
        background:"linear-gradient(135deg,#1e293b,#0f172a)",
        padding:"20px 32px",display:"flex",alignItems:"center",gap:14
      }}>
        <span style={{fontSize:36}}>📚</span>
        <div>
          <h1 style={{margin:0,color:"#fff",fontSize:20,fontWeight:700}}>
            Jeremy — Assignment LogBook API
          </h1>
          <p style={{margin:0,color:"#94a3b8",fontSize:13}}>
            Interactive Swagger UI · v1.0.0 · Next.js 14
          </p>
        </div>
      </div>
      {spec
        ? <SwaggerUI spec={spec} docExpansion="list" defaultModelsExpandDepth={-1}/>
        : <p style={{padding:40,color:"#64748b"}}>Loading…</p>
      }
    </div>
  );
}