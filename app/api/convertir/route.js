export const runtime = "nodejs";

export async function POST(request) {
  try {
    const apiUrl = process.env.API_URL;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": request.headers.get("content-type") || "",
      },
      body: request.body, 
      duplex: "half",
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Error en la API interna" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="convertido.csv"',
      },
    });

  } catch (error) {
    console.error("Error en el backend local:", error);
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}