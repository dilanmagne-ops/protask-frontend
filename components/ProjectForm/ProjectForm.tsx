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
            await fetch("http://localhost:3001/api/projects",
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
        <main className="project-page">

            <section className="project-layout">

                <div className="project-info">

                    <span className="project-badge">
                        Nuevo Proyecto
                    </span>

                    <h1>
                        Publica un proyecto y encuentra freelancers
                    </h1>

                    <p>
                        Describe lo que necesitas, define tu presupuesto
                        y establece un plazo para recibir propuestas claras.
                    </p>

                    <div className="project-tips">

                        <div>
                            <strong>01</strong>
                            <span>Agrega un título claro y directo.</span>
                        </div>

                        <div>
                            <strong>02</strong>
                            <span>Explica los requisitos principales.</span>
                        </div>

                        <div>
                            <strong>03</strong>
                            <span>Define presupuesto y plazo realista.</span>
                        </div>

                    </div>

                </div>

                <div className="project-form-card">

                    <div className="project-header">

                        <div>
                            <h2>
                                Formulario de Proyecto
                            </h2>

                            <p>
                                Completa la información para publicar tu solicitud.
                            </p>
                        </div>

                        <span className="cliente-role">
                            Cliente
                        </span>

                    </div>

                    <form
                        className="project-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="input-group">
                            <label>
                                Título del proyecto *
                            </label>

                            <input
                                type="text"
                                placeholder="Ejemplo: Página web para mi negocio"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="input-group">

                            <label>
                                Descripción *
                            </label>

                            <textarea
                                placeholder="Describe qué necesitas, objetivos, requisitos y entregables esperados."
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        <div className="input-group">

                            <label>
                                Categoría *
                            </label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Seleccionar categoría...
                                </option>

                                <option value="Desarrollo Web">
                                    Desarrollo Web
                                </option>

                                <option value="Diseño Grafico">
                                    Diseño Gráfico
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
                                    placeholder="Ejemplo: 500"
                                    value={budget}
                                    onChange={(e) =>
                                        setBudget(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="input-group">

                                <label>
                                    Plazo en días *
                                </label>

                                <input
                                    type="number"
                                    placeholder="Ejemplo: 7"
                                    value={deadlineDays}
                                    onChange={(e) =>
                                        setDeadlineDays(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>

                        {error && (
                            <p className="error-message">
                                {error}
                            </p>
                        )}

                        <div className="hitos-box">

                            <div>
                                <h3>
                                    Hitos del proyecto
                                </h3>

                                <p>
                                    Opcionalmente puedes dividir el trabajo en etapas.
                                </p>
                            </div>

                            <button type="button">
                                + Agregar hitos
                            </button>

                        </div>

                        <div className="project-buttons">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() =>
                                    router.push("/menuCliente")
                                }
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="publish-button"
                            >
                                Publicar Proyecto
                            </button>

                        </div>

                    </form>

                </div>

            </section>

        </main>
    );
}