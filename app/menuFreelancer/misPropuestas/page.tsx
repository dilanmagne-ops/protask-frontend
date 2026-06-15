"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./misPropuestas.css";

type Proposal =
{
    id: string;

    offeredPrice: number;

    estimatedDays: number;

    description: string;

    status: string;

    project:
    {
        id: string;

        title: string;

        description: string;

        category: string;

        budget: number;

        deadlineDays: number;

        status: string;
    };
};

export default function MisPropuestas()
{
    const router = useRouter();

    const [proposals, setProposals] =
        useState<Proposal[]>([]);

    const [search, setSearch] = useState("");

    useEffect(() =>
    {
        obtenerPropuestas();
    }, []);

    async function obtenerPropuestas()
    {
        try
        {
            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:3000/api/proposals/freelancer/me",
                {
                    headers:
                    {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            setProposals(data.data);
        }
        catch (error)
        {
            console.error(error);
        }
    }

    const filteredProposals =
    proposals.filter((proposal) =>
        proposal.status !== "rejected" &&
        proposal.project.title
            .toLowerCase()
            .includes(search.toLowerCase())
    );
    function editarPropuesta(id: string)
    {
        router.push(`/menuFreelancer/misPropuestas/editar/${id}`);
    }
    return (
        <div className="mispropuestas-page">

            <main className="mispropuestas-container">

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

                    <h1>
                        Mis Propuestas
                    </h1>

                    <p>
                        Revisa las propuestas enviadas, consulta su estado
                        y administra tus postulaciones.
                    </p>

                    <div className="top-search">

                        <div className="search-box">

                            <span>
                                🔍
                            </span>

                            <input
                                type="text"
                                placeholder="Buscar propuesta..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                    </div>

                </section>

                {
                    filteredProposals.length === 0
                        ?
                        (
                            <div className="empty-proposals">

                                <h3>
                                    No tienes propuestas
                                </h3>

                                <p>
                                    Cuando envíes propuestas aparecerán aquí.
                                </p>

                            </div>
                        )
                        :
                        (
                            <div className="proposals-grid">

                                {
                                    filteredProposals.map((proposal) =>
                                    (
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

                                            <h3>
                                                {proposal.project.title}
                                            </h3>

                                            <p>
                                                {proposal.description}
                                            </p>

                                            <div className="proposal-info">

                                                <span>
                                                    ⏱ {proposal.estimatedDays} días
                                                </span>

                                                <span>
                                                    Estado: {proposal.status}
                                                </span>

                                            </div>
                                            {
                                            proposal.status === "pending" && (
                                                <div className="proposal-buttons">

                                                    <button
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            editarPropuesta(proposal.id)
                                                        }
                                                    >
                                                        Editar propuesta
                                                    </button>

                                                </div>
                                            )
                                            }
                                        </div>
                                        
                                    ))
                                }

                            </div>
                        )
                }

            </main>

        </div>
    );
}