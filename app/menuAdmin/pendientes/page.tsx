"use client";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import UserCard from "../../../components/UserCard/Usercard";


const usuariosPendientes = [
  {
    id: "1",
    name: "Juan Perez",
    email: "juan@gmail.com",
    role: "freelancer",
    status: "Pendiente",
  },

  {
    id: "2",
    name: "Ana Torres",
    email: "ana@gmail.com",
    role: "cliente",
    status: "Pendiente",
  },
];

export default function PendientesPage() {

  function aprobarUsuario(id: string) {
    console.log("APROBAR", id);
  }

  function rechazarUsuario(id: string) {
    console.log("RECHAZAR", id);
  }

  return (
    <div>

      <Navbar
        title="Usuarios Pendientes"
        items={["Admin"]}
      />

      <div className="products-container">

        {usuariosPendientes.map((user) => (

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