import { createServerFn } from "@tanstack/react-start";

type Pick = { circle: string; text: string };

export const generateIdea = createServerFn({ method: "POST" })
  .inputValidator((input: { picks: Pick[] }) => {
    const picks = (input?.picks ?? []).slice(0, 4).map((p) => ({
      circle: String(p.circle).slice(0, 20),
      text: String(p.text).slice(0, 300),
    }));
    if (picks.length < 1) throw new Error("No answers to combine");
    return { picks };
  })
  .handler(async ({ data }) => {
    const { generateResponse, GatewayError } = await import("@lovable.dev/ai-gateway");
    const list = data.picks.map((p) => `${p.circle}: ${p.text}`).join("\n");
    try {
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions:
          "You write playful, concrete hatarakigai (work worth doing) ideas for a reflective journaling app. Combine ALL the given journal fragments into ONE small, specific idea for work or a tiny real world experiment the person could try this week. Write one short paragraph, 2 to 4 sentences, British English, warm, speaking to 'you'. Offer it as a possibility to explore, never as their purpose or a verdict about them. Never use hyphens or dashes of any kind, and never use the word 'quiet'. No headings, no lists.",
        input: `Journal fragments (circle: answer):\n${list}`,
      });
      let text = "";
      for (const item of res.output ?? []) {
        if (item.type === "message") for (const c of item.content ?? []) if (c.type === "output_text") text += c.text;
      }
      text = text.replace(/\s*[\u2010-\u2015-]\s*/g, ", ").trim();
      return { idea: text || null, error: text ? null : "No idea came back this time. Try again?" };
    } catch (e) {
      if (e instanceof GatewayError) {
        console.error("idea gateway error", e.code, e.ids);
        if (e.code === "rate_limited" || e.httpStatus === 429) return { idea: null, error: "Lots of ideas being brewed right now... give it a moment and try again." };
        if (e.httpStatus === 402) return { idea: null, error: "The idea engine has run out of credits for now." };
      } else console.error(e);
      return { idea: null, error: "Something went wrong brewing that idea. Try again in a moment." };
    }
  });
