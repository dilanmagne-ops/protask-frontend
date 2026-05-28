"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../components/Navbar/Navbar";

import "./menuAdmin.css";

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

export default function MenuAdmin()
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

        if (userParseado.role !== "administrador")
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
        <main className="admin-page">

            <Navbar
                title={`Bienvenido ${user?.name || "Administrador"}`}
                items={[
                    "Usuarios Pendientes",
                    "Usuarios Aprobados",
                ]}
            />

            <section className="admin-hero">

                <div className="admin-content">

                    <span className="admin-badge">
                        Panel Administrador
                    </span>

                    <h1>
                        Gestiona usuarios y validaciones del sistema
                    </h1>

                    <p>
                        Administra las cuentas pendientes, revisa usuarios aprobados
                        y controla el acceso dentro de ProTask.
                    </p>

                </div>

                <div className="admin-user-card">

                    <div className="user-avatar">
                        {user?.name?.charAt(0).toUpperCase() || "A"}
                    </div>

                    <h2>
                        {user?.name || "Administrador"}
                    </h2>

                    <p>
                        {user?.email || "Correo no disponible"}
                    </p>

                    <span>
                        Rol: Administrador
                    </span>

                </div>

            </section>

            <section className="admin-actions">

                <div
                    className="action-card"
                    onClick={() =>
                        router.push("/menuAdmin/pendientes")
                    }
                >
                    <span className="action-number">01</span>

                    <h3>
                        Usuarios Pendientes
                    </h3>

                    <p>
                        Revisa las cuentas que esperan aprobación para ingresar al sistema.
                    </p>

                    <button>
                        Ver pendientes
                    </button>
                </div>

                <div
                    className="action-card"
                    onClick={() =>
                        router.push("/menuAdmin/aprobados")
                    }
                >
                    <span className="action-number">02</span>

                    <h3>
                        Usuarios Aprobados
                    </h3>

                    <p>
                        Consulta los usuarios que ya fueron validados dentro de ProTask.
                    </p>

                    <button>
                        Ver aprobados
                    </button>
                </div>

                <div className="action-card logout-card">

                    <span className="action-number">03</span>

                    <h3>
                        Cerrar Sesión
                    </h3>

                    <p>
                        Sal de tu cuenta de administrador de forma segura.
                    </p>

                    <button onClick={cerrarSesion}>
                        Cerrar sesión
                    </button>

                </div>

            </section>

        </main>
    );
}