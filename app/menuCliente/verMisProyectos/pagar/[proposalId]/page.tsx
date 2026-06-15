"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import "./pagar.css";

type Proposal =
{
    id: string;
    offeredPrice: number | string;
    estimatedDays: number;
    description: string;
    status: string;
    freelancer?: {
        id: string;
        name: string;
        email: string;
    };
    project?: {
        id: string;
        title: string;
        description: string;
        category: string;
        budget: number;
        status: string;
    };
};

type PaymentMethod = "card" | "qr" | "";

export default function PagarPropuestaPage()
{
    const router = useRouter();
    const params = useParams();

    const proposalId =
        Array.isArray(params.proposalId)
        ? params.proposalId[0]
        : params.proposalId;

    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");

    const [qrReason, setQrReason] = useState("");
    const [qrEmail, setQrEmail] = useState("");
    const [voucherFile, setVoucherFile] = useState<File | null>(null);

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
            setError("");

            const token = localStorage.getItem("token");

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

            console.log("Propuesta para pago:", data);

            if (!response.ok)
            {
                throw new Error(data.message || "No se pudo obtener la propuesta");
            }

            setProposal(data.data ?? data);
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
                setError("Error al cargar la pantalla de pago");
            }
        }
        finally
        {
            setLoading(false);
        }
    }

    function limpiarMensajes()
    {
        setError("");
        setMessage("");
    }

    function seleccionarMetodo(method: PaymentMethod)
    {
        limpiarMensajes();
        setPaymentMethod(method);
    }
    async function registrarDepositoEscrow(tipoPago: "tarjeta_credito" | "qr")
    {
        if (!proposal) return false;

        try
        {
            const token =
                localStorage.getItem("token");

            if (!token)
            {
                router.push("/login");
                return false;
            }

            const response = await fetch(
                "http://localhost:3000/api/escrow/depositar",
                {
                    method: "POST",
                    headers:
                    {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify(
                    {
                        proposalId: proposal.id,
                        tipoPago,
                    }),
                }
            );

            const data =
                await response.json();

            console.log("Respuesta depósito escrow:", data);

            if (!response.ok)
            {
                throw new Error(
                    data.message ||
                    data.messages?.[0]?.description ||
                    "No se pudo registrar el pago en escrow"
                );
            }

            return true;
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
                setError("Error al registrar el pago");
            }

            return false;
        }
    }
    async function pagarConTarjeta(e: FormEvent<HTMLFormElement>)
    {
        e.preventDefault();

        if (!proposal) return;

        limpiarMensajes();

        if (!cardName.trim())
        {
            setError("Ingresa el nombre del titular de la tarjeta.");
            return;
        }

        if (cardNumber.replace(/\s/g, "").length < 13)
        {
            setError("Ingresa un número de tarjeta válido.");
            return;
        }

        if (!cardExpiry.trim())
        {
            setError("Ingresa la fecha de vencimiento.");
            return;
        }

        if (cardCvv.length < 3)
        {
            setError("Ingresa un CVV válido.");
            return;
        }

        console.log("Pago con tarjeta simulado:", {
            proposalId: proposal.id,
            amount: proposal.offeredPrice,
            cardName,
            cardNumber,
            cardExpiry,
        });

       const depositoRegistrado =
            await registrarDepositoEscrow("tarjeta_credito");

        if (!depositoRegistrado)
        {
            return;
        }

        alert("Pago con tarjeta registrado correctamente.");

        router.push("/menuCliente/verMisProyectos");
    }

    async function pagarConQr(e: FormEvent<HTMLFormElement>)
    {
        e.preventDefault();

        if (!proposal) return;

        limpiarMensajes();

        if (!qrReason.trim())
        {
            setError("Ingresa la razón del depósito.");
            return;
        }

        if (!qrEmail.trim())
        {
            setError("Ingresa un correo de contacto.");
            return;
        }

        if (!voucherFile)
        {
            setError("Sube una imagen del voucher.");
            return;
        }

        console.log("Pago QR simulado:", {
            proposalId: proposal.id,
            amount: proposal.offeredPrice,
            reason: qrReason,
            email: qrEmail,
            voucherName: voucherFile.name,
        });

        const depositoRegistrado =
            await registrarDepositoEscrow("qr");

        if (!depositoRegistrado)
        {
            return;
        }

        alert("Voucher enviado y pago QR registrado correctamente.");

        router.push("/menuCliente/verMisProyectos");
    }
    if (loading)
    {
        return (
            <main className="pagar-page">
                <h1>Cargando pantalla de pago...</h1>
            </main>
        );
    }

    if (!proposal)
    {
        return (
            <main className="pagar-page">
                <div className="pagar-card">
                    <h1>No se encontró la propuesta</h1>

                    {
                        error && (
                            <p className="error-message">
                                {error}
                            </p>
                        )
                    }

                    <button
                        className="secondary-button"
                        onClick={() =>
                            router.push("/menuCliente/verMisProyectos")
                        }
                    >
                        Volver a mis proyectos
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="pagar-page">

            <section className="pagar-header">

                <div>
                    <span className="pagar-badge">
                        Pago del proyecto
                    </span>

                    <h1>
                        Realizar Pago
                    </h1>

                    <p>
                        Selecciona un método de pago para continuar con la propuesta aceptada.
                    </p>
                </div>

                <div className="pagar-summary">
                    <span>Monto a pagar</span>

                    <strong>
                        Bs. {proposal.offeredPrice}
                    </strong>

                    <p>
                        Plazo estimado: {proposal.estimatedDays} días
                    </p>
                </div>

            </section>

            <section className="pagar-content">

                <div className="proposal-info">

                    <h2>
                        Resumen de la propuesta
                    </h2>

                    <div className="info-grid">

                        <div>
                            <span>Proyecto</span>
                            <strong>
                                {proposal.project?.title ?? "Proyecto"}
                            </strong>
                        </div>

                        <div>
                            <span>Freelancer</span>
                            <strong>
                                {proposal.freelancer?.name ?? "Freelancer"}
                            </strong>
                        </div>

                        <div>
                            <span>Estado de propuesta</span>
                            <strong>
                                {proposal.status}
                            </strong>
                        </div>

                        <div>
                            <span>Monto acordado</span>
                            <strong>
                                Bs. {proposal.offeredPrice}
                            </strong>
                        </div>

                    </div>

                    <p className="proposal-description">
                        {proposal.description}
                    </p>

                </div>

                <div className="payment-methods">

                    <button
                        className={
                            paymentMethod === "card"
                            ? "payment-option active"
                            : "payment-option"
                        }
                        onClick={() =>
                            seleccionarMetodo("card")
                        }
                    >
                        <span>💳</span>
                        Pagar con tarjeta
                    </button>

                    <button
                        className={
                            paymentMethod === "qr"
                            ? "payment-option active"
                            : "payment-option"
                        }
                        onClick={() =>
                            seleccionarMetodo("qr")
                        }
                    >
                        <span>📱</span>
                        Depósito por QR
                    </button>

                </div>

                {
                    error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )
                }

                {
                    message && (
                        <p className="success-message">
                            {message}
                        </p>
                    )
                }

                {
                    paymentMethod === "card" && (
                        <form
                            className="payment-form"
                            onSubmit={pagarConTarjeta}
                        >

                            <h2>
                                Datos de tarjeta
                            </h2>

                            <label>
                                Nombre del titular
                            </label>

                            <input
                                type="text"
                                placeholder="Ej: Nombre Completo"
                                value={cardName}
                                onChange={(e) =>
                                    setCardName(e.target.value)
                                }
                            />

                            <label>
                                Número de tarjeta
                            </label>

                            <input
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                maxLength={19}
                                value={cardNumber}
                                onChange={(e) =>
                                    setCardNumber(e.target.value)
                                }
                            />

                            <div className="form-row">

                                <div>
                                    <label>
                                        Vencimiento
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="MM/AA"
                                        maxLength={5}
                                        value={cardExpiry}
                                        onChange={(e) =>
                                            setCardExpiry(e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <label>
                                        CVV
                                    </label>

                                    <input
                                        type="password"
                                        placeholder="123"
                                        maxLength={4}
                                        value={cardCvv}
                                        onChange={(e) =>
                                            setCardCvv(e.target.value)
                                        }
                                    />
                                </div>

                            </div>

                            <button
                                type="submit"
                                className="primary-button"
                            >
                                Confirmar pago con tarjeta
                            </button>

                        </form>
                    )
                }

                {
                    paymentMethod === "qr" && (
                        <form
                            className="payment-form"
                            onSubmit={pagarConQr}
                        >

                            <h2>
                                Datos del depósito QR
                            </h2>

                            <div className="qr-box">
                                <span>
                                    QR
                                </span>

                                <p>
                                    Aquí puedes colocar después una imagen real del QR de pago.
                                </p>
                            </div>

                            <label>
                                Razón del depósito
                            </label>

                            <input
                                type="text"
                                placeholder="Ej: Pago propuesta proyecto web"
                                value={qrReason}
                                onChange={(e) =>
                                    setQrReason(e.target.value)
                                }
                            />

                            <label>
                                Correo de contacto
                            </label>

                            <input
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={qrEmail}
                                onChange={(e) =>
                                    setQrEmail(e.target.value)
                                }
                            />

                            <label>
                                Imagen del voucher
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setVoucherFile(e.target.files?.[0] ?? null)
                                }
                            />

                            {
                                voucherFile && (
                                    <p className="file-name">
                                        Archivo seleccionado: {voucherFile.name}
                                    </p>
                                )
                            }

                            <button
                                type="submit"
                                className="primary-button"
                            >
                                Enviar voucher QR
                            </button>

                        </form>
                    )
                }
            </section>
        </main>
    );
}