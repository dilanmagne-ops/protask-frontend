"use client";
import "./Usercard.css";

type UserCardProps = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;

  onApprove?: () => void;
  onReject?: () => void;
};

export default function Usercard({
  id,
  name,
  email,
  role,
  status,
}: UserCardProps) {
    async function aprobarUsuario(id: string) {

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
            `http://localhost:3000/api/users/${id}/verify`,
            {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            }
            );
            const data = await response.json();
            if (!response.ok) {
                alert("Error al aprobar usuario");
                console.log(data);
                return;
            }
            alert("Usuario aprobado");
            // Recargar página
            window.location.reload();
        } catch (error) {
        console.log(error);
        alert("Error de conexión");
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

            alert("Error al rechazar usuario");

            return;
            }

            alert("Usuario rechazado");

            window.location.reload();

        } catch (error) {

            console.log(error);

            alert("Error de conexión");
        }
    }
  return (
    <div className="card">
        <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="Usuario"
        />

        <h2>{name}</h2>

        <p>{email}</p>

        <p>
            Rol: {role}
        </p>

        <h3>{status}</h3>
        {
            status.toLowerCase() === "pendiente" && (

                <div className="buttons-container">

                <button
                    className="approve-button"
                    onClick={() => aprobarUsuario(id)}
                >
                    Aprobar Usuario
                </button>

                <button
                    className="reject-button"
                    onClick={() => rechazarUsuario(id)}
                >
                    Rechazar Usuario
                </button>

                </div>
            )
        }
    </div>
  );
}