"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/components/use-outside-click";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


import PocketBase from 'pocketbase';
import { ScrollArea } from "./ui/scroll-area";
import { WykresBar } from "./wykresBar";
import { ArrowBigRightDash, Check, X } from "lucide-react";
import { Card } from "./ui/card";
import Link from "next/link";

export function FastHistory({ danen }) {
    const [active, setActive] = useState(null);
    const ref = useRef(null);
    const id = useId();
    const [dane, setDane] = useState(null)
    const [pyt, setPyt] = useState(null)

    // const pb = new PocketBase('http://172.16.15.146:8080');
    const pb = new PocketBase('http://192.168.60.25:8080');

    useEffect(() => {

        setDane(danen.items)

    }, [])

    const szukPyt = async (id) => {
        try {
            const records = await pb.collection('questions').getFullList({
                filter: `numerSesji = '${id}'`,
            });
            setPyt(records)
            console.log(records)
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        function onKeyDown(event) {
            if (event.key === "Escape") {
                setActive(false);
            }
        }

        if (active && typeof active === "object") {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(null));

    return (
        <>

            <ScrollArea className='h-auto w-[200%] pt-2'>
                <AnimatePresence>
                    {active && typeof active === "object" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 h-full w-full z-10" />
                    )}
                </AnimatePresence>
                <AnimatePresence className='w-full h-screen'>

                    {dane && active && typeof active === "object" ? (

                        // po kliknięciu
                        <div className="fixed inset-0 grid place-items-center z-[100] w-[200%]">
                            <motion.button
                                key={`button-${active.title}-${dane.id}`}
                                layout
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: {
                                        duration: 0.05,
                                    },
                                }}
                                className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                                onClick={() => { setActive(null) }}>
                                <CloseIcon />
                            </motion.button>

                            {/* obraz (duży) */}
                            <motion.div
                                layoutId={`card-${active.pytanie}-${dane.id}`}
                                ref={ref}
                                className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden">
                                <motion.div layoutId={`image-${active.pytanie}-${id}`}>
                                    <img
                                        width={100}
                                        height={100}
                                        src={pb.files.getURL(active.expand.kategoriaID, active.expand.kategoriaID.obraz)}
                                        alt={active.pytanie}
                                        className="w-full h-auto lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-contain object-bottom" />
                                </motion.div>

                                {/* uzupełnienie tekstu */}
                                <div>
                                    <ScrollArea className='h-[20vh] px-3'>
                                        <Accordion type="single" collapsible>

                                            {pyt && pyt.map((item) => (
                                                <div key={item.nrPytania} className={`order-[${item.nrPytania}]`}>
                                                    <AccordionItem value={item.nrPytania}>
                                                        <AccordionTrigger className='aria-expanded:bg-gray-200 rounded-b-none hover:bg-gray-100 dark:hover:bg-neutral-700 dark:aria-expanded:bg-neutral-800'>{item.pytanie}{item.odpPopr == item.odpWybr ? <Check className="text-green-500 open:rotate-0" /> : <X className="text-rose-400" />}</AccordionTrigger>
                                                        <AccordionContent className='bg-gray-100 dark:bg-neutral-700 rounded-b-md'>
                                                            <h1 className={`${item.odpWybr == item.odp1 ? `${item.odpPopr == item.odpWybr ? 'bg-green-400 dark:bg-green-700' : "bg-rose-400 dark:bg-rose-800"}` : `${item.odpPopr == item.odp1 ? 'bg-green-300 dark:bg-green-800' : null}`}`}>{item.odp1}</h1>
                                                            <h1 className={`${item.odpWybr == item.odp2 ? `${item.odpPopr == item.odpWybr ? 'bg-green-400 dark:bg-green-700' : "bg-rose-400 dark:bg-rose-800"}` : `${item.odpPopr == item.odp2 ? 'bg-green-300 dark:bg-green-800' : null}`}`}>{item.odp2}</h1>
                                                            <h1 className={`${item.odpWybr == item.odp3 ? `${item.odpPopr == item.odpWybr ? 'bg-green-400 dark:bg-green-700' : "bg-rose-400 dark:bg-rose-800"}` : `${item.odpPopr == item.odp3 ? 'bg-green-300 dark:bg-green-800' : null}`}`}>{item.odp3}</h1>
                                                            <h1 className={`${item.odpWybr == item.odp4 ? `${item.odpPopr == item.odpWybr ? 'bg-green-400 dark:bg-green-700' : "bg-rose-400 dark:bg-rose-800"}` : `${item.odpPopr == item.odp4 ? 'bg-green-300 dark:bg-green-800' : null}`}`}>{item.odp4}</h1>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </div>
                                            ))}
                                        </Accordion>

                                        {console.log({ active })}
                                        <WykresBar popr={active.poprawne} all={active.all} />
                                    </ScrollArea>

                                    {/* przycisk i pod nim */}
                                    <div className="pt-4 relative px-4">
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
                                            {typeof active.content === "function"
                                                ? active.content()
                                                : active.odp2}
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ) :
                        <Link href="/history" className="flex flex-row gap-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 w-[250px] rounded-t-md rounded-bl-md border-2">Przejdź do historii <ArrowBigRightDash /></Link>}

                </AnimatePresence>
                <ul className="max-w-2xl mx-auto w-full gap-4">

                    {dane && dane.map((item, idx) => (
                        <Card
                            key={idx}
                            onClick={() => { setActive(item), szukPyt(item.id) }}
                            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer mb-3">
                            <div className="flex gap-4 flex-col md:flex-row ">

                                {/* zdjecie */}
                                {item.expand && item.expand.kategoriaID &&
                                    <motion.div layoutId={`image-${item.id}-${id}`}>
                                        <img
                                            width={100}
                                            height={100}
                                            src={pb.files.getURL(item.expand.kategoriaID, item.expand.kategoriaID.obraz)}
                                            alt={dane.question}
                                            className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top" />
                                    </motion.div>}

                                {/* przy małym obrazku */}
                                <div className="">
                                    <motion.h3
                                        layoutId={`title-${item.id}-${id}`}
                                        className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left">
                                        {item.expand.kategoriaID.nazwa}
                                    </motion.h3>
                                    <motion.p
                                        layoutId={`description-${item.id}-${id}`}
                                        className="text-neutral-600 dark:text-neutral-400 text-center md:text-left">
                                        {new Date(item.updated).toLocaleDateString()}
                                    </motion.p>
                                </div>
                            </div>
                            {/* napis w małym guziku */}
                            <button
                                className={`px-4 py-2 text-sm rounded-full font-bold bg-gray-100 ${item.poprawne <= 6 ? `${item.poprawne <= 3 ? 'bg-red-500' : 'bg-orange-500'}` : `${item.poprawne < 10 ? 'bg-green-500' : 'bg-purple-500'}`} hover:text-white text-black mt-4 md:mt-0`}>
                                {item.poprawne}/{item.all}
                            </button>
                        </Card>

                    ))}
                    {!dane ?
                        <h1>brak danych</h1>
                        : null
                    }
                </ul>
            </ScrollArea>
        </>
    );
}

export const CloseIcon = () => {
    return (
        <motion.svg
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
                transition: {
                    duration: 0.05,
                },
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-black">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </motion.svg>
    );
};
