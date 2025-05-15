import React, { useState, useEffect } from "react";
import PocketBase from "pocketbase";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// Initialize PocketBase
const pb = new PocketBase("http://192.168.60.25:8080"); // adjust URL as needed

export default function Filter({ danen, id }) {
    const [records, setRecords] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minCorrect, setMinCorrect] = useState("");
    const [maxAll, setMaxAll] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const userID = pb.authStore.record?.id;

    // Fetch categories on load
    useEffect(() => {
        const fetchCategories = async () => {
            const data = await pb.collection("categories").getFullList({ expand: 'kategoriaID' });
            setCategories(data);
        };
        fetchCategories();
    }, []);

    // Fetch sessions whenever filters change
    useEffect(() => {
        const fetchSessions = async () => {
            danen([])
            const filter = buildFilter({
                userID,
                selectedCategories,
                minCorrect,
                maxAll,
                startDate,
                endDate,
            });

            try {
                const data = await pb.collection("sesions").getFullList({ expand: 'kategoriaID', filter, sort: '-created' });
                setRecords(data);
                console.log(data)
                danen(data)
            } catch (error) {
                console.error("Error fetching sessions:", error);
            }
        };

        fetchSessions();
    }, [selectedCategories, minCorrect, maxAll, startDate, endDate]);

    const buildFilter = ({
        userID,
        selectedCategories,
        minCorrect,
        maxAll,
        startDate,
        endDate,
    }) => {
        const clauses = [];

        if (userID) clauses.push(`userID="${userID}"`);

        if (selectedCategories.length > 0) {
            const catClause = selectedCategories
                .map((id) => `kategoriaID="${id}"`)
                .join(" || ");
            clauses.push(`(${catClause})`);
        }

        if (minCorrect) clauses.push(`poprawne >= ${minCorrect}`);
        if (maxAll) clauses.push(`all <= ${maxAll}`);

        if (startDate) {
            clauses.push(`created >= "${startDate} 00:00:00.000"`);
        }
        if (endDate) {
            clauses.push(`created <= "${endDate} 23:59:59.999"`);
        }

        return clauses.join(" && ");
    };

    const toggleCategory = (id) => {
        setSelectedCategories((prev) =>
            prev.includes(id)
                ? prev.filter((catId) => catId !== id)
                : [...prev, id]
        );
    };

    return (
        <Card className="p-4 m-2 h-[20vh]">
            <CardHeader>
                <CardTitle>
                    Filters
                </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-row gap-3 justify-center items-center'>

                {/* Category Checkboxes */}
                <div className="mb-4 border-r-2 pr-2">
                    <strong>Categories:</strong>
                    {categories.map((cat) => (
                        <label key={cat.id} className="block">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(cat.id)}
                                onChange={() => toggleCategory(cat.id)}
                            />
                            {cat.skrot}
                        </label>
                    ))}
                </div>

                {/* Number Filters */}
                <div className="mb-4 border-r-2 pr-2 w-1/5">
                    <label>
                        <strong>Ilość poprawnych odp:</strong>
                        <br />
                        <input
                            type="number"
                            value={minCorrect}
                            max={10}
                            min={0}
                            placeholder="0"
                            onChange={(e) => setMinCorrect(e.target.value)}
                            className="ml-2 border-2 rounded-xl pl-3"
                        />
                    </label>
                </div>
                <div className="mb-4 w-1/5">
                    <label>
                        <strong>Ilość zadanych pytań:</strong>
                        <br />
                        <input
                            type="number"
                            value={maxAll}
                            max={10}
                            min={0}
                            placeholder="10"
                            onChange={(e) => setMaxAll(e.target.value)}
                            className="ml-2 border-2 rounded-xl pl-3"
                        />
                    </label>
                </div>

                {/* Date Filters */}
                {/* <div className="mb-4 border-r-2 pr-2">
                    <label>
                        <strong>Start Date:</strong>
                        <br />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="ml-2 border-2 rounded-xl pl-3"
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label>
                        <strong>End Date:</strong>
                        <br />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="ml-2 border-2 rounded-xl pl-3"
                        />
                    </label>
                </div> */}
            </CardContent>
        </Card>
    );
}