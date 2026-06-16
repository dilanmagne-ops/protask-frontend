"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "./verTrabajo.css";

type Project = {
    id: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    deadlineDays: number;
    status: string;
};

type Proposal = {
    id: string;
    offeredPrice: number;
    estimatedDays: number;
    description: string;
    status: string;
    createdAt?: string;
    project: Project;
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

const API_URL = "http://localhost:3000/api";

export default function VerTrabajoPage() {
    const router = useRouter();
    const params = useParams();

    const idParam = params.id;
    const proposalId = Array.isArray(idParam) ? idParam[0] : idParam;

    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);

    const [comment, setComment] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [fileInputKey, setFileInputKey] = useState(0);

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const pendingDelivery = useMemo(() => {
        return deliveries.find((delivery) => delivery.status === "pendiente_revision");
    }, [deliveries]);

    const lastDelivery = deliveries[0];

    useEffect(() => {
        if (!proposalId) return;
        cargarDatos();
    }, [proposalId]);

    async function cargarDatos() {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const proposalResponse = await fetch(
                `${API_URL}/proposals/${proposalId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const proposalData = await proposalResponse.json();

            if (!proposalResponse.ok) {
                throw new Error(proposalData.message || "No se pudo cargar el trabajo.");
            }

            const proposalResult = proposalData.data ?? proposalData;
            setProposal(proposalResult);

            const deliveriesResponse = await fetch(
                `${API_URL}/deliveries/proposal/${proposalId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const deliveriesData = await deliveriesResponse.json();

            if (deliveriesResponse.ok) {
                setDeliveries(deliveriesData.data ?? []);
            }
        } catch (error) {
            console.error(error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al cargar la información."
            );
        } finally {
            setLoading(false);
        }
    }

    function seleccionarArchivo(event: ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            setFile(null);
            return;
        }

        console.log("Archivo seleccionado:", selectedFile.name);
        console.log("Tipo MIME:", selectedFile.type);

        const maxSize = 10 * 1024 * 1024;

        const extension = selectedFile.name
            .split(".")
            .pop()
            ?.toLowerCase();

        const extensionesPermitidas = ["jpg", "jpeg", "png", "pdf", "zip"];

        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "application/pdf",
            "application/zip",
            "application/x-zip-compressed",
            "application/octet-stream",
            "",
        ];

        const extensionValida = extension
            ? extensionesPermitidas.includes(extension)
            : false;

        const tipoValido = tiposPermitidos.includes(selectedFile.type);

        if (!extensionValida && !tipoValido) {
            alert("Tipo de archivo no permitido. Usa JPG, PNG, PDF o ZIP.");
            event.target.value = "";
            setFile(null);
            return;
        }

        if (selectedFile.size > maxSize) {
            alert("El archivo no puede superar los 10 MB.");
            event.target.value = "";
            setFile(null);
            return;
        }

        setFile(selectedFile);
        }

    async function enviarEntrega(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!proposalId) return;

        if (!comment.trim()) {
            alert("Debes escribir un comentario de entrega.");
            return;
        }

        if (!file) {
            alert("Debes seleccionar un archivo para la entrega.");
            return;
        }

        try {
            setSending(true);
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const formData = new FormData();
            formData.append("proposalId", proposalId);
            formData.append("comment", comment.trim());
            formData.append("files", file);

            const response = await fetch(`${API_URL}/deliveries`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            console.log("STATUS:", response.status);
            console.log("RESPUESTA BACKEND:", data);

            if (!response.ok) {
                let backendMessage = "No se pudo subir la entrega.";

                if (Array.isArray(data.message)) {
                    backendMessage = data.message.join(", ");
                } else if (typeof data.message === "string") {
                    backendMessage = data.message;
                } else if (data.messages?.[0]?.description) {
                    backendMessage = data.messages[0].description;
                } else if (data.error) {
                    backendMessage = data.error;
                }

                throw new Error(backendMessage);
            }

            setMessage(data.message || "Entrega subida correctamente.");
            setComment("");
            setFile(null);
            setFileInputKey((prev) => prev + 1);

            await cargarDatos();
        } catch (error) {
            console.error(error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al subir la entrega."
            );
        } finally {
            setSending(false);
        }
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
            <div className="vertrabajo-page">
                <div className="vertrabajo-card">
                    <p>Cargando trabajo...</p>
                </div>
            </div>
        );
    }

    if (error && !proposal) {
        return (
            <div className="vertrabajo-page">
                <div className="vertrabajo-card">
                    <button
                        className="back-button"
                        onClick={() => router.push("/menuFreelancer/verMisTrabajos")}
                    >
                        ← Volver
                    </button>

                    <h2>No se pudo cargar el trabajo</h2>
                    <p className="error-message">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="vertrabajo-page">
            <main className="vertrabajo-container">
                <section className="vertrabajo-header">
                    <button
                        className="back-button"
                        onClick={() => router.push("/menuFreelancer/verMisTrabajos")}
                    >
                        ← Volver
                    </button>

                    <span className="vertrabajo-badge">Trabajo aceptado</span>
                    <h1>{proposal?.project.title}</h1>
                    <p>{proposal?.project.description}</p>
                </section>

                <section className="vertrabajo-grid">
                    <div className="vertrabajo-card">
                        <h2>Información del Proyecto</h2>

                        <div className="info-list">
                            <div>
                                <span>Categoría</span>
                                <strong>{proposal?.project.category}</strong>
                            </div>

                            <div>
                                <span>Presupuesto del cliente</span>
                                <strong>Bs. {proposal?.project.budget}</strong>
                            </div>

                            <div>
                                <span>Tu precio acordado</span>
                                <strong>Bs. {proposal?.offeredPrice}</strong>
                            </div>

                            <div>
                                <span>Tiempo estimado</span>
                                <strong>{proposal?.estimatedDays} días</strong>
                            </div>

                            <div>
                                <span>Estado del proyecto</span>
                                <strong>{proposal?.project.status}</strong>
                            </div>

                            <div>
                                <span>Estado de tu propuesta</span>
                                <strong>{proposal?.status}</strong>
                            </div>
                        </div>

                        <div className="proposal-description">
                            <h3>Tu propuesta</h3>
                            <p>{proposal?.description}</p>
                        </div>
                    </div>

                    <div className="vertrabajo-card entrega-card">
                        <h2>Realizar Entrega</h2>

                        {pendingDelivery && (
                            <div className="warning-box">
                                Ya tienes una entrega pendiente de revisión. Espera a que el cliente la apruebe o solicite cambios.
                            </div>
                        )}

                        {lastDelivery?.status === "revision_solicitada" && (
                            <div className="revision-box">
                                <strong>El cliente solicitó revisión:</strong>
                                <p>{lastDelivery.revisionComment}</p>
                            </div>
                        )}

                        {message && <div className="success-message">{message}</div>}
                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={enviarEntrega} className="entrega-form">
                            <label>Archivo de entrega</label>

                            <div className="file-box">
                                <span className="file-icon">📁</span>

                                <input
                                    key={fileInputKey}
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf,.zip,application/zip,application/x-zip-compressed"
                                    onChange={seleccionarArchivo}
                                    disabled={sending || Boolean(pendingDelivery)}
                                />

                                <small>JPG, PNG, PDF o ZIP. Máximo 10 MB.</small>
                            </div>

                            {file && (
                                <div className="selected-file">
                                    <span>{file.name}</span>
                                    <strong>{formatearBytes(file.size)}</strong>
                                </div>
                            )}

                            <label>Comentarios de entrega</label>

                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Describe qué has completado y cómo probarlo..."
                                disabled={sending || Boolean(pendingDelivery)}
                            />

                            <button
                                type="submit"
                                className="submit-delivery-btn"
                                disabled={sending || Boolean(pendingDelivery)}
                            >
                                {sending ? "Subiendo entrega..." : "Marcar como listo para revisión"}
                            </button>
                        </form>
                    </div>
                </section>

                <section className="vertrabajo-card historial-card">
                    <h2>Historial de Entregas</h2>

                    {deliveries.length === 0 ? (
                        <p className="empty-text">Todavía no realizaste entregas para este trabajo.</p>
                    ) : (
                        <div className="deliveries-list">
                            {deliveries.map((delivery) => (
                                <div className="delivery-item" key={delivery.id}>
                                    <div className="delivery-item-header">
                                        <strong>Entrega #{delivery.version}</strong>
                                        <span className={`status-pill status-${delivery.status}`}>
                                            {textoEstado(delivery.status)}
                                        </span>
                                    </div>

                                    <p>{delivery.comment}</p>

                                    {delivery.revisionComment && (
                                        <div className="revision-comment">
                                            <strong>Comentario del cliente:</strong>
                                            <p>{delivery.revisionComment}</p>
                                        </div>
                                    )}

                                    <div className="delivery-files">
                                        {delivery.files.map((deliveryFile) => (
                                            <div className="delivery-file" key={deliveryFile.id}>
                                                <span>📎 {deliveryFile.originalName}</span>
                                                <small>{formatearBytes(deliveryFile.size)}</small>
                                            </div>
                                        ))}
                                    </div>

                                    <small className="delivery-date">
                                        Subido el {formatearFecha(delivery.createdAt)}
                                    </small>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}