"use client";

import { useState } from "react";
import "./SeleccionarFreelancer.css";

export default function SeleccionarFreelancer() {
    const propuestas = [
        {
            id: 1,
            nombre: "Ana García",
            calificacion: 4.8,
            precio: 4500,
            dias: 25
        },
        {
            id: 2,
            nombre: "Carlos López",
            calificacion: 4.5,
            precio: 5200,
            dias: 30
        },
        {
            id: 3,
            nombre: "María Torres",
            calificacion: 4.9,
            precio: 4800,
            dias: 28
        }
    ];

    const [propuestaSeleccionada, setPropuestaSeleccionada] = useState(propuestas[0]);

    return (
        <div className="pagina-seleccion">
            <div className="tarjeta-principal">
                <h1>Propuestas Recibidas</h1>

                <div className="proyecto-info">
                    <h2>Desarrollo de Sistema Web</h2>
                    <p>12 propuestas recibidas</p>
                </div>

                {propuestas.map((propuesta) => (
                    <div
                        key={propuesta.id}
                        className={
                            propuestaSeleccionada.id === propuesta.id
                                ? "propuesta propuesta-seleccionada"
                                : "propuesta"
                        }
                        onClick={() => setPropuestaSeleccionada(propuesta)}
                    >
                        <div className="propuesta-header">
                            <div>
                                <h2>{propuesta.nombre}</h2>
                                <p className="calificacion">★ {propuesta.calificacion}</p>
                            </div>

                            {propuestaSeleccionada.id === propuesta.id && (
                                <button className="btn-seleccionado">
                                    Seleccionado
                                </button>
                            )}
                        </div>

                        <div className="propuesta-datos">
                            <span>Bs. {propuesta.precio.toLocaleString()}</span>
                            <span>{propuesta.dias} días</span>
                        </div>

                        {propuestaSeleccionada.id !== propuesta.id && (
                            <a href="#">Ver perfil y propuesta →</a>
                        )}
                    </div>
                ))}

                <div className="escrow">
                    <h2>💰 Depositar en Escrow</h2>

                    <p>
                        El pago quedará retenido hasta que apruebes el trabajo final
                    </p>

                    <div className="resumen-pago">
                        <div>
                            <span>Monto del proyecto:</span>
                            <strong>Bs. {propuestaSeleccionada.precio.toLocaleString()}</strong>
                        </div>

                        <div>
                            <span>Comisión plataforma (10%):</span>
                            <strong>
                                Bs. {(propuestaSeleccionada.precio * 0.10).toLocaleString()}
                            </strong>
                        </div>
                    </div>

                    <button className="btn-pagar">
                        Confirmar y Pagar
                    </button>
                </div>
            </div>
        </div>
    );
}