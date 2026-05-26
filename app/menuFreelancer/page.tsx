import "./MenuFreelancer.css";

export default function MenuFreelancer() {
    return (
        <div className="freelancer-page">
            <div className="freelancer-card">
                <h1>Explorar Proyectos</h1>

                <div className="freelancer-tabs">
                    <button className="active-tab">
                        Proyectos Disponibles
                    </button>
                    <span>Freelancer</span>
                </div>

                <div className="search-box">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar proyectos..."
                    />
                </div>

                <div className="filters-box">
                    <h3>Filtros</h3>

                    <label>Categoría</label>
                    <select>
                        <option>Todas</option>
                        <option>Desarrollo</option>
                        <option>Diseño</option>
                        <option>Marketing</option>
                    </select>

                    <label>Presupuesto</label>
                    <div className="budget-row">
                        <input type="number" placeholder="Min" />
                        <input type="number" placeholder="Max" />
                    </div>

                    <label>Habilidades</label>
                    <input
                        type="text"
                        placeholder="Seleccionar..."
                    />
                </div>

                <div className="project-list">
                    <div className="project-card">
                        <h3>Proyecto Ejemplo 1</h3>
                        <p>Descripción breve del proyecto aquí...</p>
                        <div className="project-footer">
                            <span>📁 Desarrollo</span>
                            <strong>Bs. 5,000</strong>
                        </div>
                        <button>Ver detalle</button>
                    </div>

                    <div className="project-card">
                        <h3>Proyecto Ejemplo 2</h3>
                        <p>Descripción breve del proyecto aquí...</p>
                        <div className="project-footer">
                            <span>📁 Desarrollo</span>
                            <strong>Bs. 5,000</strong>
                        </div>
                        <button>Ver detalle</button>
                    </div>

                    <div className="project-card">
                        <h3>Proyecto Ejemplo 3</h3>
                        <p>Descripción breve del proyecto aquí...</p>
                        <div className="project-footer">
                            <span>📁 Desarrollo</span>
                            <strong>Bs. 5,000</strong>
                        </div>
                        <button>Ver detalle</button>
                    </div>
                </div>
            </div>
        </div>
    );
}