"use client"

import Sidebarr from "@/components/sideBar";
import { WykresGradLin } from "@/components/wykresLin";
import { useRouter } from "next/navigation";
import PocketBase from 'pocketbase';

export default function Home() {
  const pb = new PocketBase('http://172.16.15.146:8080');
  const router = useRouter()

  if (pb.authStore.model && pb.authStore.model != null) {
    console.log(pb.authStore.model)
  }
  else { router.push("/login") }

  return (
    <div>
      <WykresGradLin className="h-1/2 w-full -z-10" />
      <div className="sticky top-0 w-[60px]">
        <Sidebarr />
      </div>
    </div>

  );
}
