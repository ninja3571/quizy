"use client"

import Sidebarr from "@/components/sideBar";
import { useRouter } from "next/navigation";
import PocketBase from 'pocketbase';

export default function Home() {
  const pb = new PocketBase('http://172.16.15.146:8080');
  const router = useRouter()

  if (pb.authStore.model) {
      console.log(pb.authStore.model)
  }
  else {router.push("/login")}

  return (
    <div>

      <div className="absolute">
        <Sidebarr />
      </div>
    </div>

  );
}
