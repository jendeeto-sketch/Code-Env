import fetch from "node-fetch";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function run() {
  const mcpRes = await fetch("https://mcp.meli.im/mcp/melinet", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MELI_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "query",
      data: { input: "get data" },
    }),
  });

  if (!mcpRes.ok) {
    throw new Error(`MCP request failed: ${mcpRes.status} ${mcpRes.statusText}`);
  }

  const mcpData = await mcpRes.json();

  const aiRes = await openai.responses.create({
    model: "gpt-5.3",
    input: `Analyze this: ${JSON.stringify(mcpData)}`,
  });

  console.log(aiRes.output[0].content[0].text);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
