"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "./calificarCliente.css";

type UserBasic = {
    id: string;
    name: string;
    email?: string;
};

type Project = {
    id: string;
    title: string;
    client?: UserBasic;
};

type Freelancer = {
    id: string;
    name: string;
    email?: string;
};

type Proposal = {
    id: string;
    project: Project;
    freelancer?: Freelancer;
};

type Review = {
    id: string;
    proposalId: string;
    reviewer: {
        id: string;
        name: string;
    };
    reviewed: {
        id: string;
        name: string;
    };
    rating: number;
    comment?: string;
    reviewerRole: string;
    createdAt: string;
};

const API_URL = "http://localhost:3000/api";

export default function CalificarClientePage() {
    const router = useRouter();
    const params = useParams();

    const proposalId = Array.isArray(params.proposalId)
        ? params.proposalId[0]
        : params.proposalId;

    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!proposalId) return;
        cargarDatos();
    }, [proposalId]);

    async function cargarDatos() {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");
            const userStorage = localStorage.getItem("user");

            if (!token) {
                router.push("/login");
                return;
            }

            const currentUser = userStorage ? JSON.parse(userStorage) : null;

            const proposalResponse = await fetch(`${API_URL}/proposals/${proposalId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const proposalData = await proposalResponse.json();

            if (!proposalResponse.ok) {
                throw new Error(
                    proposalData.message ||
                    proposalData.messages?.[0]?.description ||
                    "No se pudo cargar la propuesta."
                );
            }

            setProposal(proposalData.data ?? proposalData);

            const reviewsResponse = await fetch(`${API_URL}/reviews/proposal/${proposalId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const reviewsData = await reviewsResponse.json();

            if (reviewsResponse.ok) {
                const reviews: Review[] = reviewsData.data ?? [];

                const userAlreadyReviewed = reviews.some(
                    (review) => review.reviewer?.id === currentUser?.id
                );

                setAlreadyReviewed(userAlreadyReviewed);
            }
        } catch (error) {
            console.error(error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al cargar la pantalla."
            );
        } finally {
            setLoading(false);
        }
    }

    async function enviarReview(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!proposalId) return;

        try {
            setSending(true);
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(`${API_URL}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    proposalId,
                    rating,
                    comment: comment.trim() || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.messages?.[0]?.description ||
                    data.error ||
                    "No se pudo registrar la calificación."
                );
            }

            setMessage(
                data.message ||
                data.messages?.[0]?.description ||
                "Cliente calificado exitosamente."
            );

            setAlreadyReviewed(true);
        } catch (error) {
            console.error(error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al enviar la calificación."
            );
        } finally {
            setSending(false);
        }
    }

    function volver() {
        router.push(`/menuFreelancer/verMisTrabajos/${proposalId}`);
    }

    if (loading) {
        return (
            <main className="review-page">
                <section className="review-card">
                    <p>Cargando calificación...</p>
                </section>
            </main>
        );
    }

    return (
        <main className="review-page">
            <section className="review-card">
                <button className="back-button" onClick={volver}>
                    ← Volver
                </button>

                <span className="review-badge">Calificación final</span>

                <h1>Calificar Cliente</h1>

                <p className="review-subtitle">
                    Evalúa tu experiencia trabajando con este cliente.
                </p>

                {proposal && (
                    <div className="project-box">
                        <span>Proyecto</span>
                        <strong>{proposal.project?.title}</strong>

                        {proposal.project?.client ? (
                            <small>
                                Cliente: {proposal.project.client.name}
                                {proposal.project.client.email
                                    ? ` - ${proposal.project.client.email}`
                                    : ""}
                            </small>
                        ) : (
                            <small>Cliente: No disponible</small>
                        )}
                    </div>
                )}

                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                {alreadyReviewed ? (
                    <div className="already-box">
                        Ya registraste tu calificación para esta propuesta.
                    </div>
                ) : (
                    <form className="review-form" onSubmit={enviarReview}>
                        <label>Puntuación</label>

                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={value <= rating ? "star active" : "star"}
                                    onClick={() => setRating(value)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        <label>Comentario</label>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Ejemplo: Fue claro con los requisitos, respondió a tiempo y mantuvo buena comunicación..."
                            maxLength={1000}
                        />

                        <button
                            type="submit"
                            className="submit-review-button"
                            disabled={sending}
                        >
                            {sending ? "Enviando calificación..." : "Enviar calificación"}
                        </button>
                    </form>
                )}
            </section>
        </main>
    );
}