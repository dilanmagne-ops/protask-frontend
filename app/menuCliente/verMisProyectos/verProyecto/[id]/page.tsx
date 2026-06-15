"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

type Project =
{
    id: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    deadlineDays: number;
    status: string;
};

export default function VerProyectoPage()
{
    const router = useRouter();
    const params = useParams();

    const projectId =
        Array.isArray(params.id)
        ? params.id[0]
        : params.id;

    const [project, setProject] = useState<Project | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [budget, setBudget] = useState("");
    const [deadlineDays, setDeadlineDays] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() =>
    {
        if (!projectId) return;

        obtenerProyecto();
    }, [projectId]);

    async function obtenerProyecto()
    {
        try
        {
            setLoading(true);
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/projects/${projectId}`,
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            console.log("Proyecto recibido:", data);

            if (!response.ok)
            {
                throw new Error(data.message || "No se pudo obtener el proyecto");
            }

            const projectData = data.data ?? data;

            setProject(projectData);

            setTitle(projectData.title ?? "");
            setDescription(projectData.description ?? "");
            setCategory(projectData.category ?? "");
            setBudget(String(projectData.budget ?? ""));
            setDeadlineDays(String(projectData.deadlineDays ?? ""));
        }
        catch (error)
        {
            console.error(error);
            setError("Error al cargar el proyecto");
        }
        finally
        {
            setLoading(false);
        }
    }

    async function editarProyecto(e: FormEvent<HTMLFormElement>)
    {
        e.preventDefault();

        if (!project) return;

        if (project.status === "in_progress")
        {
            setError("Este proyecto ya está en progreso y no puede editarse.");
            return;
        }

        if (project.status === "completed")
        {
            setError("Este proyecto ya fue completado y no puede editarse.");
            return;
        }

        if (project.status === "cancelled")
        {
            setError("Este proyecto fue cancelado y no puede editarse.");
            return;
        }

        if (!title.trim() || !description.trim() || !category.trim())
        {
            setError("Todos los campos de texto son obligatorios.");
            return;
        }

        if (Number(budget) <= 0)
        {
            setError("El presupuesto debe ser mayor a 0.");
            return;
        }

        if (Number(deadlineDays) <= 0)
        {
            setError("Los días de plazo deben ser mayores a 0.");
            return;
        }

        try
        {
            setSaving(true);
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/projects/${project.id}`,
                {
                    method: "PATCH",
                    headers:
                    {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(
                    {
                        title: title.trim(),
                        description: description.trim(),
                        category: category.trim(),
                        budget: Number(budget),
                        deadlineDays: Number(deadlineDays),
                    }),
                }
            );

            const data = await response.json();

            console.log("Respuesta editar proyecto:", data);

            if (!response.ok)
            {
                throw new Error(data.message || "No se pudo editar el proyecto");
            }

            const updatedProject = data.data ?? data;

            setProject(updatedProject);

            setTitle(updatedProject.title ?? title);
            setDescription(updatedProject.description ?? description);
            setCategory(updatedProject.category ?? category);
            setBudget(String(updatedProject.budget ?? budget));
            setDeadlineDays(String(updatedProject.deadlineDays ?? deadlineDays));

            setMessage("Proyecto actualizado correctamente.");
        }
        catch (error)
        {
            console.error(error);

            if (error instanceof Error)
            {
                setError(error.message);
            }
            else
            {
                setError("Error al editar el proyecto");
            }
        }
        finally
        {
            setSaving(false);
        }
    }

    async function cancelarProyecto()
    {
        if (!project) return;

        if (project.status === "in_progress")
        {
            setError("Este proyecto ya está en progreso y no puede cancelarse.");
            return;
        }

        if (project.status === "completed")
        {
            setError("Este proyecto ya fue completado y no puede cancelarse.");
            return;
        }

        if (project.status === "cancelled")
        {
            setError("Este proyecto ya fue cancelado.");
            return;
        }

        const confirmar =
            window.confirm("¿Seguro que quieres cancelar este proyecto?");

        if (!confirmar) return;

        try
        {
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/projects/${project.id}/cancelar`,
                {
                    method: "PATCH",
                    headers:
                    {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            console.log("Respuesta cancelar proyecto:", data);

            if (!response.ok)
            {
                throw new Error(data.message || "No se pudo cancelar el proyecto");
            }

            router.push("/menuCliente/verMisProyectos");
        }
        catch (error)
        {
            console.error(error);

            if (error instanceof Error)
            {
                setError(error.message);
            }
            else
            {
                setError("Error al cancelar el proyecto");
            }
        }
    }

    if (loading)
    {
        return (
            <main style={{ padding: "40px" }}>
                <h1>Cargando proyecto...</h1>
            </main>
        );
    }

    if (!project)
    {
        return (
            <main style={{ padding: "40px" }}>
                <h1>No se encontró el proyecto</h1>

                <button
                    onClick={() =>
                        router.push("/menuCliente/verMisProyectos")
                    }
                >
                    Volver
                </button>
            </main>
        );
    }

    const isBlocked =
        project.status === "in_progress" ||
        project.status === "completed" ||
        project.status === "cancelled";

    return (
        <main
            style={{
                padding: "40px",
                color: "white",
                background: "#020617",
                minHeight: "100vh",
            }}
        >

            <h1>
                Ver Proyecto
            </h1>

            <p>
                Estado actual: <strong>{project.status}</strong>
            </p>

            {
                project.status === "in_progress" && (
                    <p style={{ color: "orange" }}>
                        Este proyecto ya tiene una propuesta aceptada.
                        Por eso no puede editarse ni cancelarse.
                    </p>
                )
            }

            {
                project.status === "completed" && (
                    <p style={{ color: "orange" }}>
                        Este proyecto ya fue completado.
                    </p>
                )
            }

            {
                project.status === "cancelled" && (
                    <p style={{ color: "orange" }}>
                        Este proyecto fue cancelado.
                    </p>
                )
            }

            {
                error && (
                    <p style={{ color: "red" }}>
                        {error}
                    </p>
                )
            }

            {
                message && (
                    <p style={{ color: "lightgreen" }}>
                        {message}
                    </p>
                )
            }

            <form onSubmit={editarProyecto}>

                <div style={{ marginBottom: "14px" }}>
                    <label>Título</label>
                    <br />

                    <input
                        type="text"
                        value={title}
                        disabled={isBlocked}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        style={{ width: "100%", padding: "10px" }}
                    />
                </div>

                <div style={{ marginBottom: "14px" }}>
                    <label>Descripción</label>
                    <br />

                    <textarea
                        value={description}
                        disabled={isBlocked}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "10px",
                            minHeight: "120px",
                        }}
                    />
                </div>

                <div style={{ marginBottom: "14px" }}>
                    <label>Categoría</label>
                    <br />

                    <input
                        type="text"
                        value={category}
                        disabled={isBlocked}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                        style={{ width: "100%", padding: "10px" }}
                    />
                </div>

                <div style={{ marginBottom: "14px" }}>
                    <label>Presupuesto</label>
                    <br />

                    <input
                        type="number"
                        value={budget}
                        disabled={isBlocked}
                        onChange={(e) =>
                            setBudget(e.target.value)
                        }
                        style={{ width: "100%", padding: "10px" }}
                    />
                </div>

                <div style={{ marginBottom: "14px" }}>
                    <label>Días de plazo</label>
                    <br />

                    <input
                        type="number"
                        value={deadlineDays}
                        disabled={isBlocked}
                        onChange={(e) =>
                            setDeadlineDays(e.target.value)
                        }
                        style={{ width: "100%", padding: "10px" }}
                    />
                </div>

                {
                    !isBlocked && (
                        <div style={{ marginTop: "20px" }}>

                            <button
                                type="submit"
                                disabled={saving}
                            >
                                {
                                    saving
                                    ? "Guardando..."
                                    : "Guardar cambios"
                                }
                            </button>

                            <button
                                type="button"
                                onClick={cancelarProyecto}
                                style={{ marginLeft: "12px" }}
                            >
                                Cancelar proyecto
                            </button>

                        </div>
                    )
                }

            </form>

            <button
                style={{ marginTop: "20px" }}
                onClick={() =>
                    router.push("/menuCliente/verMisProyectos")
                }
            >
                Volver a mis proyectos
            </button>

        </main>
    );
}