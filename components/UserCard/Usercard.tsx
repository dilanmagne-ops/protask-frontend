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
  name,
  email,
  role,
  status,
  onApprove,
  onReject,
}: UserCardProps) {

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
        status.toLowerCase() === "pendiente_verificacion" && (
          <>

            <button
              className="approve-button"
              onClick={onApprove}
            >
              Aprobar Usuario
            </button>

            <button
              className="reject-button"
              onClick={onReject}
            >
              Rechazar Usuario
            </button>

          </>
        )
      }

    </div>

  );
}