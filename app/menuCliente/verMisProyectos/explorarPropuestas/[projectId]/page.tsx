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
        id: string;

        name: string;

        email?: string;
    };
};

export default function VerPropuestasPage()
{
    const router = useRouter();

    const params = useParams();

    const projectId =
        Array.isArray(params.projectId)
            ? params.projectId[0]
            : params.projectId;

    const [proposals, setProposals] =
        useState<Proposal[]>([]);

    const [search, setSearch] =
        useState("");

    useEffect(() =>
    {
        if (!projectId) return;

        obtenerPropuestas();
    }, [projectId]);

    async function obtenerPropuestas()
    {
        try
        {
            const token =
                localStorage.getItem("token");

            if (!token)
            {
                router.push("/login");
                return;
            }

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

            console.log(data);

            if (!response.ok)
            {
                alert(
                    data.message ||
                    data.messages?.[0]?.description ||
                    "No se pudieron cargar las propuestas"
                );

                return;
            }

            setProposals(data.data ?? data);
        }
        catch (error)
        {
            console.error(error);
            alert("Error al cargar las propuestas");
        }
    }

    async function aceptarPropuesta(proposalId: string)
{
    const confirmar = confirm(
        "Para continuar, esta propuesta será aceptada y luego pasarás a la pantalla de pago. ¿Deseas continuar?"
    );

    if (!confirmar)
    {
        return;
    }

    try
    {
        const token =
            localStorage.getItem("token");

        if (!token)
        {
            router.push("/login");
            return;
        }

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

        console.log("Respuesta aceptar propuesta:", data);

        if (response.ok)
        {
            router.push(
                `/menuCliente/verMisProyectos/pagar/${proposalId}`
            );
        }
        else
        {
            alert(
                data.message ||
                data.messages?.[0]?.description ||
                "No se pudo aceptar la propuesta"
            );
        }
    }
    catch (error)
    {
        console.error(error);
        alert("Error del servidor");
    }
}

    async function rechazarPropuesta(proposalId: string)
    {
        const confirmar = confirm(
            "¿Seguro que quieres rechazar esta propuesta?"
        );

        if (!confirmar)
        {
            return;
        }

        try
        {
            const token =
                localStorage.getItem("token");

            if (!token)
            {
                router.push("/login");
                return;
            }

            const response = await fetch(
                `http://localhost:3000/api/proposals/${proposalId}/reject`,
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
                alert("Propuesta rechazada correctamente");

                obtenerPropuestas();
            }
            else
            {
                alert(
                    data.message ||
                    data.messages?.[0]?.description ||
                    "No se pudo rechazar la propuesta"
                );
            }
        }
        catch (error)
        {
            console.error(error);
            alert("Error del servidor");
        }
    }

    function verPerfilFreelancer(freelancerId: string)
    {
        router.push(`/perfil/${freelancerId}`);
    }

    const filteredProposals =
        proposals.filter((proposal) =>
            proposal.description
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    return (
        <main className="propuestas-page">

            <section className="propuestas-hero">

                <div>

                    <span className="propuestas-badge">
                        Panel Cliente
                    </span>

                    <h1>
                        Propuestas Recibidas
                    </h1>

                    <p>
                        Revisa las propuestas enviadas por freelancers,
                        compara precios, tiempos estimados y elige la mejor opción.
                    </p>

                </div>

                <div className="propuestas-summary">

                    <span>
                        Total de propuestas
                    </span>

                    <strong>
                        {proposals.length}
                    </strong>

                    <p>
                        Freelancers interesados en este proyecto
                    </p>

                </div>

            </section>

            <section className="propuestas-content">

                <div className="propuestas-toolbar">

                    <div>
                        <h2>
                            Freelancers interesados
                        </h2>

                        <p>
                            Busca y evalúa las propuestas recibidas.
                        </p>
                    </div>

                    <span className="cliente-role">
                        Cliente
                    </span>

                </div>

                <input
                    type="text"
                    placeholder="Buscar propuestas por descripción..."
                    className="search-input"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <div className="proposal-list">

                    {
                        filteredProposals.length === 0
                        ? (
                            <div className="empty-proposals">

                                <h3>
                                    No se encontraron propuestas
                                </h3>

                                <p>
                                    Todavía no hay propuestas o la búsqueda no coincide con ningún resultado.
                                </p>

                                <button
                                    onClick={() =>
                                        router.back()
                                    }
                                >
                                    Volver a mis proyectos
                                </button>

                            </div>
                        )
                        : (
                            filteredProposals.map((proposal) =>
                            (
                                <div
                                    className="proposal-item"
                                    key={proposal.id}
                                >

                                    <div className="proposal-top">

                                        <div className="freelancer-avatar">
                                            {proposal.freelancer.name.charAt(0).toUpperCase()}
                                        </div>

                                        <div>
                                            <h2>
                                                {proposal.freelancer.name}
                                            </h2>

                                            <span className={`proposal-status ${proposal.status}`}>
                                                {proposal.status}
                                            </span>
                                        </div>

                                    </div>

                                    <p className="proposal-description">
                                        {proposal.description}
                                    </p>

                                    <div className="proposal-details">

                                        <div>
                                            <span>
                                                Tiempo estimado
                                            </span>

                                            <strong>
                                                {proposal.estimatedDays} días
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Precio ofertado
                                            </span>

                                            <strong className="price">
                                                Bs. {proposal.offeredPrice}
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="proposal-actions">

                                        <button
                                            className="profile-button"
                                            onClick={() =>
                                                verPerfilFreelancer(proposal.freelancer.id)
                                            }
                                        >
                                            Ver Perfil
                                        </button>

                                        {
                                            proposal.status === "pending" && (
                                                <>
                                                    <button
                                                        className="accept-button"
                                                        onClick={() =>
                                                            aceptarPropuesta(proposal.id)
                                                        }
                                                    >
                                                        Aceptar y pagar
                                                    </button>

                                                    <button
                                                        className="reject-button"
                                                        onClick={() =>
                                                            rechazarPropuesta(proposal.id)
                                                        }
                                                    >
                                                        Rechazar Propuesta
                                                    </button>
                                                </>
                                            )
                                        }

                                        {
                                            proposal.status === "accepted" && (
                                                <span className="accepted-message">
                                                    Propuesta aceptada
                                                </span>
                                            )
                                        }
                                        {
                                            proposal.status === "rejected" && (
                                                <span className="rejected-message">
                                                    Propuesta rechazada
                                                </span>
                                            )
                                        }
                                    </div>

                                </div>
                            ))
                        )
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

            </section>

        </main>
    );
}