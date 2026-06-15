"use client";

import { useParams, useRouter } from "next/navigation";

export default function VerAvancePage()
{
    const router = useRouter();
    const params = useParams();

    const projectId =
        Array.isArray(params.id)
        ? params.id[0]
        : params.id;

    return (
        <main style={{ padding: "40px" }}>
            <h1>Avance del Proyecto</h1>

            <p>
                Proyecto ID: {projectId}
            </p>

            <p>
                Aquí luego puedes mostrar las entregas, comentarios o avances
                enviados por el freelancer.
            </p>

            <button
                onClick={() =>
                    router.push("/menuCliente/verMisProyectos")
                }
            >
                Volver a mis proyectos
            </button>
        </main>
    );
}