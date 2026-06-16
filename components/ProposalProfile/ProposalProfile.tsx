"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./ProposalProfile.css";

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
    freelancer?: {
        id: string;
        name: string;
        email: string;
    };
};

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

type ProposalProfileProps = {
    proposalId: string;
};

export default function ProposalProfile({ proposalId }: ProposalProfileProps) {
    const router = useRouter();

    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const userGuardado = localStorage.getItem("user");

        if (!userGuardado) {
            router.push("/login");
            return;
        }

        const userParseado = JSON.parse(userGuardado);
        setUser(userParseado);

        obtenerPropuesta();
    }, [proposalId]);

    async function obtenerPropuesta() {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(
                `http://localhost:3001/api/proposals/${proposalId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "No se pudo cargar la propuesta"
                );
            }

            const propuestaBase = data.data ?? data;

            const propuestaGuardada = localStorage.getItem(
                `proposalEdit:${proposalId}`
            );

            const estadoGuardado = localStorage.getItem(
                `proposalStatus:${proposalId}`
            );

            const propuestaFinal = {
                ...propuestaBase,
                ...(propuestaGuardada ? JSON.parse(propuestaGuardada) : {}),
                ...(estadoGuardado ? { status: estadoGuardado } : {}),
            };

            setProposal(propuestaFinal);
        } catch (error) {
            console.error(error);
            setError("No se pudo cargar la propuesta.");
        } finally {
            setLoading(false);
        }
    }

    function editarPropuesta() {
        router.push(`/menuFreelancer/misPropuestas/editar/${proposalId}`);
    }

    async function retirarPropuesta()
    {
        const confirmar = confirm(
            "¿Seguro que quieres retirar esta propuesta? Se eliminará definitivamente."
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
                `http://localhost:3001/api/proposals/${proposalId}`,
                {
                    method: "DELETE",
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
                alert("Propuesta retirada correctamente");

                router.push("/menuFreelancer/misPropuestas");
            }
            else
            {
                alert(
                    data.message ||
                    data.messages?.[0]?.description ||
                    "No se pudo retirar la propuesta"
                );
            }
        }
        catch (error)
        {
            console.error(error);
            alert("Error al retirar la propuesta");
        }
    }

    function aceptarPropuesta() {
        localStorage.setItem(
            `proposalStatus:${proposalId}`,
            "accepted"
        );

        setProposal((prevProposal) =>
            prevProposal
                ? {
                    ...prevProposal,
                    status: "accepted",
                }
                : prevProposal
        );

        alert("Propuesta aceptada en el frontend.");
    }

    function rechazarPropuesta() {
        const confirmar = confirm(
            "¿Seguro que quieres rechazar esta propuesta?"
        );

        if (!confirmar) {
            return;
        }

        localStorage.setItem(
            `proposalStatus:${proposalId}`,
            "rejected"
        );

        setProposal((prevProposal) =>
            prevProposal
                ? {
                    ...prevProposal,
                    status: "rejected",
                }
                : prevProposal
        );

        alert("Propuesta rechazada en el frontend.");
    }

    if (loading) {
        return (
            <section className="proposal-profile-page">
                <div className="proposal-profile-card">
                    <p>Cargando propuesta...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="proposal-profile-page">
                <div className="proposal-profile-card">
                    <button
                        className="back-button"
                        onClick={() => router.back()}
                    >
                        ← Volver
                    </button>

                    <h2>Error</h2>
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    if (!proposal) {
        return (
            <section className="proposal-profile-page">
                <div className="proposal-profile-card">
                    <button
                        className="back-button"
                        onClick={() => router.back()}
                    >
                        ← Volver
                    </button>

                    <h2>No se encontró la propuesta.</h2>
                </div>
            </section>
        );
    }

    if (proposal.status === "rejected") {
        return (
            <section className="proposal-profile-page">
                <div className="proposal-profile-card">
                    <button
                        className="back-button"
                        onClick={() => router.back()}
                    >
                        ← Volver
                    </button>

                    <h2>Propuesta rechazada o retirada</h2>

                    <p>
                        Esta propuesta ya no está disponible para edición.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="proposal-profile-page">

            <div className="proposal-profile-card">

                <button
                    className="back-button"
                    onClick={() => router.back()}
                >
                    ← Volver
                </button>

                <span className={`proposal-status ${proposal.status}`}>
                    Estado: {proposal.status}
                </span>

                <h1>{proposal.project.title}</h1>

                <p className="proposal-description">
                    {proposal.description}
                </p>

                <div className="proposal-profile-grid">

                    <div>
                        <span>Categoría</span>
                        <strong>{proposal.project.category}</strong>
                    </div>

                    <div>
                        <span>Precio ofrecido</span>
                        <strong>Bs. {proposal.offeredPrice}</strong>
                    </div>

                    <div>
                        <span>Tiempo estimado</span>
                        <strong>{proposal.estimatedDays} días</strong>
                    </div>

                    <div>
                        <span>Presupuesto del proyecto</span>
                        <strong>Bs. {proposal.project.budget}</strong>
                    </div>

                    <div>
                        <span>Estado del proyecto</span>
                        <strong>{proposal.project.status}</strong>
                    </div>

                    <div>
                        <span>Duración esperada</span>
                        <strong>{proposal.project.deadlineDays} días</strong>
                    </div>

                </div>

                <div className="proposal-project-section">
                    <h3>Descripción del proyecto</h3>
                    <p>{proposal.project.description}</p>
                </div>

                {
                    proposal.freelancer && (
                        <div className="proposal-project-section">
                            <h3>Freelancer</h3>
                            <p>{proposal.freelancer.name}</p>
                            <p>{proposal.freelancer.email}</p>
                        </div>
                    )
                }

                <div className="proposal-actions">

                    {
                        user?.role === "freelancer" &&
                        proposal.status === "pending" && (
                            <>
                                <button
                                    className="edit-btn"
                                    onClick={editarPropuesta}
                                >
                                    Editar propuesta
                                </button>

                                <button
                                    className="reject-btn"
                                    onClick={retirarPropuesta}
                                >
                                    Retirar propuesta
                                </button>
                            </>
                        )
                    }

                    {
                        user?.role === "cliente" &&
                        proposal.status === "pending" && (
                            <>
                                <button
                                    className="accept-btn"
                                    onClick={aceptarPropuesta}
                                >
                                    Aceptar propuesta
                                </button>

                                <button
                                    className="reject-btn"
                                    onClick={rechazarPropuesta}
                                >
                                    Rechazar propuesta
                                </button>
                            </>
                        )
                    }

                    {
                        proposal.status === "accepted" && (
                            <p className="accepted-message">
                                Esta propuesta ya fue aceptada.
                            </p>
                        )
                    }

                </div>

            </div>

        </section>
    );
}