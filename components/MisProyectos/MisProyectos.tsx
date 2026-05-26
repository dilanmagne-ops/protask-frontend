"use client";

import "./MisProyectos.css";

import { useRouter } from "next/navigation";

export default function MisProyectos()
{
    const router = useRouter();

    return (
        <div className="misproyectos-container">

            <div className="misproyectos-card">

                <h1>
                    Mis Proyectos
                </h1>

                <div className="misproyectos-header">

                    <span>
                        Proyectos Publicados
                    </span>

                    <span className="cliente-role">
                        Cliente
                    </span>

                </div>

                {/* BUSCADOR */}
                <input
                    type="text"
                    placeholder="Buscar proyectos..."
                    className="search-input"
                />

                {/* FILTROS */}
                <div className="filters-box">

                    <h3>
                        Filtros
                    </h3>

                    <div className="input-group">

                        <label>
                            Categoria
                        </label>

                        <select>
                            <option>
                                Todas
                            </option>

                            <option>
                                Desarrollo
                            </option>

                            <option>
                                Diseño
                            </option>
                        </select>

                    </div>

                    <div className="budget-inputs">

                        <input
                            type="number"
                            placeholder="Min"
                        />

                        <input
                            type="number"
                            placeholder="Max"
                        />

                    </div>

                </div>

                {/* TARJETAS */}
                <div className="project-item">

                    <h2>
                        Proyecto Ejemplo 1
                    </h2>

                    <p>
                        Descripcion breve del proyecto aqui...
                    </p>

                    <div className="project-footer">

                        <span>
                            📁 Desarrollo
                        </span>

                        <span className="price">
                            Bs. 5,000
                        </span>

                    </div>

                </div>

                <div className="project-item">

                    <h2>
                        Proyecto Ejemplo 2
                    </h2>

                    <p>
                        Descripcion breve del proyecto aqui...
                    </p>

                    <div className="project-footer">

                        <span>
                            📁 Desarrollo
                        </span>

                        <span className="price">
                            Bs. 5,000
                        </span>

                    </div>

                </div>

                <div className="project-item">

                    <h2>
                        Proyecto Ejemplo 3
                    </h2>

                    <p>
                        Descripcion breve del proyecto aqui...
                    </p>

                    <div className="project-footer">

                        <span>
                            📁 Desarrollo
                        </span>

                        <span className="price">
                            Bs. 5,000
                        </span>

                    </div>

                </div>

                <button
                    className="back-button"

                    onClick={() =>
                        router.push("/menuCliente")
                    }
                >
                    Volver
                </button>

            </div>

        </div>
    );
}