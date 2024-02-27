"use client"
import Demo from "@/PageComponents/Demo";
import Login from "@/PageComponents/Login";
import { useRouter } from "next/navigation";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/tailwind-light/theme.css";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();

  useEffect(()=>{
    router.push('datatable')
  },[])

  return (
    <main >
      {/* <Login/> */}
      <Demo/>
    </main>
  );
}
