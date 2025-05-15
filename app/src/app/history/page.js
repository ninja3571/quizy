'use client'

import { ExpandableCardDemo } from "@/components/historyView_acern";
import Sidebarr from "@/components/sideBar";
import { ModeToggle } from "@/components/toggleTheme";
import { useRouter } from "next/navigation";
import PocketBase from 'pocketbase';

export default function Home() {
  // const pb = new PocketBase('http://172.16.15.146:8080');
  const pb = new PocketBase('http://192.168.60.25:8080');
  const router = useRouter()

  if (pb.authStore.model) {
    console.log(pb.authStore.model)
  }
  else { router.push("/login") }

  return (
    <div className="flex flex-row overflow-hidden">
      <div className="sticky top-0 w-[60px]">
        <Sidebarr />
      </div>
      <div className="w-full h-screen">
        <ExpandableCardDemo />

        <div className="absolute bottom-5 right-5">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
