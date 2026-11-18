

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle browser preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Serve NOVA AI website
    if (request.method === "GET") {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== "POST") {
      return Response.json(
        { error: "Method not allowed" },
        { status: 405, headers: corsHeaders }
      );
    }

    try {
      const body = await request.json();
      const message = body.message;

      if (!message || typeof message !== "string") {
        return Response.json(
          { error: "Please enter a message." },
          { status: 400, headers: corsHeaders }
        );
      }

      if (!env.OPENROUTER_API_KEY) {
        return Response.json(
          { error: "NOVA AI API key is not configured." },
          { status: 500, headers: corsHeaders }
        );
      }

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://nova-ai.rubykings656.workers.dev",
            "X-Title": "NOVA AI"
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are NOVA AI, a helpful, friendly and intelligent assistant created by MESLER TECHNOLOGIES."
              },
              {
                role: "user",
                content: message
              }
            ]
          })
        }
      );

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error("Invalid OpenRouter response:", responseText);

        return Response.json(
          { error: "The AI service returned an invalid response. Please try again." },
          { status: 502, headers: corsHeaders }
        );
      }

      if (!response.ok) {
        console.error("OpenRouter error:", data);

        return Response.json(
          {
            error: data.error?.message || "The AI service is temporarily unavailable."
          },
          { status: response.status, headers: corsHeaders }
        );
      }

      const reply = data.choices?.[0]?.message?.content;

      if (!reply) {
        return Response.json(
          { error: "NOVA AI received an empty reply. Please try again." },
          { status: 502, headers: corsHeaders }
        );
      }

      return Response.json(
        { reply },
        { status: 200, headers: corsHeaders }
      );

    } catch (error) {
      console.error("NOVA Worker error:", error);

      return Response.json(
        { error: "NOVA AI could not process your message." },
        { status: 500, headers: corsHeaders }
      );
    }
  }
};
