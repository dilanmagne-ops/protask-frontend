"use client";

import Navbar from "../../../components/Navbar/Navbar";
import UserCard from "../../../components/UserCard/Usercard";

const usuarios = [
  {
    id: "1",
    name: "Carlos Mendoza",
    email: "carlos@gmail.com",
    role: "freelancer",
    status: "Activo",
  },

  {
    id: "2",
    name: "Maria Lopez",
    email: "maria@gmail.com",
    role: "cliente",
    status: "Activo",
  },
];

export default function AprobadosPage() {

  return (
    <div>

      <Navbar
        title="Usuarios Aprobados"
        items={["Admin"]}
      />

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