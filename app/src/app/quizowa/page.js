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
    const [idSes, setIdSes] = useState(null) 


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
    }, [nrPyt])

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetch(`http://172.16.15.146:5678/webhook/quiz`, {headers:{"topic":temat}})
                const json = await data.json()
                console.log(json)
                setPyt(json)
            }
            catch (err) {
                console.log(err)
                setChange(err)
            }
        }
        setTimeout(() => {
            getData()
        }, 200);
    }, [nrPyt])

    const next = async()=>{
        console.log(nrPyt)
        const data = {
            "pytanie": pyt.output.question,
            "odp1": `${pyt.output.answers[0]!=null ? pyt.output.answers[0].text : ""}`,
            "odp2": `${pyt.output.answers[1]!=null ? pyt.output.answers[1].text : ""}`,
            "odp3": `${pyt.output.answers[2]!=null ? pyt.output.answers[2].text : ""}`,
            "odp4": `${pyt.output.answers[3]!=null ? pyt.output.answers[3].text : ""}`,
            "numerSesji": sesja,
            "nrPytania": nrPyt
        };

        const record = await pb.collection('questions').create(data);
        console.log(record)

        // {nrPyt==10 ? router.push("/") : null}
        // setTimeout(() => {
            setNrPyt(nrPyt+1)
        // }, 200);
    }

    const sesion = async()=>{
        const data = {
            "userID": pb.authStore.model.id,
            "kategoriaID": idSes
        };
        
        const record = await pb.collection('sesions').create(data);
        setSesja(record.id)
        setNrPyt(nrPyt+1)
    }

    return (
        <div>
            {nrPyt==0 &&
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4 border-2 border-dashed">
                <Select onValueChange={(e)=>{setTemat(e.nazwa), setIdSes(e.id)}}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Temat quizu" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories && categories.map((item, idx)=>(
                            <SelectItem value={{nazwa: item.skrot, id:item.id}} key={idx}>{item.skrot}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button className="w-[100%] mt-2" onClick={sesion}>Test</Button>
                </div>
            }
            {nrPyt>=1 && nrPyt<=10 && pyt &&
                <div className="absolute left-[50%] translate-x-[-50%] w-1/3 flex flex-col items-center">
                    <h1>{pyt.output.question}</h1>
                    <div className="flex flex-col gap-4 min-h-[100px] ">
                        {pyt.output.answers.map((item, idx) => (
                            <div key={idx} className={`h-auto w-auto ${item.isCorrect == true ? "bg-lime-500" : "bg-rose-500"}`} onClick={next}>{item.text}</div>
                        ))}
                    </div>
                </div>
            }
        </div>

    );
}
