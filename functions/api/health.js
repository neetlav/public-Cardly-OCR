export async function onRequestGet(context) {
  const provider = new URL(context.request.url).searchParams.get('provider') || 'openai';
  const configured = provider === 'anthropic' ? Boolean(context.env.ANTHROPIC_API_KEY)
    : provider === 'gemini' ? Boolean(context.env.GEMINI_API_KEY)
    : provider === 'compatible' ? Boolean(context.env.COMPATIBLE_AI_API_KEY && context.env.COMPATIBLE_AI_ENDPOINT)
    : Boolean(context.env.OPENAI_API_KEY);
  return Response.json({ configured }, { headers: { 'cache-control': 'no-store' } });
}
