"use client"

import Sidebarr from "@/components/sideBar";
import { ModeToggle } from "@/components/toggleTheme";
import { WykresGradLin } from "@/components/wykresLin";
import { useRouter } from "next/navigation";
import PocketBase from 'pocketbase';
import { useEffect, useState } from "react";
import "@/app/style.css"
import { FastHistory } from "@/components/historyChang";

export default function Home() {
  const pb = new PocketBase('http://172.16.15.146:8080');
  // const pb = new PocketBase('http://192.168.60.25:8080');
  const router = useRouter()

  if (pb.authStore.model && pb.authStore.model != null) {
    console.log(pb.authStore.model)
  }
  else { router.push("/login") }

  const [loading, setLoading] = useState(false)
  const [dane, setDane] = useState([])
  const [kat, setKat] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const records = await pb.collection('sesions').getList(1, 5, { sort: '-created', expand: 'kategoriaID' });
        console.log(records)
        setDane(records)

        const recORds = await pb.collection('categories').getFullList();
        console.log(recORds)
        setKat(recORds)

        setLoading(true)
      }
      catch (err) {
        console.log(err)
      }
    }

    getData()
  }, [])

  return (
    <div>
      {loading ?
        <>
          <div className="absolute left-[50%] translate-x-[-50%]">
            <WykresGradLin className="h-1/2 w-full -z-10" dane={dane} catego={kat} />
          </div>
          <div className="absolute bottom-1 left-[25%] translate-x-[-50%]">
            <FastHistory danen={dane} />
          </div>
        </>
        : <div className='loader absolute top-[50%] left-[50%]'></div>}
      <div className="sticky top-0 w-[60px]">
        <Sidebarr />
      </div>
      <div className="absolute bottom-5 right-5">
        <ModeToggle />
      </div>
    </div>

  );
}
