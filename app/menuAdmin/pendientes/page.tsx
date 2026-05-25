"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import UserCard from "../../../components/UserCard/Usercard";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

export default function PendientesPage() {
    const [usuarios, setUsuarios] = useState<User[]>([]);

    async function cargarUsuarios() {

        try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:3000/api/users",
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        const data = await response.json();

        console.log(data);

        // FILTRAR SOLO PENDIENTES
        const pendientes = data.data.filter(
            (user: User) =>
            user.status.toLowerCase() === "pendiente_verificacion"
        );

        setUsuarios(pendientes);

        } catch (error) {
        console.log(error);
        }
    }

    useEffect(() => {
        cargarUsuarios();
    }, []);

    async function aprobarUsuario(id: string) {

        try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:3000/api/users/${id}/verify`,
            {
            method: "PATCH",

            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        if (!response.ok) {
            alert("Error al aprobar");
            return;
        }

        alert("Usuario aprobado");

        cargarUsuarios();

        } catch (error) {
        console.log(error);
        }
    }

    async function rechazarUsuario(id: string) {

        try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            `http://localhost:3000/api/users/${id}`,
            {
            method: "DELETE",

            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        if (!response.ok) {
            alert("Error al rechazar");
            return;
        }

        alert("Usuario rechazado");

        cargarUsuarios();

        } catch (error) {
        console.log(error);
        }
    }

    return (
        <div>

        <Navbar
            title="Usuarios Pendientes"
            items={["Admin"]}
        />
        <div className="buttons-container">
        <Link href="/menuAdmin">
            <button className="back-button">
            Volver al menú
            </button>
        </Link>
        </div>
        <div className="products-container">

            {usuarios.map((user) => (

            <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                email={user.email}
                role={user.role}
                status={user.status}

                onApprove={() =>
                aprobarUsuario(user.id)
                }

                onReject={() =>
                rechazarUsuario(user.id)
                }
            />

            ))}

        </div>

        </div>
    );
}