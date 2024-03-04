"use client";
import Login from "@/PageComponents/Login";
import { useRouter } from "next/navigation";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/tailwind-light/theme.css";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      alert("Please signed in to continue");
      signIn();
    },
  });

  const router = useRouter();

  useEffect(() => {
    router.push("datatable");
  }, []);

  return <main>{/* <Login/> */}</main>;
}
