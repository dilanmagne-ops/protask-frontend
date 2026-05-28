"use client";

import "./explorarPropuestas.css";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

type Proposal =
{
    id: string;

    offeredPrice: number;

    estimatedDays: number;

    description: string;

    status: string;

    freelancer:
    {
        name: string;
    };
};

export default function VerPropuestasPage()
{
    const router = useRouter();

    const params = useParams();

    const projectId =
        params.projectId;

    const [proposals, setProposals] =
        useState<Proposal[]>([]);

    const [search, setSearch] =
        useState("");

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
                `http://localhost:3000/api/proposals/project/${projectId}`,
                {
                    headers:
                    {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

            console.log(JSON.stringify(data.data[0], null, 2));

            setProposals(data.data);
        }
        catch (error)
        {
            console.error(error);
        }
    }
    async function aceptarPropuesta(proposalId: string)
    {
        try
        {
            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/proposals/${proposalId}/accept`,
                {
                    method: "PATCH",

                    headers:
                    {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

            console.log(data);

            if (response.ok)
            {
                alert("Propuesta aceptada correctamente");

                obtenerPropuestas();
            }
            else
            {
                alert(data.messages?.[0]?.description);
            }
        }
        catch (error)
        {
            console.error(error);
        }
    }
    const filteredProposals =
        proposals.filter((proposal) =>
            proposal.description
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    return (
        <div className="misproyectos-container">

            <div className="misproyectos-card">

                <h1>
                    Propuestas Recibidas
                </h1>

                <div className="misproyectos-header">

                    <span>
                        Freelancers interesados
                    </span>

                    <span className="cliente-role">
                        Cliente
                    </span>

                </div>

                <input
                    type="text"
                    placeholder="Buscar propuestas..."
                    className="search-input"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <div className="project-list">

                    {
                        filteredProposals.map((proposal) =>
                        (
                            <div
                                className="project-item"
                                key={proposal.id}
                            >
                                <h2>
                                    {proposal.freelancer.name}
                                </h2>
                                <p>
                                    {proposal.description}
                                </p>

                                <div className="project-footer">

                                    <span>
                                        ⏳ {proposal.estimatedDays} días
                                    </span>

                                    <span className="price">
                                        Bs. {proposal.offeredPrice}
                                    </span>

                                </div>
                                <p>
                                    Estado: {proposal.status}
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        marginTop: "15px",
                                        flexWrap: "wrap",
                                    }}
                                >

                                    <button>
                                        Ver Perfil
                                    </button>

                                    <button
                                    onClick={() => aceptarPropuesta(proposal.id)}
                                    >
                                        Aceptar
                                    </button>

                                </div>

                            </div>
                        ))
                    }

                </div>

                <button
                    className="back-button"

                    onClick={() =>
                        router.back()
                    }
                >
                    Volver
                </button>

            </div>

        </div>
    );
}