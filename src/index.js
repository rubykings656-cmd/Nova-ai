
export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return Response.json(
        { error: "Use POST to chat with NOVA AI." },
        { status: 405, headers: corsHeaders }
      );
    }

    try {
      const { message } = await request.json();

      if (!message || typeof message !== "string") {
        return Response.json(
          { error: "Please enter a message." },
          { status: 400, headers: corsHeaders }
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
              { role: "user", content: message }
            ]
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return Response.json(
          { error: data.error?.message || "AI service error." },
          { status: response.status, headers: corsHeaders }
        );
      }

      return Response.json(
        { reply: data.choices?.[0]?.message?.content || "No reply received." },
        { headers: corsHeaders }
      );

    } catch (error) {
      return Response.json(
        { error: "NOVA AI could not process your message." },
        { status: 500, headers: corsHeaders }
      );
    }
  }
};
