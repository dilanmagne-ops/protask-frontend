"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar/Navbar";

import "./menuCliente.css";

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

export default function MenuCliente()
{
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() =>
    {
        const userGuardado = localStorage.getItem("user");

        if (!userGuardado)
        {
            router.push("/login");
            return;
        }

        const userParseado = JSON.parse(userGuardado);

        if (userParseado.role !== "cliente")
        {
            router.push("/login");
            return;
        }

        setUser(userParseado);

    }, [router]);

    function cerrarSesion()
    {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.push("/login");
    }

    return (
        <main className="cliente-page">

            <Navbar
                title={`Bienvenido ${user?.name || "Cliente"}`}
                items={[
                    "Mis Proyectos",
                    "Crear Proyecto",
                ]}
            />

            <section className="cliente-hero">

                <div className="cliente-content">

                    <span className="cliente-badge">
                        Panel de Cliente
                    </span>

                    <h1>
                        Administra tus proyectos de forma profesional
                    </h1>

                    <p>
                        Publica proyectos, revisa el estado de tus trabajos
                        y gestiona tus solicitudes desde un solo lugar.
                    </p>

                </div>

                <div className="cliente-user-card">

                    <div className="user-avatar">
                        {user?.name?.charAt(0).toUpperCase() || "C"}
                    </div>

                    <h2>
                        {user?.name || "Cliente"}
                    </h2>

                    <p>
                        {user?.email || "Correo no disponible"}
                    </p>

                    <span>
                        Rol: Cliente
                    </span>

                </div>

            </section>

            <section className="cliente-actions">

                <div
                    className="action-card"
                    onClick={() =>
                        router.push("/menuCliente/verMisProyectos")
                    }
                >
                    <span className="action-number">01</span>

                    <h3>
                        Mis Proyectos
                    </h3>

                    <p>
                        Revisa los proyectos que publicaste y controla su estado.
                    </p>

                    <button>
                        Ver proyectos
                    </button>
                </div>

                <div
                    className="action-card"
                    onClick={() =>
                        router.push("/menuCliente/crearProyecto")
                    }
                >
                    <span className="action-number">02</span>

                    <h3>
                        Crear Proyecto
                    </h3>

                    <p>
                        Publica una nueva solicitud para encontrar freelancers.
                    </p>

                    <button>
                        Crear proyecto
                    </button>
                </div>

                <div className="action-card logout-card">

                    <span className="action-number">03</span>

                    <h3>
                        Cerrar Sesión
                    </h3>

                    <p>
                        Sal de tu cuenta de forma segura.
                    </p>

                    <button onClick={cerrarSesion}>
                        Cerrar sesión
                    </button>

                </div>

            </section>

        </main>
    );
}