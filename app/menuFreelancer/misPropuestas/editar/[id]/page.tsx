"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import "./editarPropuesta.css";

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
};

export default function EditarPropuestaPage()
{
    const router = useRouter();
    const params = useParams();

    const proposalId = Array.isArray(params.id)
        ? params.id[0]
        : params.id;

    const [proposal, setProposal] = useState<Proposal | null>(null);

    const [description, setDescription] = useState("");
    const [offeredPrice, setOfferedPrice] = useState("");
    const [estimatedDays, setEstimatedDays] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() =>
    {
        if (!proposalId) return;

        obtenerPropuesta();
    }, [proposalId]);

    async function obtenerPropuesta()
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
                `http://localhost:3000/api/proposals/${proposalId}`,
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
                alert(
                    data.message ||
                    data.messages?.[0]?.description ||
                    "No se pudo cargar la propuesta."
                );

                router.push("/menuFreelancer/misPropuestas");
                return;
            }

            const propuestaBase = data.data ?? data;

            setProposal(propuestaBase);

            setDescription(propuestaBase.description);
            setOfferedPrice(String(propuestaBase.offeredPrice));
            setEstimatedDays(String(propuestaBase.estimatedDays));
        }
        catch (error)
        {
            console.error(error);
            alert("Error al cargar la propuesta.");
        }
        finally
        {
            setLoading(false);
        }
    }

    async function guardarCambios()
    {
        if (!proposalId || !proposal) return;

        if (proposal.status !== "pending")
        {
            alert("Solo puedes editar propuestas pendientes.");
            return;
        }

        if (!description.trim())
        {
            alert("La descripción no puede estar vacía.");
            return;
        }

        if (Number(offeredPrice) <= 0)
        {
            alert("El precio ofrecido debe ser mayor a 0.");
            return;
        }

        if (Number(estimatedDays) <= 0)
        {
            alert("Los días estimados deben ser mayores a 0.");
            return;
        }

        try
        {
            setSaving(true);

            const token = localStorage.getItem("token");

            if (!token)
            {
                router.push("/login");
                return;
            }

            const response = await fetch(
                `http://localhost:3000/api/proposals/${proposalId}`,
                {
                    method: "PATCH",

                    headers:
                    {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify(
                    {
                        description,
                        offeredPrice: Number(offeredPrice),
                        estimatedDays: Number(estimatedDays),
                    }),
                }
            );

            const data = await response.json();

            console.log(data);

            if (response.ok)
            {
                localStorage.removeItem(`proposalEdit:${proposalId}`);

                alert("Propuesta actualizada correctamente.");

                router.push("/menuFreelancer/misPropuestas");
            }
            else
            {
                alert(
                    data.message ||
                    data.messages?.[0]?.description ||
                    "No se pudo actualizar la propuesta."
                );
            }
        }
        catch (error)
        {
            console.error(error);
            alert("Error al actualizar la propuesta.");
        }
        finally
        {
            setSaving(false);
        }
    }

    async function retirarPropuesta()
    {
        if (!proposalId) return;

        const confirmar = confirm(
            "¿Seguro que quieres retirar esta propuesta? Se eliminará definitivamente."
        );

        if (!confirmar)
        {
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
                `http://localhost:3000/api/proposals/${proposalId}`,
                {
                    method: "DELETE",
                    headers:
                    {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            console.log(data);

            if (response.ok)
            {
                localStorage.removeItem(`proposalEdit:${proposalId}`);
                localStorage.removeItem(`proposalStatus:${proposalId}`);

                alert("Propuesta retirada correctamente.");

                router.push("/menuFreelancer/misPropuestas");
            }
            else
            {
                alert(
                    data.message ||
                    data.messages?.[0]?.description ||
                    "No se pudo retirar la propuesta."
                );
            }
        }
        catch (error)
        {
            console.error(error);
            alert("Error al retirar la propuesta.");
        }
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
            <main className="editar-propuesta-page">
                <div className="editar-propuesta-card">
                    <p>Cargando propuesta...</p>
                </div>
            </main>
        );
    }

    if (!proposal)
    {
        return (
            <main className="editar-propuesta-page">
                <div className="editar-propuesta-card">
                    <button
                        className="back-button"
                        onClick={() => router.push("/menuFreelancer/misPropuestas")}
                    >
                        ← Volver
                    </button>

                    <p>No se encontró la propuesta.</p>
                </div>
            </main>
        );
    }

    if (proposal.status !== "pending")
    {
        return (
            <main className="editar-propuesta-page">
                <div className="editar-propuesta-card">

                    <button
                        className="back-button"
                        onClick={() => router.push("/menuFreelancer/misPropuestas")}
                    >
                        ← Volver
                    </button>

                    <h2>No puedes editar esta propuesta</h2>

                    <p>
                        Solo las propuestas pendientes pueden ser editadas.
                    </p>

                </div>
            </main>
        );
    }

    return (
        <main className="editar-propuesta-page">

            <section className="editar-propuesta-card">

                <button
                    className="back-button"
                    onClick={() => router.push("/menuFreelancer/misPropuestas")}
                >
                    ← Volver
                </button>

                <span className="editar-badge">
                    Editar propuesta
                </span>

                <h1>
                    {proposal.project.title}
                </h1>

                <p className="editar-subtitle">
                    Modifica los datos principales de tu propuesta.
                </p>

                <div className="editar-form">

                    <label>
                        Precio ofrecido
                    </label>

                    <input
                        type="number"
                        min="1"
                        value={offeredPrice}
                        onChange={(e) =>
                            setOfferedPrice(e.target.value)
                        }
                        onKeyDown={bloquearNegativos}
                    />

                    <label>
                        Días estimados
                    </label>

                    <input
                        type="number"
                        min="1"
                        value={estimatedDays}
                        onChange={(e) =>
                            setEstimatedDays(e.target.value)
                        }
                        onKeyDown={bloquearNegativos}
                    />

                    <label>
                        Descripción de la propuesta
                    </label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                    />

                    <button
                        className="save-btn"
                        onClick={guardarCambios}
                        disabled={saving}
                    >
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </button>

                    <button
                        className="reject-btn"
                        onClick={retirarPropuesta}
                        disabled={saving}
                    >
                        Retirar propuesta
                    </button>

                </div>

            </section>

        </main>
    );
}