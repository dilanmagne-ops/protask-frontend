"use client";

import "./ProjectForm.css";
import { useRouter } from "next/navigation";
export default function ProjectForm()
{
    const router = useRouter();
    return (
        <div className="project-form-container">

            <div className="project-form-card">

                <h1>
                    Formulario de Proyecto
                </h1>

                <div className="project-header">

                    <span>
                        ← Nuevo Proyecto
                    </span>

                    <span className="cliente-role">
                        Cliente
                    </span>

                </div>

                <form className="project-form">

                    <div className="input-group">

                        <label>
                            Titulo del proyecto *
                        </label>

                        <input
                            type="text"
                            placeholder=""
                        />

                    </div>

                    <div className="input-group">

                        <label>
                            Descripcion *
                        </label>

                        <textarea />

                    </div>

                    <div className="input-group">

                        <label>
                            Categoria *
                        </label>

                        <select>

                            <option>
                                Seleccionar...
                            </option>

                            <option>
                                Desarrollo Web
                            </option>

                            <option>
                                Diseño Grafico
                            </option>

                            <option>
                                Marketing
                            </option>

                        </select>

                    </div>

                    <div className="double-inputs">

                        <div className="input-group">

                            <label>
                                Presupuesto (Bs) *
                            </label>

                            <input type="number" />

                        </div>

                        <div className="input-group">

                            <label>
                                Plazo (dias) *
                            </label>

                            <input type="number" />

                        </div>

                    </div>

                    <div className="hitos-box">

                        <p>
                            Opcional: Dividir en hitos
                        </p>

                        <button type="button">
                            + Agregar hitos
                        </button>

                    </div>

                    <div className="project-buttons">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => router.push("/menuCliente")}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="publish-button"
                        >
                            Publicar
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}