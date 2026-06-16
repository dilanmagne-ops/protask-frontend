"use client";

import "./MisProyectos.css";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Project =
{
    id: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    status: string;
};

export default function MisProyectos()
{
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() =>
    {
        obtenerMisProyectos();
    }, []);

    async function obtenerMisProyectos()
    {
        try
        {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:3001/api/projects",
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            console.log(data);

            setProjects(data.data ?? []);
        }
        catch (error)
        {
            console.error(error);
        }
    }

    const activeProjects =
        projects.filter((project) =>
            project.status !== "cancelled" &&
            project.status !== "completed"
        );

    const filteredProjects =
        activeProjects.filter((project) =>
            project.title
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    return (
        <main className="misproyectos-page">

            <section className="misproyectos-hero">

                <div>
                    <span className="misproyectos-badge">
                        Panel Cliente
                    </span>

                    <h1>
                        Mis Proyectos
                    </h1>

                    <p>
                        Revisa los proyectos que publicaste, consulta sus datos
                        y explora las propuestas recibidas por freelancers.
                    </p>
                </div>

                <div className="misproyectos-summary">
                    <span>
                        Total de proyectos activos
                    </span>

                    <strong>
                        {activeProjects.length}
                    </strong>

                    <p>
                        Proyectos publicados en ProTask
                    </p>
                </div>

            </section>

            <section className="misproyectos-content">

                <div className="misproyectos-toolbar">

                    <div>
                        <h2>
                            Proyectos Publicados
                        </h2>

                        <p>
                            Busca y administra tus proyectos.
                        </p>
                    </div>

                    <span className="cliente-role">
                        Cliente
                    </span>

                </div>

                <input
                    type="text"
                    placeholder="Buscar proyectos por título..."
                    className="search-input"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <div className="project-list">

                    {
                        filteredProjects.length === 0
                        ? (
                            <div className="empty-projects">

                                <h3>
                                    No se encontraron proyectos
                                </h3>

                                <p>
                                    Intenta buscar con otro título o crea un nuevo proyecto.
                                </p>

                                <button
                                    onClick={() =>
                                        router.push("/menuCliente/crearProyecto")
                                    }
                                >
                                    Crear proyecto
                                </button>

                            </div>
                        )
                        : (
                            filteredProjects.map((project) =>
                            {
                                const isInProgress =
                                    project.status === "in_progress";

                                return (
                                    <div
                                        className="project-item"
                                        key={project.id}
                                    >

                                        <div className="project-top">

                                            <span className="project-category">
                                                {project.category}
                                            </span>

                                            <span className="project-status">
                                                {project.status}
                                            </span>

                                        </div>

                                        <h2>
                                            {project.title}
                                        </h2>

                                        <p>
                                            {project.description}
                                        </p>

                                        <div className="project-footer">

                                            <div>
                                                <span>
                                                    Presupuesto
                                                </span>

                                                <strong className="price">
                                                    Bs. {project.budget}
                                                </strong>
                                            </div>

                                        </div>

                                        <div className="project-actions">

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    router.push(
                                                        `/menuCliente/verMisProyectos/verProyecto/${project.id}`
                                                    )
                                                }
                                            >
                                                Ver Proyecto
                                            </button>

                                            {
                                                isInProgress
                                                ? (
                                                    <button
                                                        className="proposal-button"
                                                        onClick={() =>
                                                            router.push(
                                                                `/menuCliente/verMisProyectos/verAvance/${project.id}`
                                                            )
                                                        }
                                                    >
                                                        Ver Avance
                                                    </button>
                                                )
                                                : (
                                                    <button
                                                        className="proposal-button"
                                                        onClick={() =>
                                                            router.push(
                                                                `/menuCliente/verMisProyectos/explorarPropuestas/${project.id}`
                                                            )
                                                        }
                                                    >
                                                        Ver Propuestas
                                                    </button>
                                                )
                                            }

                                        </div>

                                    </div>
                                );
                            })
                        )
                    }

                </div>

                <button
                    className="back-button"
                    onClick={() =>
                        router.push("/menuCliente")
                    }
                >
                    Volver al panel
                </button>

            </section>

        </main>
    );
}