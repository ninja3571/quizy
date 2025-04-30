'use client'

import { useEffect, useState } from "react"
import PocketBase from 'pocketbase';
import { useRouter } from "next/navigation";

export default function Home() {

    const pb = new PocketBase('http://172.16.15.146:8080');
    const router = useRouter()

    if (pb.authStore.model) {
        console.log(pb.authStore.model)
    }
    else { router.push("/login") }

    const [pyt, setPyt] = useState(null)
    const [nrPyt, setNrPyt] = useState(9)
    const [temat, setTemat] = useState(null)


    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetch("http://172.16.15.146:5678/webhook/quiz")
                const json = await data.json()
                console.log(json)
                setPyt(json)
            }
            catch (err) {
                console.log(err)
                setChange(err)
            }
        }
        getData()
    }, [nrPyt])

    const next = async()=>{
        console.log(nrPyt)
        const data = {
            "pytanie": pyt.output.question,
            "odp1": `${pyt.output.answers[0]!=null ? pyt.output.answers[0].text : ""}`,
            "odp2": `${pyt.output.answers[1]!=null ? pyt.output.answers[1].text : ""}`,
            "odp3": `${pyt.output.answers[2]!=null ? pyt.output.answers[2].text : ""}`,
            "odp4": `${pyt.output.answers[3]!=null ? pyt.output.answers[3].text : ""}`,
            "numerSesji": pyt.output,
            "nrPytania": nrPyt
        };

        const record = await pb.collection('questions').create(data);
        console.log(record)
        {nrPyt==10 ? router.push("/") : null}
        setTimeout(() => {
            setNrPyt(nrPyt+1)
        }, 2000);
    }

    return (
        <div>
            {pyt &&
                <div>
                    <h1>{pyt.output.question}</h1>
                    <div className="flex flex-row gap-4 min-h-[100px]">
                        {pyt.output.answers.map((item, idx) => (
                            <div key={idx} className={`h-auto w-1/${pyt.output.answers.length} ${item.isCorrect == true ? "bg-lime-500" : "bg-rose-500"}`} onClick={next}>{item.text}</div>
                        ))}
                    </div>
                </div>
            }
        </div>

    );
}
