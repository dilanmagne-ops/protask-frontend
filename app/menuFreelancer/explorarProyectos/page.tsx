"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./explorarProyectos.css";

type Project = {
    id: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    deadlineDays: number;
    status: string;
};

export default function ExplorarProyectos() {
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Todas");
    const [minBudget, setMinBudget] = useState("");
    const [maxBudget, setMaxBudget] = useState("");

    useEffect(() => {
        obtenerProyectos();
    }, []);

    async function obtenerProyectos() {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:3001/api/projects", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            const disponibles = data.data.filter(
                (project: Project) => project.status === "open"
            );

            setProjects(disponibles);
        } catch (error) {
            console.error(error);
        }
    }

    const filteredProjects = projects.filter((project) => {
        const coincideBusqueda =
            project.title.toLowerCase().includes(search.toLowerCase()) ||
            project.description.toLowerCase().includes(search.toLowerCase());

        const coincideCategoria =
            category === "Todas" || project.category === category;

        const coincideMin =
            minBudget === "" || project.budget >= Number(minBudget);

        const coincideMax =
            maxBudget === "" || project.budget <= Number(maxBudget);

        return coincideBusqueda && coincideCategoria && coincideMin && coincideMax;
    });

    return (
        <div className="explore-page">
            <main className="explore-container">
                <section className="explore-header">
                    <button
                        className="back-button"
                        onClick={() => router.push("/menuFreelancer")}
                    >
                        ← Volver
                    </button>

                    <span className="explore-badge">Freelancer</span>

                    <h1>Explorar Proyectos</h1>

                    <p>
                        Encuentra proyectos disponibles, filtra por categoría o presupuesto
                        y envía una propuesta profesional.
                    </p>
                </section>

                <section className="explore-layout">
                    <aside className="filters-panel">
                        <h2>Filtros</h2>

                        <label>Buscar proyecto</label>
                        <div className="search-box">
                            <span>🔍</span>
                            <input
                                type="text"
                                placeholder="Buscar por título o descripción..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <label>Categoría</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option>Todas</option>
                            <option>Desarrollo Web</option>
                            <option>Diseño</option>
                        </select>

                        <label>Presupuesto</label>
                        <div className="budget-row">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minBudget}
                                onChange={(e) => setMinBudget(e.target.value)}
                            />

                            <input
                                type="number"
                                placeholder="Max"
                                value={maxBudget}
                                onChange={(e) => setMaxBudget(e.target.value)}
                            />
                        </div>

                        <div className="results-box">
                            <strong>{filteredProjects.length}</strong>
                            <span>proyectos encontrados</span>
                        </div>
                    </aside>

                    <section className="projects-section">
                        {filteredProjects.length === 0 ? (
                            <div className="empty-projects">
                                <h3>No se encontraron proyectos</h3>
                                <p>Prueba cambiando los filtros de búsqueda.</p>
                            </div>
                        ) : (
                            <div className="project-grid">
                                {filteredProjects.map((project) => (
                                    <div className="project-card" key={project.id}>
                                        <div className="project-top">
                                            <span>{project.category}</span>
                                            <strong>Bs. {project.budget}</strong>
                                        </div>

                                        <h3>{project.title}</h3>

                                        <p>{project.description}</p>

                                        <div className="project-info">
                                            <span>⏱ {project.deadlineDays} días</span>
                                            <span>Estado: Abierto</span>
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
                                ))}
                            </div>
                        )}
                    </section>
                </section>
            </main>
        </div>
    );
}