"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./verMisTrabajos.css";

type Proposal = {
    id: string;
    offeredPrice: number;
    estimatedDays: number;
    description: string;
    status: string;
    project: {
        id: string;
        title: string;
        description: string;
        category: string;
        budget: number;
        deadlineDays: number;
        status: string;
    };
};

export default function VerMisTrabajos() {
    const router = useRouter();

    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        obtenerTrabajos();
    }, []);

    async function obtenerTrabajos() {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:3000/api/proposals/freelancer/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            // SOLO TRABAJOS ACEPTADOS
            const aceptadas = data.data.filter(
                (proposal: Proposal) => proposal.status === "accepted"
            );

            setProposals(aceptadas);
        } catch (error) {
            console.error(error);
        }
    }

    const filteredProposals = proposals.filter((proposal) =>
        proposal.project.title
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="mispropuestas-page">

            <main className="mispropuestas-container">

                {/* HEADER estilo MisPropuestas */}
                <section className="mispropuestas-header">

                    <button
                        className="back-button"
                        onClick={() =>
                            router.push("/menuFreelancer")
                        }
                    >
                        ← Volver
                    </button>

                    <span className="mispropuestas-badge">
                        Freelancer
                    </span>

                    <h1>Mis Trabajos</h1>

                    <p>
                        Aquí puedes ver los trabajos que fueron aceptados
                        y que ahora forman parte de tus proyectos activos.
                    </p>

                    {/* SEARCH */}
                    <div className="top-search">
                        <div className="search-box">
                            <span>🔍</span>
                            <input
                                type="text"
                                placeholder="Buscar trabajo..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />
                        </div>
                    </div>

                </section>

                {/* CONTENIDO */}
                {filteredProposals.length === 0 ? (
                    <div className="empty-proposals">
                        <h3>No tienes trabajos activos</h3>
                        <p>
                            Cuando una propuesta sea aceptada aparecerá aquí como trabajo.
                        </p>
                    </div>
                ) : (
                    <div className="proposals-grid">

                        {filteredProposals.map((proposal) => (
                            <div
                                className="proposal-card"
                                key={proposal.id}
                            >

                                <div className="proposal-top">
                                    <span className="proposal-category">
                                        {proposal.project.category}
                                    </span>

                                    <strong className="proposal-price">
                                        Bs. {proposal.offeredPrice}
                                    </strong>
                                </div>

                                <h3>{proposal.project.title}</h3>

                                <p>{proposal.project.description}</p>

                                <div className="proposal-info">
                                    <span>
                                        ⏱ {proposal.estimatedDays} días
                                    </span>

                                    <span>
                                        Estado: {proposal.status}
                                    </span>
                                </div>

                                <div className="proposal-buttons">
                                    <button
                                        className="delete-btn"
                                        onClick={() => {
                                            localStorage.setItem(
                                            "selectedProposal",
                                            JSON.stringify(proposal)
                                        );

                                        router.push(
                                            `/menuFreelancer/verMisTrabajos/${proposal.id}`
                                        );
                                        }}
                                    >
                                        Ver trabajo
                                    </button>
                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </main>
        </div>
    );
}