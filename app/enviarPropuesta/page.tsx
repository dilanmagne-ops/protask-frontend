"use client";

import "./enviarPropuesta.css";

export default function EnviarPropuesta() {
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
                    <h2>Desarrollo de Sistema Web</h2>
                    <p>Cliente: Juan Pérez</p>

                    <div className="proyecto-datos">
                        <span>Presupuesto: Bs. 5,000</span>
                        <span>Plazo: 30 días</span>
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
                                onKeyDown={bloquearNegativos}
                            />
                        </div>

                        <div className="campo">
                            <label>Tiempo estimado (días) *</label>
                            <input
                                type="number"
                                min="1"
                                onKeyDown={bloquearNegativos}
                            />
                        </div>
                    </div>

                    <div className="campo">
                        <label>Descripción de tu enfoque *</label>
                        <textarea></textarea>
                        <p className="ayuda">
                            Explica cómo abordarás el proyecto
                        </p>
                    </div>
                </div>

                <div className="mensaje-verificado">
                    ✓ Perfil verificado - Puedes postular
                </div>

                <div className="botones">
                    <button className="btn-cancelar">Cancelar</button>
                    <button className="btn-enviar">Enviar Propuesta</button>
                </div>

                <p className="nota">
                    El cliente recibirá una notificación de tu propuesta
                </p>
            </div>
        </div>
    );
}