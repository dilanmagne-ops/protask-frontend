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

            console.log(data);

            // 🔥 SOLO ACEPTADAS = TRABAJOS
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
        <div className="freelancer-page">
            <div className="freelancer-card">

                <h1>Mis Trabajos</h1>

                {/* BUSCADOR */}
                <div className="search-box">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar trabajo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* CARDS */}
                <div className="project-list">

                    {filteredProposals.map((proposal) => (
                        <div className="project-card" key={proposal.id}>

                            <h3>{proposal.project.title}</h3>

                            <p>{proposal.project.description}</p>

                            <div className="project-footer">
                                <span>
                                    📁 {proposal.project.category}
                                </span>

                                <strong>
                                    Bs. {proposal.offeredPrice}
                                </strong>
                            </div>

                            <div style={{ marginTop: "10px" }}>
                                <strong>Estado:</strong>{" "}
                                {proposal.status}
                            </div>

                            <div style={{ marginTop: "10px" }}>
                                ⏱️ {proposal.estimatedDays} días
                            </div>

                            <div className="proposal-buttons">
                                <button
                                onClick={() => {
                                    localStorage.setItem("selectedProject", JSON.stringify(proposal.project));
                                    router.push(`/menuFreelancer/verMisTrabajos/${proposal.project.id}`);
                                }}
                            >
                                Ver trabajo
                            </button>
                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}