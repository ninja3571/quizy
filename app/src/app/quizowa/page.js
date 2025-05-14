'use client'

import { useEffect, useState } from "react"
import PocketBase from 'pocketbase';
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from "@/components/ui/button";

export default function Home() {

    const pb = new PocketBase('http://172.16.15.146:8080');
    const router = useRouter()

    if (pb.authStore.model) {
        console.log(pb.authStore.model)
    }
    else { router.push("/login") }

    const [pyt, setPyt] = useState(null)
    const [nrPyt, setNrPyt] = useState(0)
    const [temat, setTemat] = useState(null)
    const [categories, setCategories] = useState(null)
    const [sesja, setSesja] = useState(null)
    const [idKat, setIdKat] = useState(null) 
    const [wybr, setWybr] = useState(null)
    const [popr, setPopr] = useState(null)


    useEffect(() => {
        const getData = async () => {
            try {
                const records = await pb.collection('categories').getFullList();
                console.log(records)
                setCategories(records)
            }
            catch (err) {
                console.log(err)
                setChange(err)
            }
        }
        getData()
    }, [])

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetch(`http://172.16.15.146:5678/webhook/quiz`, {headers:{"topic":temat}})
                const json = await data.json()
                console.log(json)
                setPyt(json)

                json.output.answers.map((item)=>(
                    item.isCorrect==true ? setPopr(item.text) : null
                ))
            }
            catch (err) {
                console.log(err)
                setChange(err)
            }
        }
        // setTimeout(() => {
            getData()
        // }, 200);
    }, [nrPyt])

    const next = async()=>{
        const data = {
            "pytanie": `${pyt.output.question}`,
            "odp1": `${pyt.output.answers[0].text}`,
            "odp2": `${pyt.output.answers[1].text}`,
            "odp3": `${pyt.output.answers[2].text}`,
            "odp4": `${pyt.output.answers[3].text}`,
            "odpPopr": `${await popr}`,
            "odpWybr": `${pyt.output.answers[wybr].text}`,
            "numerSesji": sesja,
            "nrPytania": nrPyt
        };

        const record = await pb.collection('questions').create(data);
        console.log(record)

        setNrPyt(nrPyt+1)
    }

    const sesion = async()=>{
        setPyt(null)
        const data = {
            "userID": pb.authStore.model.id,
            "kategoriaID": idKat
        };
        
        const record = await pb.collection('sesions').create(data);
        setSesja(record.id)
        setNrPyt(nrPyt+1)
    }

    const again = async()=>{
        setPyt(null)
        setSesja(null)
        const data = {
            "userID": pb.authStore.model.id,
            "kategoriaID": idKat
        };
        
        const record = await pb.collection('sesions').create(data);
        setSesja(record.id)
        sesja && setNrPyt(1)
    }

    const reset = async()=>{
        setNrPyt(0)
    }

    const main = async()=>{
        router.push("/")
    }

    return (
        <div>
            {nrPyt==0 &&
            <>
                <div className="h-[100vh]"></div>
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] p-4 border-2 border-dashed">
                <Select onValueChange={(e)=>{setTemat(e.nazwa), setIdKat(e.id), console.log(e)}}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Temat quizu" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories && categories.map((item, idx)=>(
                            <SelectItem key={idx} value={{id:item.id, nazwa:item.skrot}}>{item.skrot}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button className="w-[100%] mt-2" onClick={sesion}>Graj</Button>
                </div>
                </>
            }
            {nrPyt>=1 && nrPyt<=10 && pyt &&
                <div className=" w-1/3 flex flex-col items-center">
                    <h1>{pyt.output.question}</h1>
                    <div className="flex flex-col gap-4 min-h-[100px] ">
                        {pyt.output.answers.map((item, idx) => (
                            <Button key={idx} className={`h-auto w-auto ${item.isCorrect == true ? "bg-lime-500" : "bg-rose-500"}`} onClick={next}>{item.text}</Button>
                        ))}
                    </div>
                </div>
            }
            {nrPyt==11 &&
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] p-4 border-2 border-dashed">
                <Button className="w-[100%] mt-2" onClick={again}>Zagraj ponownie</Button>
                <Button className="w-[100%] mt-2" onClick={reset}>Zmień temat</Button>
                <Button className="w-[100%] mt-2" onClick={main}>Main</Button>
                </div>
            }
        </div>

    );
}
