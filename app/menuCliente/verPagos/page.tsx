"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserMini =
{
    id: string;
    name: string;
    email: string;
};

type ProjectMini =
{
    id: string;
    title: string;
    status: string;
};

type ProposalMini =
{
    id: string;
    offeredPrice: string | number;
    status: string;
    project?: ProjectMini;
};

type EscrowDeposit =
{
    id: string;
    monto: string | number;
    estado: "retenido" | "liberado" | "reembolsado";
    tipoPago: string;
    depositadoEn: string;
    liberadoEn?: string | null;
    reembolsadoEn?: string | null;
    proposal?: ProposalMini;
    freelancer?: UserMini;
};

export default function VerPagosClientePage()
{
    const router = useRouter();

    const [pagos, setPagos] = useState<EscrowDeposit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() =>
    {
        obtenerPagos();
    }, []);

    async function obtenerPagos()
    {
        try
        {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token)
            {
                router.push("/login");
                return;
            }

            const response = await fetch(
                "http://localhost:3001/api/escrow/mis-depositos?limit=100",
                {
                    headers:
                    {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

            console.log("Pagos cliente:", data);

            if (!response.ok)
            {
                throw new Error(
                    data.message ||
                    data.messages?.[0]?.description ||
                    "No se pudieron cargar los pagos"
                );
            }

            setPagos(data.data ?? []);
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
                setError("Error al cargar pagos");
            }
        }
        finally
        {
            setLoading(false);
        }
    }

    function getEstadoLabel(estado: string)
    {
        if (estado === "retenido") return "Pago retenido";
        if (estado === "liberado") return "Pago liberado";
        if (estado === "reembolsado") return "Pago reembolsado";

        return estado;
    }

    function getTipoPagoLabel(tipoPago: string)
    {
        if (tipoPago === "tarjeta_credito") return "Tarjeta";
        if (tipoPago === "qr") return "QR";
        if (tipoPago === "transferencia_bancaria") return "Transferencia bancaria";

        return tipoPago;
    }

    if (loading)
    {
        return (
            <main style={styles.page}>
                <h1>Cargando pagos...</h1>
            </main>
        );
    }

    return (
        <main style={styles.page}>

            <section style={styles.hero}>

                <div>
                    <span style={styles.badge}>
                        Panel Cliente
                    </span>

                    <h1 style={styles.title}>
                        Pagos Escrow
                    </h1>

                    <p style={styles.text}>
                        Revisa los pagos que realizaste, el freelancer asociado,
                        el proyecto y el estado actual del dinero.
                    </p>
                </div>

                <div style={styles.summary}>
                    <span>Total de pagos</span>

                    <strong>
                        {pagos.length}
                    </strong>

                    <p>
                        Depósitos registrados
                    </p>
                </div>

            </section>

            {
                error && (
                    <p style={styles.error}>
                        {error}
                    </p>
                )
            }

            {
                pagos.length === 0
                ? (
                    <section style={styles.empty}>
                        <h2>No tienes pagos registrados</h2>

                        <p>
                            Cuando aceptes una propuesta y registres un pago,
                            aparecerá aquí.
                        </p>
                    </section>
                )
                : (
                    <section style={styles.list}>
                        {
                            pagos.map((pago) =>
                            (
                                <article
                                    key={pago.id}
                                    style={styles.card}
                                >

                                    <div style={styles.cardTop}>
                                        <span style={styles.status}>
                                            {getEstadoLabel(pago.estado)}
                                        </span>

                                        <span style={styles.paymentType}>
                                            {getTipoPagoLabel(pago.tipoPago)}
                                        </span>
                                    </div>

                                    <h2 style={styles.cardTitle}>
                                        {pago.proposal?.project?.title ?? "Proyecto sin título"}
                                    </h2>

                                    <div style={styles.grid}>

                                        <div>
                                            <span style={styles.label}>
                                                Monto
                                            </span>

                                            <strong style={styles.amount}>
                                                Bs. {pago.monto}
                                            </strong>
                                        </div>

                                        <div>
                                            <span style={styles.label}>
                                                Freelancer
                                            </span>

                                            <strong>
                                                {pago.freelancer?.name ?? "No disponible"}
                                            </strong>

                                            <p style={styles.smallText}>
                                                {pago.freelancer?.email ?? ""}
                                            </p>
                                        </div>

                                        <div>
                                            <span style={styles.label}>
                                                Estado del proyecto
                                            </span>

                                            <strong>
                                                {pago.proposal?.project?.status ?? "No disponible"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span style={styles.label}>
                                                Estado de propuesta
                                            </span>

                                            <strong>
                                                {pago.proposal?.status ?? "No disponible"}
                                            </strong>
                                        </div>

                                    </div>

                                    <div style={styles.dates}>
                                        <p>
                                            Depositado: {new Date(pago.depositadoEn).toLocaleString()}
                                        </p>

                                        {
                                            pago.liberadoEn && (
                                                <p>
                                                    Liberado: {new Date(pago.liberadoEn).toLocaleString()}
                                                </p>
                                            )
                                        }

                                        {
                                            pago.reembolsadoEn && (
                                                <p>
                                                    Reembolsado: {new Date(pago.reembolsadoEn).toLocaleString()}
                                                </p>
                                            )
                                        }
                                    </div>

                                </article>
                            ))
                        }
                    </section>
                )
            }

            <button
                style={styles.backButton}
                onClick={() =>
                    router.push("/menuCliente")
                }
            >
                Volver al panel
            </button>

        </main>
    );
}

const styles: { [key: string]: React.CSSProperties } =
{
    page:
    {
        minHeight: "100vh",
        padding: "48px 8%",
        color: "white",
        background:
            "radial-gradient(circle at top left, rgba(37, 99, 235, 0.35), transparent 34%), radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.25), transparent 34%), linear-gradient(135deg, #020617, #0f172a, #111827)",
    },
    hero:
    {
        display: "flex",
        justifyContent: "space-between",
        gap: "28px",
        marginBottom: "32px",
    },
    badge:
    {
        display: "inline-block",
        padding: "8px 14px",
        borderRadius: "999px",
        color: "#bfdbfe",
        background: "rgba(37, 99, 235, 0.18)",
        border: "1px solid rgba(96, 165, 250, 0.35)",
        fontWeight: 700,
        marginBottom: "14px",
    },
    title:
    {
        margin: 0,
        fontSize: "42px",
    },
    text:
    {
        color: "#cbd5e1",
        maxWidth: "620px",
        lineHeight: 1.6,
    },
    summary:
    {
        minWidth: "240px",
        padding: "24px",
        borderRadius: "24px",
        background: "rgba(15, 23, 42, 0.75)",
        border: "1px solid rgba(148, 163, 184, 0.24)",
    },
    list:
    {
        display: "grid",
        gap: "20px",
    },
    card:
    {
        padding: "24px",
        borderRadius: "24px",
        background: "rgba(15, 23, 42, 0.78)",
        border: "1px solid rgba(148, 163, 184, 0.22)",
    },
    cardTop:
    {
        display: "flex",
        justifyContent: "space-between",
        gap: "12px",
        marginBottom: "14px",
    },
    status:
    {
        padding: "7px 12px",
        borderRadius: "999px",
        background: "rgba(34, 197, 94, 0.14)",
        color: "#bbf7d0",
        fontWeight: 700,
    },
    paymentType:
    {
        padding: "7px 12px",
        borderRadius: "999px",
        background: "rgba(14, 165, 233, 0.14)",
        color: "#bae6fd",
        fontWeight: 700,
    },
    cardTitle:
    {
        marginTop: 0,
    },
    grid:
    {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
    },
    label:
    {
        display: "block",
        color: "#94a3b8",
        fontSize: "13px",
        marginBottom: "6px",
    },
    amount:
    {
        color: "#38bdf8",
        fontSize: "22px",
    },
    smallText:
    {
        margin: "6px 0 0",
        color: "#94a3b8",
        fontSize: "13px",
    },
    dates:
    {
        marginTop: "16px",
        color: "#cbd5e1",
        fontSize: "14px",
    },
    error:
    {
        padding: "14px",
        borderRadius: "14px",
        color: "#fecaca",
        background: "rgba(127, 29, 29, 0.3)",
    },
    empty:
    {
        padding: "30px",
        borderRadius: "24px",
        background: "rgba(15, 23, 42, 0.76)",
        border: "1px solid rgba(148, 163, 184, 0.22)",
    },
    backButton:
    {
        marginTop: "28px",
        padding: "13px 18px",
        borderRadius: "14px",
        border: "none",
        color: "white",
        background: "#2563eb",
        fontWeight: 800,
        cursor: "pointer",
    },
};