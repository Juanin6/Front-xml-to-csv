export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "Archivo no encontrado" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Reconstruimos el FormData
    const form = new FormData();
    form.append("file", file, file.name); 

    const apiUrl = process.env.API_URL;

    const response = await fetch(apiUrl, {
      method: "POST",
      body: form,
      
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Error en la API interna" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const blob = await response.blob();

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="convertido.csv"',
      },
    });
  } catch (error) {
    console.error("Error en el backend local:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
