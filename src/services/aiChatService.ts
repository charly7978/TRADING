// Servicio para interactuar con un modelo de IA real gratuito (Hugging Face Inference API)
// Modelo por defecto: mistralai/Mistral-7B-Instruct-v0.2 (gratuito, sin API Key para uso limitado)

export async function askAI(question: string, context: string = ""): Promise<string> {
  const endpoint = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
  // Puedes cambiar el modelo por otro gratuito de Hugging Face si lo deseas

  const payload = {
    inputs: context ? `${context}\nUsuario: ${question}\nAI:` : `Usuario: ${question}\nAI:`
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // Si tienes un token de Hugging Face, puedes agregarlo aquí:
        // "Authorization": "Bearer TU_TOKEN"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      return "[La IA gratuita está saturada o no disponible en este momento. Intenta de nuevo más tarde.]";
    }
    const data = await response.json();
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.replace(/^.*AI:/, "").trim();
    }
    if (typeof data.generated_text === "string") {
      return data.generated_text.replace(/^.*AI:/, "").trim();
    }
    return "[No se pudo obtener respuesta de la IA gratuita.]";
  } catch (e) {
    return "[Error de conexión con la IA gratuita.]";
  }
}
