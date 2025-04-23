'use client'

import { useEffect, useState } from "react"

export default function Home() {

    const [pyt, setPyt] = useState(null)
    const [change, setChange] = useState(null)

    useEffect(()=>{
        const getData = async () =>{
            try{
                const data = await fetch("http://172.16.15.146:5678/webhook/quiz")
                const json = await data.json()
                console.log(json)
                setPyt(json)
            }
            catch(err){
                console.log(err)
                setChange(err)
            }
        }
        getData()
    }, [change])

  return (
    <div>
        {pyt &&
        <div>
            <h1>{pyt.output.question}</h1>
            <div className="flex flex-row gap-4 min-h-[100px]">
                {pyt.output.answers.map((item, idx)=>(
                    <div key={idx} className={`h-auto w-1/${pyt.output.answers.length} ${item.isCorrect == true ? "bg-lime-500" : "bg-rose-500"}`}>{item.text}</div>
                ))}
            </div>
            </div>
        }
    </div>

  );
}
