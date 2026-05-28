"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./explorarProyectos.css";

type Project =
{
    id: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    deadlineDays: number;
    status: string;
};

export default function ExplorarProyectos()
{
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);

    // FILTROS
    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("Todas");

    const [minBudget, setMinBudget] = useState("");

    const [maxBudget, setMaxBudget] = useState("");

    useEffect(() =>
    {
        obtenerProyectos();
    }, []);

    async function obtenerProyectos()
    {
        try
        {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:3000/api/projects",
                {
                    headers:
                    {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            const disponibles =
                data.data.filter(
                    (project: Project) =>
                        project.status === "open"
                );

            setProjects(disponibles);
        }
        catch (error)
        {
            console.error(error);
        }
    }

    // FILTRADO
    const filteredProjects =
        projects.filter((project) =>
        {
            const coincideBusqueda =
                project.title
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const coincideCategoria =
                category === "Todas" ||
                project.category === category;

            const coincideMin =
                minBudget === "" ||
                project.budget >= Number(minBudget);

            const coincideMax =
                maxBudget === "" ||
                project.budget <= Number(maxBudget);

            return (
                coincideBusqueda &&
                coincideCategoria &&
                coincideMin &&
                coincideMax
            );
        });

    return (
        <div className="freelancer-page">

            <div className="freelancer-card">

                <h1>
                    Explorar Proyectos
                </h1>

                {/* BUSCADOR */}
                <div className="search-box">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Buscar proyectos..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                {/* FILTROS */}
                <div className="filters-box">

                    <h3>
                        Filtros
                    </h3>

                    <label>
                        Categoría
                    </label>

                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                    >
                        <option>
                            Todas
                        </option>

                        <option>
                            Desarrollo Web
                        </option>

                        <option>
                            Diseño
                        </option>

                    </select>

                    <label>
                        Presupuesto
                    </label>

                    <div className="budget-row">

                        <input
                            type="number"
                            placeholder="Min"
                            value={minBudget}
                            onChange={(e) =>
                                setMinBudget(e.target.value)
                            }
                        />

                        <input
                            type="number"
                            placeholder="Max"
                            value={maxBudget}
                            onChange={(e) =>
                                setMaxBudget(e.target.value)
                            }
                        />

                    </div>

                </div>

                {/* PROJECT CARDS */}
                <div className="project-list">

                    {
                        filteredProjects.map((project) =>
                        (
                            <div
                                className="project-card"
                                key={project.id}
                            >

                                <h3>
                                    {project.title}
                                </h3>

                                <p>
                                    {project.description}
                                </p>

                                <div className="project-footer">

                                    <span>
                                        📁 {project.category}
                                    </span>

                                    <strong>
                                        Bs. {project.budget}
                                    </strong>

                                </div>

                                <button
                                    onClick={() =>
                                        router.push(
                                            `/menuFreelancer/explorarProyectos/enviarPropuesta/${project.id}`
                                        )
                                    }
                                >
                                    Ver detalle
                                </button>

                            </div>
                        ))
                    }

                </div>

            </div>

        </div>
    );
}