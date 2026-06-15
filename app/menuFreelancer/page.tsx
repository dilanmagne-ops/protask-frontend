"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar/Navbar";

import "./MenuFreelancer.css";

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

export default function MenuFreelancer() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userGuardado = localStorage.getItem("user");

        if (!userGuardado) {
            router.push("/login");
            return;
        }

        const userParseado = JSON.parse(userGuardado);

        if (userParseado.role !== "freelancer") {
            router.push("/login");
            return;
        }

        setUser(userParseado);
    }, [router]);

    function verMiPerfil() {
        if (!user?.id) {
            alert("No se encontró el ID del usuario.");
            return;
        }

        router.push(`/perfil/${user.id}`);
    }

    function cerrarSesion() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.push("/login");
    }

    return (
        <div className="freelancer-page">

            <Navbar
                title={`Bienvenido ${user?.name || "Freelancer"}`}
                items={[
                    "Explorar Proyectos",
                    "Mis Propuestas",
                    "Mis Trabajos",
                    "Ver Mi Perfil",
                ]}
            />

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
                            {user?.name?.charAt(0).toUpperCase() || "F"}
                        </div>

                        <h3>
                            {user?.name || "Freelancer"}
                        </h3>

                        <p>
                            {user?.email || "Correo no disponible"}
                        </p>

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

                        <h3>Ver Mi Perfil</h3>

                        <p>
                            Consulta los datos de tu cuenta y revisa cómo se ve tu perfil.
                        </p>

                        <button onClick={verMiPerfil}>
                            Ver mi perfil
                        </button>

                    </div>

                    <div className="freelancer-card">

                        <div className="card-number">
                            05
                        </div>

                        <h3>Cerrar Sesión</h3>

                        <p>
                            Sal de tu cuenta de freelancer de forma segura.
                        </p>

                        <button
                            className="logout-button"
                            onClick={cerrarSesion}
                        >
                            Cerrar sesión
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}