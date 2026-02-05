const SUPABASE_URL = "https://kxanfgxohnrjgudotdyj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4YW5mZ3hvaG5yamd1ZG90ZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyODEwMTcsImV4cCI6MjA4NTg1NzAxN30.5dROIdm6lGXAOxhQ22GlbYv352q_1S_BHF8k6xJChgc";

export async function submitSignature(data) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/signatures`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to submit signature: ${err}`);
  }

  return { success: true };
}
