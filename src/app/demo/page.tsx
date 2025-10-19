"use client"
import React, { useState } from "react"
import { v4 as uuidv4 } from "uuid" // npm i uuid

export default function DynamicInputList() {
    const [steps, setSteps] = useState([{ id: uuidv4(), value: "" }])

    const handleAdd = () => {
        setSteps([...steps, { id: uuidv4(), value: "" }])
    }

    const handleChange = (id: string, value: string) => {
        setSteps(steps.map((s) => (s.id === id ? { ...s, value } : s)))
    }

    const handleRemove = (id: string) => {
        setSteps(steps.filter((s) => s.id !== id))
    }

    return (
        <div className="space-y-3">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                    <input
                        value={step.value}
                        onChange={(e) => handleChange(step.id, e.target.value)}
                        placeholder={`Bước ${index + 1}`}
                        className="flex-1 border p-2 rounded"
                    />
                    {steps.length > 1 && (
                        <button
                            onClick={() => handleRemove(step.id)}
                            className="text-red-500 font-bold"
                        >
                            ✕
                        </button>
                    )}
                </div>
            ))}

            <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">
                + Thêm bước
            </button>

            <pre className="bg-gray-100 p-2 rounded text-sm">{JSON.stringify(steps, null, 2)}</pre>
        </div>
    )
}
