"use client";

import { useRouter } from "next/navigation";
import "./MenuFreelancer.css";

export default function MenuFreelancer() {

    const router = useRouter();

    return (
        <div className="freelancer-page">

            <main className="freelancer-content">

                <section className="freelancer-hero">

                    <div className="freelancer-info">

                        <span>Panel Freelancer</span>

                        <h1>
                            Encuentra proyectos y envía propuestas profesionales
                        </h1>

                        <p>
                            Explora proyectos disponibles, postúlate con propuestas claras
                            y administra tus oportunidades dentro de ProTask.
                        </p>

                    </div>

                    <div className="freelancer-profile-card">

                        <div className="freelancer-avatar">
                            D
                        </div>

                        <h3>david</h3>

                        <p>nose123@ucb.edu</p>

                        <div className="freelancer-role">
                            Rol: Freelancer
                        </div>

                    </div>

                </section>

                <section className="freelancer-cards">

                    <div className="freelancer-card">

                        <div className="card-number">
                            01
                        </div>

                        <h3>Explorar Proyectos</h3>

                        <p>
                            Busca proyectos publicados por clientes y encuentra nuevas oportunidades.
                        </p>

                        <button
                            onClick={() =>
                                router.push("/menuFreelancer/explorarProyectos")
                            }
                        >
                            Explorar
                        </button>

                    </div>

                    <div className="freelancer-card">

                        <div className="card-number">
                            02
                        </div>

                        <h3>Mis Propuestas</h3>

                        <p>
                            Revisa las propuestas que enviaste y consulta su estado.
                        </p>

                        <button
                            onClick={() =>
                                router.push("/menuFreelancer/misPropuestas")
                            }
                        >
                            Ver propuestas
                        </button>

                    </div>

                    <div className="freelancer-card">

                        <div className="card-number">
                            03
                        </div>

                        <h3>Mis Trabajos</h3>

                        <p>
                            Consulta los trabajos que tienes actualmente asignados.
                        </p>

                        <button
                            onClick={() =>
                                router.push("/menuFreelancer/verMisTrabajos")
                            }
                        >
                            Ver trabajos
                        </button>

                    </div>

                    <div className="freelancer-card">

                        <div className="card-number">
                            04
                        </div>

                        <h3>Cerrar Sesión</h3>

                        <p>
                            Sal de tu cuenta de freelancer de forma segura.
                        </p>

                        <button
                            className="logout-button"
                            onClick={() => router.push("/login")}
                        >
                            Cerrar sesión
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}