"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import "./verProyecto.css";

type Project = {
    id: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    deadlineDays: number;
    status: "open" | "in_progress" | "completed" | "cancelled" | string;
    createdAt?: string;
    updatedAt?: string;
};

const API_URL = "http://localhost:3001/api";

export default function VerProyectoPage() {
    const router = useRouter();
    const params = useParams();

    const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

    const [project, setProject] = useState<Project | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [budget, setBudget] = useState("");
    const [deadlineDays, setDeadlineDays] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!projectId) return;
        obtenerProyecto();
    }, [projectId]);

    async function obtenerProyecto() {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(`${API_URL}/projects/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            console.log("Proyecto recibido:", data);

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.messages?.[0]?.description ||
                    "No se pudo obtener el proyecto."
                );
            }

            const projectData: Project = data.data ?? data;

            setProject(projectData);
            llenarFormulario(projectData);
        } catch (error) {
            console.error(error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Error al cargar el proyecto."
            );
        } finally {
            setLoading(false);
        }
    }

    function llenarFormulario(projectData: Project) {
        setTitle(projectData.title ?? "");
        setDescription(projectData.description ?? "");
        setCategory(projectData.category ?? "");
        setBudget(String(projectData.budget ?? ""));
        setDeadlineDays(String(projectData.deadlineDays ?? ""));
    }

    function puedeModificarProyecto() {
        if (!project) return false;

        return project.status === "open";
    }

    function mensajeBloqueo() {
        if (!project) return "";

        if (project.status === "in_progress") {
            return "Este proyecto ya está en progreso y no puede editarse ni cancelarse.";
        }

        if (project.status === "completed") {
            return "Este proyecto ya fue completado y no puede editarse ni cancelarse.";
        }

        if (project.status === "cancelled") {
            return "Este proyecto fue cancelado y no puede editarse.";
        }

        return "";
    }

    async function editarProyecto(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!project) return;

        if (!puedeModificarProyecto()) {
            setError(mensajeBloqueo());
            return;
        }

        if (!title.trim() || !description.trim() || !category.trim()) {
            setError("Todos los campos de texto son obligatorios.");
            return;
        }

        const budgetNumber = Number(budget);
        const deadlineNumber = Number(deadlineDays);

        if (Number.isNaN(budgetNumber) || budgetNumber < 1) {
            setError("El presupuesto debe ser mayor o igual a 1.");
            return;
        }

        if (Number.isNaN(deadlineNumber) || deadlineNumber < 1) {
            setError("Los días de plazo deben ser mayores o iguales a 1.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(`${API_URL}/projects/${project.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    category: category.trim(),
                    budget: budgetNumber,
                    deadlineDays: deadlineNumber,
                }),
            });

            const data = await response.json();

            console.log("Respuesta editar proyecto:", data);

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.messages?.[0]?.description ||
                    "No se pudo editar el proyecto."
                );
            }

            const updatedProject: Project = data.data ?? data;

            setProject(updatedProject);
            llenarFormulario(updatedProject);

            setMessage("Proyecto actualizado correctamente.");
        } catch (error) {
            console.error(error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Error al editar el proyecto."
            );
        } finally {
            setSaving(false);
        }
    }

    async function cancelarProyecto() {
        if (!project) return;

        if (!puedeModificarProyecto()) {
            setError(mensajeBloqueo());
            return;
        }

        const confirmar = window.confirm(
            "¿Seguro que quieres cancelar este proyecto? Las propuestas pendientes serán rechazadas."
        );

        if (!confirmar) return;

        try {
            setCancelling(true);
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(`${API_URL}/projects/${project.id}/cancelar`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            console.log("Respuesta cancelar proyecto:", data);

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.messages?.[0]?.description ||
                    "No se pudo cancelar el proyecto."
                );
            }

            const cancelledProject: Project = data.data ?? data;

            setProject(cancelledProject);
            llenarFormulario(cancelledProject);

            setMessage("Proyecto cancelado correctamente.");
        } catch (error) {
            console.error(error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Error al cancelar el proyecto."
            );
        } finally {
            setCancelling(false);
        }
    }

    function textoEstado(status: string) {
        switch (status) {
            case "open":
                return "Abierto";
            case "in_progress":
                return "En progreso";
            case "completed":
                return "Completado";
            case "cancelled":
                return "Cancelado";
            default:
                return status;
        }
    }

    if (loading) {
            return (
            <main className="ver-proyecto-page">
                <section className="ver-proyecto-card">
                    <p>Cargando proyecto...</p>
                </section>
            </main>
        );
    }

    if (!project) {
        return (
            <main className="ver-proyecto-page">
                <section className="ver-proyecto-card">
                    <h1>No se encontró el proyecto</h1>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        className="back-button"
                        onClick={() => router.push("/menuCliente/verMisProyectos")}
                    >
                        ← Volver a mis proyectos
                    </button>
                </section>
            </main>
        );
    }


    const disabled = !puedeModificarProyecto() || saving || cancelling;

    return (
        <main className="ver-proyecto-page">
        <section className="ver-proyecto-container">
            <button
                className="back-button"
                onClick={() => router.push("/menuCliente/verMisProyectos")}
            >
                ← Volver a mis proyectos
            </button>

            <section className="ver-proyecto-header">
                <span className={`project-status status-${project.status}`}>
                    {textoEstado(project.status)}
                </span>

                <h1>Ver / Editar Proyecto</h1>

                <p>
                    Aquí puedes revisar la información de tu proyecto y editarla
                    mientras siga abierto.
                </p>
            </section>

            {mensajeBloqueo() && (
                <div className="warning-message">
                    {mensajeBloqueo()}
                </div>
            )}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form onSubmit={editarProyecto} className="ver-proyecto-form">
                <div className="form-group">
                    <label>Título</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={disabled}
                        maxLength={100}
                        placeholder="Ejemplo: Página web para negocio"
                    />
                </div>

                <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={disabled}
                        placeholder="Describe qué necesitas para tu proyecto..."
                    />
                </div>

                <div className="form-group">
                    <label>Categoría</label>
                    <input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={disabled}
                        placeholder="Ejemplo: Desarrollo Web"
                    />
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label>Presupuesto</label>
                        <input
                            type="number"
                            min="1"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            disabled={disabled}
                            placeholder="Ejemplo: 500"
                        />
                    </div>

                    <div className="form-group">
                        <label>Días de plazo</label>
                        <input
                            type="number"
                            min="1"
                            value={deadlineDays}
                            onChange={(e) => setDeadlineDays(e.target.value)}
                            disabled={disabled}
                            placeholder="Ejemplo: 15"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="save-button"
                        disabled={disabled}
                    >
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </button>

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={cancelarProyecto}
                        disabled={disabled}
                    >
                        {cancelling ? "Cancelando..." : "Cancelar proyecto"}
                    </button>
                </div>
            </form>
        </section>
    </main>
);
}