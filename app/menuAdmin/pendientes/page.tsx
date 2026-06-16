"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Navbar from "../../../components/Navbar/Navbar";

import "./pendientes.css";

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
};

export default function PendientesPage()
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
                "http://localhost:3001/api/users",
                {
                    headers:
                    {
                        Authorization:
                        `Bearer ${token}`,
                    },
                }
            );

            const data =
            await response.json();

            console.log(data);

            const pendientes = data.data.filter(
                (user: User) =>
                user.status.toLowerCase() === "pendiente_verificacion"
            );

            setUsuarios(pendientes);
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

    async function aprobarUsuario(id: string)
    {
        try
        {
            const token =
            localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3001/api/users/${id}/verify`,
                {
                    method: "PATCH",

                    headers:
                    {
                        Authorization:
                        `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok)
            {
                alert("Error al aprobar");
                return;
            }

            alert("Usuario aprobado");

            cargarUsuarios();
        }
        catch (error)
        {
            console.log(error);
        }
    }

    async function rechazarUsuario(id: string)
    {
        try
        {
            const token =
            localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3001/api/users/${id}`,
                {
                    method: "DELETE",

                    headers:
                    {
                        Authorization:
                        `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok)
            {
                alert("Error al rechazar");
                return;
            }

            alert("Usuario rechazado");

            cargarUsuarios();
        }
        catch (error)
        {
            console.log(error);
        }
    }

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
        <main className="pendientes-page">

            <Navbar
                title="Usuarios Pendientes"
                items={["Admin"]}
            />

            <section className="pendientes-hero">

                <div>

                    <span className="pendientes-badge">
                        Panel Administrador
                    </span>

                    <h1>
                        Usuarios Pendientes
                    </h1>

                    <p>
                        Revisa las solicitudes de registro, aprueba usuarios válidos
                        o rechaza cuentas que no correspondan.
                    </p>

                </div>

                <div className="pendientes-summary">

                    <span>
                        Total pendientes
                    </span>

                    <strong>
                        {usuarios.length}
                    </strong>

                    <p>
                        Usuarios esperando verificación
                    </p>

                </div>

            </section>

            <section className="pendientes-content">

                <div className="pendientes-toolbar">

                    <div>
                        <h2>
                            Lista de usuarios por verificar
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
                    placeholder="Buscar usuarios pendientes..."
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
                                    No se encontraron usuarios pendientes
                                </h3>

                                <p>
                                    No hay usuarios esperando verificación o la búsqueda no coincide.
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

                                            <strong className="status-pending">
                                                Pendiente
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="user-actions">

                                        <button
                                            className="approve-button"
                                            onClick={() =>
                                                aprobarUsuario(user.id)
                                            }
                                        >
                                            Aprobar
                                        </button>

                                        <button
                                            className="reject-button"
                                            onClick={() =>
                                                rechazarUsuario(user.id)
                                            }
                                        >
                                            Rechazar
                                        </button>

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