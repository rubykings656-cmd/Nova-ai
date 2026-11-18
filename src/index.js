


export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "GET") {
      return env.ASSETS.fetch(request);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    if (request.method !== "POST") {
      return Response.json(
        { error: "Method not allowed." },
        { status: 405, headers: corsHeaders }
      );
    }

    try {
      const { message } = await request.json();

      if (typeof message !== "string" || !message.trim()) {
        return Response.json(
          { error: "Please enter a message." },
          { status: 400, headers: corsHeaders }
        );
      }

      if (!env.OPENROUTER_API_KEY) {
        return Response.json(
          { error: "NOVA AI configuration is incomplete." },
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
            "X-Title": "NOVA AI by MESLER Technologies"
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are NOVA AI, an intelligent assistant by MESLER Technologies. Be helpful, clear, and friendly."
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
        return Response.json(
          { error: "The AI service returned an invalid response. Please try again." },
          { status: 502, headers: corsHeaders }
        );
      }

      console.log("OpenRouter status:", response.status);

      if (!response.ok) {
        return Response.json(
          { error: data.error?.message || "AI service error." },
          { status: 502, headers: corsHeaders }
        );
      }

      return Response.json(
        {
          reply: data.choices?.[0]?.message?.content || "No reply received."
        },
        { headers: corsHeaders }
      );

    } catch (error) {
      console.log("NOVA Worker error:", error.message);

      return Response.json(
        { error: "NOVA AI could not process your message." },
        { status: 500, headers: corsHeaders }
      );
    }
  }
};
