"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type KeyboardEvent } from "react";
import "./EnviarPropuesta.css";

type Project = {
    id: string;
    title: string;
    description: string;
    category: string;
    budget: string | number;
    deadlineDays: number;
    client?: {
        name: string;
    };
};

export default function EnviarPropuesta()
{
    const router = useRouter();
    const params = useParams();

    const projectId =
        typeof params.id === "string"
            ? params.id
            : params.id?.[0];

    const [project, setProject] = useState<Project | null>(null);

    const [offeredPrice, setOfferedPrice] = useState("");
    const [estimatedDays, setEstimatedDays] = useState("");
    const [proposalDescription, setProposalDescription] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() =>
    {
        if (!projectId) return;

        setProject(null);
        setOfferedPrice("");
        setEstimatedDays("");
        setProposalDescription("");

        cargarProyecto();
    }, [projectId]);

    async function cargarProyecto()
    {
        try
        {
            setLoading(true);

            const token = localStorage.getItem("token");

            if (!token)
            {
                router.push("/login");
                return;
            }

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

            console.log(data);

            if (!response.ok)
            {
                alert(
                    data.message ||
                    "No se pudo cargar el proyecto."
                );
                return;
            }

            const proyectoObtenido = data.data ?? data;

            setProject(proyectoObtenido);
        }
        catch (error)
        {
            console.error(error);
            alert("Error al cargar el proyecto.");
        }
        finally
        {
            setLoading(false);
        }
    }

    async function enviarPropuesta()
    {
        if (!offeredPrice.trim())
        {
            alert("Debes ingresar tu precio.");
            return;
        }

        if (!estimatedDays.trim())
        {
            alert("Debes ingresar los días estimados.");
            return;
        }

        if (!proposalDescription.trim())
        {
            alert("Debes escribir una descripción para tu propuesta.");
            return;
        }

        if (Number(offeredPrice) <= 0)
        {
            alert("El precio debe ser mayor a 0.");
            return;
        }

        if (Number(estimatedDays) <= 0)
        {
            alert("Los días estimados deben ser mayores a 0.");
            return;
        }

        try
        {
            const token = localStorage.getItem("token");

            if (!token)
            {
                router.push("/login");
                return;
            }

            const response = await fetch(
                `http://localhost:3000/api/proposals/project/${projectId}`,
                {
                    method: "POST",

                    headers:
                    {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify(
                    {
                        offeredPrice: Number(offeredPrice),
                        estimatedDays: Number(estimatedDays),
                        description: proposalDescription,
                    }),
                }
            );

            const data = await response.json();

            console.log(data);

            if (response.ok)
            {
                alert("Propuesta enviada correctamente");

                setOfferedPrice("");
                setEstimatedDays("");
                setProposalDescription("");

                router.push("/menuFreelancer/explorarProyectos");
            }
            else
            {
                alert(
                    data.message ||
                    "Error al enviar propuesta"
                );
            }
        }
        catch (error)
        {
            console.error(error);
            alert("Error del servidor");
        }
    }

    function volverAExplorar()
    {
        router.push("/menuFreelancer/explorarProyectos");
    }

    function bloquearNegativos(e: KeyboardEvent<HTMLInputElement>)
    {
        if (e.key === "-" || e.key === "e" || e.key === "+")
        {
            e.preventDefault();
        }
    }

    if (loading)
    {
        return (
            <div className="pagina-propuesta">
                <div className="tarjeta-principal">
                    <p>Cargando proyecto...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pagina-propuesta">

            <div className="tarjeta-principal">

                <button
                    className="btn-volver"
                    onClick={volverAExplorar}
                >
                    ← Volver a explorar proyectos
                </button>

                <h1>Enviar Propuesta</h1>

                <div className="proyecto-info">
                    <h2>{project?.title || "Proyecto no disponible"}</h2>

                    <p>
                        Categoría: {project?.category || "Sin categoría"}
                    </p>

                    <div className="proyecto-datos">
                        <span>
                            Presupuesto: Bs. {project?.budget || "0"}
                        </span>

                        <span>
                            Plazo: {project?.deadlineDays || 0} días
                        </span>
                    </div>
                </div>

                <div className="formulario-propuesta">
                    <h2>Tu Propuesta</h2>

                    <div className="fila-campos">

                        <div className="campo">
                            <label>Tu precio (Bs) *</label>

                            <input
                                type="number"
                                min="1"
                                autoComplete="off"
                                value={offeredPrice}
                                onChange={(e) =>
                                    setOfferedPrice(e.target.value)
                                }
                                onKeyDown={bloquearNegativos}
                            />
                        </div>

                        <div className="campo">
                            <label>Tiempo estimado (días) *</label>

                            <input
                                type="number"
                                min="1"
                                autoComplete="off"
                                value={estimatedDays}
                                onChange={(e) =>
                                    setEstimatedDays(e.target.value)
                                }
                                onKeyDown={bloquearNegativos}
                            />
                        </div>

                    </div>

                    <div className="campo">
                        <label>Descripción de tu enfoque *</label>

                        <textarea
                            autoComplete="off"
                            value={proposalDescription}
                            onChange={(e) =>
                                setProposalDescription(e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="mensaje-verificado">
                    ✓ Perfil verificado - Puedes postular
                </div>

                <div className="botones">

                    <button
                        className="btn-cancelar"
                        onClick={volverAExplorar}
                    >
                        Cancelar
                    </button>

                    <button
                        className="btn-enviar"
                        onClick={enviarPropuesta}
                    >
                        Enviar Propuesta
                    </button>

                </div>

                <p className="nota">
                    El cliente recibirá una notificación de tu propuesta.
                </p>

            </div>

        </div>
    );
}