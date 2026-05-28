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

            console.log(data);

            setProposals(data.data);
        }
        catch (error)
        {
            console.error(error);
        }
    }

    const filteredProposals =
        proposals.filter((proposal) =>
            proposal.project.title
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    async function borrarPropuesta(id: string)
    {
        try
        {
            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/proposals/${id}`,
                {
                    method: "DELETE",

                    headers:
                    {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            if (response.ok)
            {
                setProposals(
                    proposals.filter(
                        (proposal) =>
                            proposal.id !== id
                    )
                );
            }
        }
        catch (error)
        {
            console.error(error);
        }
    }
    return (
        <div className="freelancer-page">

            <div className="freelancer-card">

                <h1>
                    Mis Propuestas
                </h1>

                {/* BUSCADOR */}
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

                {/* CARDS */}
                <div className="project-list">

                    {
                        filteredProposals.map((proposal) =>
                        (
                            <div
                                className="project-card"
                                key={proposal.id}
                            >

                                <h3>
                                    {proposal.project.title}
                                </h3>

                                <p>
                                    {proposal.description}
                                </p>

                                <div className="project-footer">

                                    <span>
                                        📁 {proposal.project.category}
                                    </span>

                                    <strong>
                                        Bs. {proposal.offeredPrice}
                                    </strong>

                                </div>

                                <div
                                    style={{
                                        marginTop: "10px",
                                    }}
                                >

                                    <strong>
                                        Estado:
                                    </strong>

                                    {" "}
                                    {proposal.status}

                                </div>

                                <div
                                    style={{
                                        marginTop: "10px",
                                    }}
                                >

                                    ⏱️ {proposal.estimatedDays}
                                    {" "}días

                                </div>

                                <div className="proposal-buttons">

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            borrarPropuesta(proposal.id)
                                        }
                                    >
                                        Borrar
                                    </button>

                                </div>

                            </div>
                        ))
                    }

                </div>

            </div>

        </div>
    );
}