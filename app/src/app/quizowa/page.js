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
import { Card } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { PolWykres } from "@/components/wykresQuiz";
import { ConfettiFireworks } from "@/components/confettiFireworks";
import { ModeToggle } from "@/components/toggleTheme";
import "@/app/style.css"

export default function Home() {

    // const pb = new PocketBase('http://172.16.15.146:8080');
    const pb = new PocketBase('http://192.168.60.25:8080');
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
    const [allPopr, setAllPopr] = useState(0)
    const [numb, setNumb] = useState(0)
    const [chosen, setChosen] = useState(false)
    const [loading, setLoading] = useState(false)


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
            // setPyt(null)
            try {
                // const data = await fetch(`http://172.16.15.146:5678/webhook/quiz`, { headers: { "topic": temat } })
                const data = await fetch(`http://192.168.60.25:5678/webhook/quiz`, { headers: { "topic": temat } })
                const json = await data.json()
                console.log(json)
                setPyt(json)

                json.output.answers.map((item) => (
                    item.isCorrect == true ? setPopr(item.text) : null
                ))
                setLoading(true)
            }
            catch (err) {
                console.log(err)
                // setChange(err)
            }
        }
        // setTimeout(() => {
        getData()
        // }, 200);
    }, [nrPyt])


    useEffect(() => {
        const next = async () => {
            setLoading(false)

            if (wybr == popr) {
                setAllPopr(allPopr + 1)
            }

            if (wybr != null) {
                const data = {
                    "pytanie": `${pyt.output.question}`,
                    "odp1": `${pyt.output.answers[0].text}`,
                    "odp2": `${pyt.output.answers[1].text}`,
                    "odp3": `${pyt.output.answers[2].text}`,
                    "odp4": `${pyt.output.answers[3] ? pyt.output.answers[3].text : ''}`,
                    "odpPopr": `${popr}`,
                    "odpWybr": `${wybr}`,
                    "numerSesji": sesja,
                    "nrPytania": nrPyt
                };

                const record = await pb.collection('questions').create(data);
                console.log(record)

                const daten = {
                    "poprawne": allPopr,
                    "all": nrPyt
                };

                const recorden = await pb.collection('sesions').update(sesja, daten);
                setNrPyt(nrPyt + 1)
            }
        }
        next()
    }, [wybr])

    const sesion = async () => {
        setPyt(null)
        const data = {
            "userID": pb.authStore.model.id,
            "kategoriaID": idKat
        };

        const record = await pb.collection('sesions').create(data);
        setSesja(record.id)
        setAllPopr(0)
        setNrPyt(nrPyt + 1)
    }

    const again = async () => {
        const daten = {
            "poprawne": allPopr,
            "all": nrPyt
        };

        const recorden = await pb.collection('sesions').update(sesja, daten);

        setAllPopr(0)
        setPyt(null)
        setSesja(null)
        const data = {
            "userID": pb.authStore.model.id,
            "kategoriaID": idKat
        };

        const record = await pb.collection('sesions').create(data);
        setSesja(record.id)
        setNrPyt(1)
    }

    const reset = async () => {
        const daten = {
            "poprawne": allPopr,
        };

        const recorden = await pb.collection('sesions').update(sesja, daten);
        setNrPyt(0)
    }

    const main = async () => {
        if (sesja != null) {
            const daten = {
                "poprawne": allPopr,
            };

            const recorden = await pb.collection('sesions').update(sesja, daten);
        }

        router.push("/")
    }

    return (
        <div>
            <div className="absolute bottom-5 right-5">
                <ModeToggle />
            </div>
            {nrPyt == 0 &&
                <>
                    <Card onClick={main} className='p-4 absolute top-[70%] translate-y-[-50%] left-[50%] translate-x-[-50%] cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 flex flex-row'>
                        <LogOut /> <h1>Menu</h1>
                    </Card>
                    <div className="h-[100vh]"></div>
                    <Card className="absolute top-[50%] left-[50%] translate-x-[-50%] p-4 border-2 border-dashed">

                        {idKat &&
                            <img
                                src={pb.files.getURL(categories[numb], categories[numb].obraz)}
                                width={300}
                                height={300}
                                alt="wololo"
                                className="absolute top-[50%] translate-y-[calc(-100%-60px)] left-[50%] translate-x-[-50%] bg-gray-100 mb-3"
                            />
                        }
                        <Select onValueChange={(e) => { const selected = JSON.parse(e); setTemat(selected.nazwa), setIdKat(selected.id), setNumb(selected.num), setChosen(true) }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Temat quizu" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories && categories.map((item, idx) => (
                                    <SelectItem key={idx} value={JSON.stringify({ id: item.id, nazwa: item.skrot, num: idx })}>{item.skrot}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button disabled={chosen ? false : true} className='w-[100%] mt-2' onClick={sesion}>Graj</Button>
                    </Card>
                </>
            }
            {nrPyt >= 1 && nrPyt <= 10 && pyt &&
                <>
                    <Card onClick={main} className='p-4 absolute top-[70%] translate-y-[-50%] left-[50%] translate-x-[-50%] cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 flex flex-row'>
                        <LogOut /> <h1>Menu</h1>
                    </Card>
                    <div className="h-[100vh]"></div>
                    <Card className='absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] p-3 flex flex-row'>
                        {loading ?
                            <div className="flex flex-col items-center">
                                <h1>{pyt.output.question}</h1>
                                <div className="flex flex-col gap-4 min-h-[100px] ">
                                    {pyt.output.answers.map((item, idx) => (
                                        <Button key={idx} value={item.text} className='h-auto w-auto hover:bg-neutral-700 dark:hover:bg-neutral-400' onClick={(e) => { setWybr(e.target.value) }}>{item.text}</Button>
                                    ))}
                                </div>
                            </div>
                            :
                            <div className='loader'></div>}
                    </Card>
                </>
            }
            {nrPyt == 11 &&
                <div className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] p-4 w-[350px]">
                    <ConfettiFireworks />
                    <PolWykres all={10} popr={allPopr} />
                    <Card className='gap-1 p-3'>
                        <Button className="w-[100%] mt-2" onClick={again}>Zagraj ponownie</Button>
                        <Button className="w-[100%] mt-2" onClick={reset}>Zmień temat</Button>
                        <Button className="w-[100%] mt-2" onClick={main}>Main</Button>
                    </Card>
                </div>
            }
        </div>

    );
}