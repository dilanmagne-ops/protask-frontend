"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Navbar from "../../../components/Navbar/Navbar";

import "./aprobados.css";

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
};

export default function AprobadosPage()
{
    const [usuarios, setUsuarios] =
    useState<User[]>([]);

    const [search, setSearch] =
    useState("");

    async function cargarUsuarios()
    {
        try
        {
            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:3000/api/users",
                {
                    headers:
                    {
                        Authorization:
                        `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            console.log(data);

            const aprobados = data.data.filter(
                (user: User) =>
                user.status.toLowerCase() === "activo"
            );

            setUsuarios(aprobados);

        }
        catch (error)
        {
            console.log(error);
        }
    }

    useEffect(() =>
    {
        cargarUsuarios();
    }, []);

    const usuariosFiltrados =
        usuarios.filter((user) =>
            user.name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            user.email
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            user.role
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    return (
        <main className="aprobados-page">

            <Navbar
                title="Usuarios Aprobados"
                items={["Admin"]}
            />

            <section className="aprobados-hero">

                <div>

                    <span className="aprobados-badge">
                        Panel Administrador
                    </span>

                    <h1>
                        Usuarios Aprobados
                    </h1>

                    <p>
                        Consulta las cuentas activas del sistema y revisa
                        la información principal de cada usuario aprobado.
                    </p>

                </div>

                <div className="aprobados-summary">

                    <span>
                        Total aprobados
                    </span>

                    <strong>
                        {usuarios.length}
                    </strong>

                    <p>
                        Usuarios activos en ProTask
                    </p>

                </div>

            </section>

            <section className="aprobados-content">

                <div className="aprobados-toolbar">

                    <div>
                        <h2>
                            Lista de usuarios activos
                        </h2>

                        <p>
                            Busca por nombre, correo o rol.
                        </p>
                    </div>

                    <Link href="/menuAdmin" className="back-link">
                        Volver al menú
                    </Link>

                </div>

                <input
                    type="text"
                    placeholder="Buscar usuarios aprobados..."
                    className="search-input"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <div className="users-list">

                    {
                        usuariosFiltrados.length === 0
                        ? (
                            <div className="empty-users">

                                <h3>
                                    No se encontraron usuarios aprobados
                                </h3>

                                <p>
                                    No hay usuarios activos o la búsqueda no coincide.
                                </p>

                            </div>
                        )
                        : (
                            usuariosFiltrados.map((user) =>
                            (
                                <div
                                    className="user-card"
                                    key={user.id}
                                >

                                    <div className="user-card-header">

                                        <div className="user-avatar">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>

                                        <div>
                                            <h3>
                                                {user.name}
                                            </h3>

                                            <p>
                                                {user.email}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="user-info">

                                        <div>
                                            <span>
                                                Rol
                                            </span>

                                            <strong>
                                                {user.role}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Estado
                                            </span>

                                            <strong className="status-active">
                                                {user.status}
                                            </strong>
                                        </div>

                                    </div>

                                </div>
                            ))
                        )
                    }

                </div>

            </section>

        </main>
    );
}