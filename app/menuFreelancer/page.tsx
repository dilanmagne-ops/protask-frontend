"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


import Navbar from "../../components/Navbar/Navbar";

import "./MenuFreelancer.css";

type User =
{
    id: string;
    name: string;
    email: string;
    role: string;
};

export default function MenuFreelancer()
{
    const router = useRouter();

    const [user, setUser] =
    useState<User | null>(null);

    useEffect(() =>
    {
        const userGuardado =
        localStorage.getItem("user");

        if (!userGuardado)
        {
            router.push("/login");
            return;
        }

        const userParseado =
        JSON.parse(userGuardado);

        if (userParseado.role !== "freelancer")
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
        <div>

            <Navbar
                title={`Bienvenido ${user?.name}`}
                items={[
                    "Explorar Proyectos",
                    "Mis Propuestas",
                ]}
            />

            <div className="freelancer-container">

                <h1>
                    Panel Freelancer
                </h1>

                <p>
                    Encuentra proyectos,
                    envía propuestas
                    y administra tus trabajos.
                </p>

                <div className="freelancer-buttons">

                    <button
                        onClick={() =>
                            router.push(
                            "/menuFreelancer/explorarProyectos"
                            )
                        }
                    >
                        Explorar Proyectos
                    </button>

                    <button
                        onClick={() =>
                            router.push(
                            "/menuFreelancer/misPropuestas"
                            )
                        }
                    >
                        Mis Propuestas
                    </button>
                    <button
                        onClick={() =>
                            router.push("/menuFreelancer/verMisTrabajos")
                        }
                    >
                        Mis Trabajos
                    </button>
                    <button
                        onClick={cerrarSesion}
                    >
                        Cerrar Sesión
                    </button>

                </div>

            </div>

        </div>
    );
}