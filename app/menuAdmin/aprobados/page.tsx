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

export default function AprobadosPage() {
    const [usuarios, setUsuarios] =
    useState<User[]>([]);
    async function cargarUsuarios() {

        try {

        const token =
            localStorage.getItem("token");

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

        // FILTRAR SOLO ACTIVOS
        const aprobados = data.data.filter(
            (user: User) =>
            user.status.toLowerCase() === "activo"
        );

        setUsuarios(aprobados);

        } catch (error) {

        console.log(error);

        }
    }

    useEffect(() => {

        cargarUsuarios();

    }, []);

  return (
    <div>
        <Navbar
            title="Usuarios Aprobados"
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

            />

            ))}

        </div>

    </div>
  );
}