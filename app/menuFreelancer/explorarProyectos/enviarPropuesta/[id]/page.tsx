"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./EnviarPropuesta.css";
type Project = {
    id: string;
    title: string;
    description: string;
    category: string;
    budget: string;
    deadlineDays: number;
    client: {
        name: string;
    };
};
export default function EnviarPropuesta() {
    const params = useParams();
    const projectId = 
        typeof params.id === "string"
            ? params.id
            : params.id?.[0];
    const [project, setProject] = useState<Project | null>(null);
    
    useEffect(() =>
    {
        async function cargarProyecto()
        {
            try
            {
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

                console.log(data);

                setProject(data);
            }
            catch (error)
            {
                console.error(error);
            }
        }

        if (projectId)
        {
            cargarProyecto();
        }

    }, [projectId]);

    const [offeredPrice, setOfferedPrice] = useState("");
    const [estimatedDays, setEstimatedDays] = useState("");
    const [proposalDescription, setProposalDescription] = useState("");
    async function enviarPropuesta()
    {
        try
        {
            const token = localStorage.getItem("token");

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
    function bloquearNegativos(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "-" || e.key === "e" || e.key === "+") {
            e.preventDefault();
        }
    }
    
    return (
        <div className="pagina-propuesta">
            <div className="tarjeta-principal">
                <h1>Enviar Propuesta</h1>

                <div className="proyecto-info">
                    <h2>{project?.title}</h2>
                    <p>
                        Categoría: {project?.category}
                    </p>

                    <div className="proyecto-datos">
                        <span>
                            Presupuesto: Bs. {project?.budget}
                        </span>

                        <span>
                            Plazo: {project?.deadlineDays} días
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
                    <button className="btn-cancelar">Cancelar</button>
                    <button
                    className="btn-enviar"
                    onClick={enviarPropuesta}
                >
                    Enviar Propuesta
                </button>
                </div>

                <p className="nota">
                    El cliente recibirá una notificación de tu propuesta
                </p>
            </div>
        </div>
    );
}