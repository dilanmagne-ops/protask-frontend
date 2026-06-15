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

            if (!response.ok)
            {
                throw new Error(data.message || "No se pudo obtener el proyecto");
            }

            const projectData = data.data ?? data;

            setProject(projectData);
            setTitle(projectData.title);
            setDescription(projectData.description);
            setCategory(projectData.category);
            setBudget(String(projectData.budget));
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
                        title,
                        description,
                        category,
                        budget: Number(budget),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok)
            {
                throw new Error(data.message || "No se pudo editar el proyecto");
            }

            setMessage("Proyecto actualizado correctamente.");
            obtenerProyecto();
        }
        catch (error)
        {
            console.error(error);
            setError("Error al editar el proyecto");
        }
        finally
        {
            setSaving(false);
        }
    }

    async function borrarProyecto()
    {
        if (!project) return;

        if (project.status === "in_progress")
        {
            setError("Este proyecto ya está en progreso y no puede borrarse.");
            return;
        }

        const confirmar =
            window.confirm("¿Seguro que quieres borrar este proyecto?");

        if (!confirmar) return;

        try
        {
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/projects/${project.id}`,
                {
                    method: "DELETE",
                    headers:
                    {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok)
            {
                throw new Error(data.message || "No se pudo borrar el proyecto");
            }

            router.push("/menuCliente/verMisProyectos");
        }
        catch (error)
        {
            console.error(error);
            setError("Error al borrar el proyecto");
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

    const isInProgress =
        project.status === "in_progress";

    return (
        <main style={{ padding: "40px" }}>

            <h1>
                Ver Proyecto
            </h1>

            <p>
                Estado actual: <strong>{project.status}</strong>
            </p>

            {
                isInProgress && (
                    <p style={{ color: "orange" }}>
                        Este proyecto ya tiene una propuesta aceptada.
                        Por eso no puede editarse ni borrarse.
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
                    <p style={{ color: "green" }}>
                        {message}
                    </p>
                )
            }

            <form onSubmit={editarProyecto}>

                <div>
                    <label>Título</label>

                    <input
                        type="text"
                        value={title}
                        disabled={isInProgress}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Descripción</label>

                    <textarea
                        value={description}
                        disabled={isInProgress}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Categoría</label>

                    <input
                        type="text"
                        value={category}
                        disabled={isInProgress}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Presupuesto</label>

                    <input
                        type="number"
                        value={budget}
                        disabled={isInProgress}
                        onChange={(e) =>
                            setBudget(e.target.value)
                        }
                    />
                </div>

                {
                    !isInProgress && (
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
                                onClick={borrarProyecto}
                                style={{ marginLeft: "12px" }}
                            >
                                Borrar proyecto
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