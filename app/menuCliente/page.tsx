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
        <div>

            <Navbar
                title={`Bienvenido ${user?.name}`}
                items={[
                    "Buscar Freelancers",
                    "Mis Proyectos",
                    "Propuestas Recibidas",
                ]}
            />

            <div className="cliente-container">

                <h1>
                    Panel Cliente
                </h1>

                <p>
                    Publica proyectos,
                    encuentra freelancers
                    y administra tus trabajos.
                </p>

                <div className="cliente-buttons">

                    <button
                        onClick={() =>
                            router.push("/menuCliente/MisProyectos")
                        }
                    >
                        Mis Proyectos
                    </button>

                    <button
                        onClick={() =>
                            router.push("/menuCliente/crearProyecto")
                        }
                    >
                        Crear Proyecto
                    </button>

                    <button
                        onClick={() =>
                            router.push("/seleccionarFreelancer")
                        }
                    >
                        Propuestas Recibidas
                    </button>

                    <button
                        onClick={cerrarSesion}
                    >
                        Cerrar Sesion
                    </button>

                </div>

            </div>

        </div>
    );
}