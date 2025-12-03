export const handler = async (
  req: Request,
): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const requestData = await req.json();
    const { ventText, conversationHistory, currentPhase, hasVented, breathingCompleted, actionsTaken } = requestData;
    
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    
    if (!GROQ_API_KEY || GROQ_API_KEY === "your_grok_api_key_here") {
      // Fallback to local reflections if no API key
      const reflections = [
        "It sounds like this situation made you feel disrespected. Pole sana.",
        "Your feelings are valid. Sometimes taking a break helps us see things more clearly.",
        "What would help you feel better right now? Talking to someone? Taking a walk?",
        "Remember: 'Hasira hasara' (Anger is loss). You're doing the right thing by processing this."
      ];
      return new Response(
        JSON.stringify({ 
          reflection: reflections[Math.floor(Math.random() * reflections.length)],
          source: "local"
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Build conversation messages for therapist mode
    const messages = [];
    
    if (conversationHistory && conversationHistory.length > 0) {
      // Therapist mode - ongoing conversation with phase context
      let systemContext = `You are Feel-Yah, a warm and culturally-aware therapist for Kenyan youth experiencing anger. Your approach:

1. Active Listening: Reflect back what you hear to show understanding
2. Cultural Sensitivity: Use Swahili/Sheng phrases naturally (Pole sana, Hakuna stress, Tutashinda)
3. Validation: Acknowledge their feelings without judgment
4. Gentle Guidance: Ask open questions to help them process emotions
5. Practical Steps: When appropriate, suggest small, concrete actions
6. Brief Responses: Keep replies under 60 words, conversational and supportive

You're not here to fix them, but to help them feel heard and process their anger safely. Speak like a trusted friend who cares deeply.

CURRENT CONTEXT:
- Phase: ${currentPhase}/3 (1=Calm, 2=Express, 3=Act)`;

      if (breathingCompleted) {
        systemContext += `\n- They've completed breathing exercises (Phase 1)`;
      }
      if (hasVented) {
        systemContext += `\n- They've expressed their anger through venting (Phase 2)`;
      }
      if (actionsTaken) {
        systemContext += `\n- They're taking constructive actions (Phase 3)`;
      }
      
      systemContext += `\n\nReference their progress when relevant. Celebrate small wins. Guide them toward the next helpful step.`;
      
      messages.push({
        role: "system",
        content: systemContext
      });
      
      // Add conversation history
      conversationHistory.forEach((msg: { role: string; text: string }) => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      });
      
      // Add current message
      messages.push({
        role: "user",
        content: ventText
      });
    } else {
      // Single reflection mode (vent to void)
      messages.push({
        role: "system",
        content: `You are a culturally-aware mental health supporter for Kenyan youth. When someone shares their anger, provide:
1. Empathetic validation in 1-2 sentences
2. A brief Swahili or Sheng phrase when appropriate (like "Pole sana" or "Hasira hasara")
3. A gentle question or suggestion for next steps
Keep responses under 50 words, warm, and culturally grounded in Kenyan context.`
      });
      
      messages.push({
        role: "user",
        content: `I'm feeling angry about: ${ventText}`
      });
    }

    // Call Groq API (Fast LLM inference)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        messages: messages,
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 150
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Groq API error: ${response.status}`, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const reflection = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ reflection, source: "groq" }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Groq API Error:", error);
    
    // Fallback response
    const fallbackReflections = [
      "It sounds like this situation made you feel disrespected. Pole sana.",
      "Your feelings are valid. Sometimes taking a break helps us see things more clearly.",
      "What would help you feel better right now? Talking to someone? Taking a walk?",
      "Remember: 'Hasira hasara' (Anger is loss). You're doing the right thing by processing this."
    ];
    
    return new Response(
      JSON.stringify({ 
        reflection: fallbackReflections[Math.floor(Math.random() * fallbackReflections.length)],
        source: "fallback"
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
};
