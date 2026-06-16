"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "./verAvance.css";

type Project = {
    id: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    deadlineDays: number;
    status: string;
};

type Freelancer = {
    id: string;
    name: string;
    email: string;
};

type Proposal = {
    id: string;
    offeredPrice: number;
    estimatedDays: number;
    description: string;
    status: string;
    freelancer: Freelancer;
};

type DeliveryFile = {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    uploadedAt: string;
};

type Delivery = {
    id: string;
    comment: string;
    status: string;
    revisionComment?: string;
    version: number;
    proposalId: string;
    freelancerId: string;
    freelancerName: string;
    files: DeliveryFile[];
    createdAt: string;
    updatedAt: string;
};

const API_URL = "http://localhost:3001/api";
const BACKEND_URL = "http://localhost:3000";

export default function VerAvancePage() {
    const router = useRouter();
    const params = useParams();

    const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

    const [project, setProject] = useState<Project | null>(null);
    const [acceptedProposal, setAcceptedProposal] = useState<Proposal | null>(null);
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [revisionComments, setRevisionComments] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!projectId) return;
        cargarAvances();
    }, [projectId]);

    async function cargarAvances() {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const projectResponse = await fetch(`${API_URL}/projects/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const projectData = await projectResponse.json();

            if (!projectResponse.ok) {
                throw new Error(
                    projectData.message ||
                    projectData.messages?.[0]?.description ||
                    "No se pudo cargar el proyecto."
                );
            }

            const projectResult = projectData.data ?? projectData;
            setProject(projectResult);

            const proposalsResponse = await fetch(
                `${API_URL}/proposals/project/${projectId}?page=1&limit=50`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const proposalsData = await proposalsResponse.json();

            if (!proposalsResponse.ok) {
                throw new Error(
                    proposalsData.message ||
                    proposalsData.messages?.[0]?.description ||
                    "No se pudieron cargar las propuestas del proyecto."
                );
            }

            const proposals: Proposal[] = proposalsData.data ?? [];
            const accepted = proposals.find((proposal) => proposal.status === "accepted");

            setAcceptedProposal(accepted ?? null);

            if (!accepted) {
                setDeliveries([]);
                return;
            }

            const deliveriesResponse = await fetch(
                `${API_URL}/deliveries/proposal/${accepted.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const deliveriesData = await deliveriesResponse.json();

            if (!deliveriesResponse.ok) {
                throw new Error(
                    deliveriesData.message ||
                    deliveriesData.messages?.[0]?.description ||
                    "No se pudieron cargar las entregas."
                );
            }

            setDeliveries(deliveriesData.data ?? []);
        } catch (error) {
            console.error(error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al cargar los avances."
            );
        } finally {
            setLoading(false);
        }
    }

    async function aprobarEntrega(deliveryId: string) {
        const confirmar = confirm(
            "¿Seguro que quieres aprobar esta entrega? Al aprobarla se liberará el pago al freelancer."
        );

        if (!confirmar) return;

        try {
            setActionLoading(true);
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(`${API_URL}/deliveries/${deliveryId}/approve`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            console.log("Respuesta aprobar entrega:", data);
            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.messages?.[0]?.description ||
                    "No se pudo aprobar la entrega."
                );
            }

            const mensajeExito =
            data.messages?.[0]?.description ||
            data.message ||
            "Entrega aprobada y pago liberado correctamente.";

            if (acceptedProposal?.id) {
                router.push(
                    `/menuCliente/verMisProyectos/calificarFreelancer/${acceptedProposal.id}`
                );
                return;
            }

            await cargarAvances();
            setMessage(mensajeExito);

        } catch (error) {
            console.error(error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al aprobar la entrega."
            );
        } finally {
            setActionLoading(false);
        }
    }

    async function solicitarRevision(deliveryId: string) {
        const revisionComment = revisionComments[deliveryId]?.trim();

        if (!revisionComment) {
            alert("Debes escribir un comentario indicando qué debe corregir el freelancer.");
            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(
                `${API_URL}/deliveries/${deliveryId}/request-revision`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        revisionComment,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.messages?.[0]?.description ||
                    "No se pudo solicitar la revisión."
                );
            }

            setMessage(
                data.messages?.[0]?.description ||
                "Solicitud de revisión enviada correctamente."
            );

            setRevisionComments((prev) => ({
                ...prev,
                [deliveryId]: "",
            }));

            await cargarAvances();
        } catch (error) {
            console.error(error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al solicitar revisión."
            );
        } finally {
            setActionLoading(false);
        }
    }

    function cambiarComentarioRevision(deliveryId: string, value: string) {
        setRevisionComments((prev) => ({
            ...prev,
            [deliveryId]: value,
        }));
    }

    function formatearFecha(fecha: string) {
        if (!fecha) return "Sin fecha";

        return new Date(fecha).toLocaleString("es-BO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function formatearBytes(size: number) {
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / 1024 / 1024).toFixed(1)} MB`;
    }

    function textoEstado(status: string) {
        switch (status) {
            case "pendiente_revision":
                return "Pendiente de revisión";
            case "aprobado":
                return "Aprobado";
            case "rechazado":
                return "Rechazado";
            case "revision_solicitada":
                return "Revisión solicitada";
            default:
                return status;
        }
    }

    if (loading) {
        return (
            <main className="ver-avance-page">
                <section className="ver-avance-card">
                    <p>Cargando avances...</p>
                </section>
            </main>
        );
    }

    return (
        <main className="ver-avance-page">
            <section className="ver-avance-container">
                <button
                    className="back-button"
                    onClick={() => router.push("/menuCliente/verMisProyectos")}
                >
                    ← Volver a mis proyectos
                </button>

                <section className="ver-avance-header">
                    <span className="avance-badge">Revisión de avances</span>

                    <h1>{project?.title ?? "Avance del Proyecto"}</h1>

                    <p>
                        Aquí puedes revisar las entregas enviadas por el freelancer,
                        aprobar el trabajo o solicitar correcciones.
                    </p>
                </section>

                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <section className="ver-avance-grid">
                    <article className="ver-avance-card">
                        <h2>Información del Proyecto</h2>

                        <div className="info-list">
                            <div>
                                <span>Categoría</span>
                                <strong>{project?.category ?? "Sin categoría"}</strong>
                            </div>

                            <div>
                                <span>Presupuesto</span>
                                <strong>Bs. {project?.budget ?? 0}</strong>
                            </div>

                            <div>
                                <span>Plazo</span>
                                <strong>{project?.deadlineDays ?? 0} días</strong>
                            </div>

                            <div>
                                <span>Estado</span>
                                <strong>{project?.status ?? "Sin estado"}</strong>
                            </div>
                        </div>

                        <div className="project-description">
                            <h3>Descripción</h3>
                            <p>{project?.description}</p>
                        </div>
                    </article>

                    <article className="ver-avance-card">
                        <h2>Freelancer Asignado</h2>

                        {!acceptedProposal ? (
                            <p className="empty-text">
                                Este proyecto todavía no tiene una propuesta aceptada.
                            </p>
                        ) : (
                            <>
                                <div className="freelancer-box">
                                    <span>Freelancer</span>
                                    <strong>{acceptedProposal.freelancer?.name}</strong>
                                    <small>{acceptedProposal.freelancer?.email}</small>
                                </div>

                                <div className="info-list single">
                                    <div>
                                        <span>Precio acordado</span>
                                        <strong>Bs. {acceptedProposal.offeredPrice}</strong>
                                    </div>

                                    <div>
                                        <span>Tiempo estimado</span>
                                        <strong>{acceptedProposal.estimatedDays} días</strong>
                                    </div>
                                </div>

                                <div className="project-description">
                                    <h3>Propuesta aceptada</h3>
                                    <p>{acceptedProposal.description}</p>
                                </div>
                            </>
                        )}
                    </article>
                </section>

                <section className="ver-avance-card avances-card">
                    <h2>Historial de Entregas</h2>

                    {!acceptedProposal ? (
                        <p className="empty-text">
                            Para ver avances primero debes aceptar una propuesta.
                        </p>
                    ) : deliveries.length === 0 ? (
                        <p className="empty-text">
                            El freelancer todavía no realizó ninguna entrega.
                        </p>
                    ) : (
                        <div className="deliveries-list">
                            {deliveries.map((delivery, index) => (
                                <article className="delivery-item" key={delivery.id}>
                                    <div className="delivery-header">
                                        <div>
                                            <h3>Entrega #{deliveries.length - index}</h3>
                                            <small>
                                                Enviado por {delivery.freelancerName} ·{" "}
                                                {formatearFecha(delivery.createdAt)}
                                            </small>
                                        </div>

                                        <span className={`status-pill status-${delivery.status}`}>
                                            {textoEstado(delivery.status)}
                                        </span>
                                    </div>

                                    <div className="delivery-comment">
                                        <h4>Comentario del freelancer</h4>
                                        <p>{delivery.comment}</p>
                                    </div>

                                    {delivery.files.length > 0 && (
                                        <div className="delivery-files">
                                            <h4>Archivo entregado</h4>

                                            {delivery.files.map((file) => (
                                                <div className="delivery-file" key={file.id}>
                                                    <div>
                                                        <strong>📎 {file.originalName}</strong>
                                                        <small>{formatearBytes(file.size)}</small>
                                                    </div>

                                                    <a
                                                        href={`${BACKEND_URL}${file.url}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        Ver archivo
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {delivery.revisionComment && (
                                        <div className="revision-comment">
                                            <h4>Comentario de revisión</h4>
                                            <p>{delivery.revisionComment}</p>
                                        </div>
                                    )}

                                    {delivery.status === "pendiente_revision" && (
                                        <div className="review-actions">
                                            <button
                                                className="approve-button"
                                                onClick={() => aprobarEntrega(delivery.id)}
                                                disabled={actionLoading}
                                            >
                                                Aprobar y liberar pago
                                            </button>

                                            <div className="revision-form">
                                                <textarea
                                                    value={revisionComments[delivery.id] ?? ""}
                                                    onChange={(e) =>
                                                        cambiarComentarioRevision(
                                                            delivery.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Escribe qué debe corregir o mejorar el freelancer..."
                                                    disabled={actionLoading}
                                                />

                                                <button
                                                    className="revision-button"
                                                    onClick={() => solicitarRevision(delivery.id)}
                                                    disabled={actionLoading}
                                                >
                                                    Solicitar revisión
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}