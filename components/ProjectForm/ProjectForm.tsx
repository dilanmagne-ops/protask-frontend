"use client";

import "./ProjectForm.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function ProjectForm()
{
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [budget, setBudget] = useState("");
    const [deadlineDays, setDeadlineDays] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent)
    {
        e.preventDefault();
        setError("");
        try
        {
            const token = localStorage.getItem("token");
            const response =
            await fetch("http://localhost:3000/api/projects",
                {
                    method: "POST",
                    headers:
                    {
                        "Content-Type":
                        "application/json",

                        Authorization:
                        `Bearer ${token}`,
                    },
                    body:
                    JSON.stringify({
                        title,
                        description,
                        category,
                        budget:
                        Number(budget),

                        deadlineDays:
                        Number(deadlineDays),
                    }),
                }
            );
            const data =
            await response.json();
            console.log(data);
            if (!response.ok)
            {
                setError(data.message || "Error al crear proyecto");
                return;
            }
            alert("Proyecto publicado correctamente");
            router.push("/menuCliente");
        }

        catch(error)
        {
            console.log(error);
            setError("Error de conexión");
        }
    }

    return (
        <div className="project-form-container">
            <div className="project-form-card">
                <h1>
                    Formulario de Proyecto
                </h1>
                <div className="project-header">
                    <span>
                        ← Nuevo Proyecto
                    </span>
                    <span className="cliente-role">
                        Cliente
                    </span>
                </div>
                <form className="project-form"
                    onSubmit={handleSubmit}
                >
                    
                    <div className="input-group">
                        <label>
                            Titulo del proyecto *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e)=>setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">

                        <label>
                            Descripcion *
                        </label>

                        <textarea 
                            value={description}
                            onChange={(e)=>setDescription(
                                e.target.value
                            )}
                            required
                        />

                    </div>

                    <div className="input-group">

                        <label>
                            Categoria *
                        </label>

                        <select
                            value={category}

                                onChange={(e)=>
                                setCategory(
                                    e.target.value
                                )}

                                required
                            >

                            <option value="">
                                Seleccionar...
                            </option>

                            <option value="Desarrollo Web">
                                Desarrollo Web
                            </option>

                            <option value="Diseño Grafico">
                                Diseño Grafico
                            </option>

                            <option value="Marketing">
                                Marketing
                            </option>

                        </select>

                    </div>

                    <div className="double-inputs">

                        <div className="input-group">

                            <label>
                                Presupuesto (Bs) *
                            </label>

                            <input 
                                type="number"
                                value={budget}
                                onChange={(e)=>setBudget(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="input-group">

                            <label>
                                Plazo (dias) *
                            </label>

                            <input type="number"
                                value={deadlineDays}

                                onChange={(e)=>
                                setDeadlineDays(
                                    e.target.value
                                )}

                                required
                             />

                        </div>

                    </div>
                    {error && (
                        <p>
                            {error}
                        </p>
                    )}
                    <div className="hitos-box">

                        <p>
                            Opcional: Dividir en hitos
                        </p>

                        <button type="button">
                            + Agregar hitos
                        </button>

                    </div>

                    <div className="project-buttons">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => router.push("/menuCliente")}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="publish-button"
                        >
                            Publicar
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}