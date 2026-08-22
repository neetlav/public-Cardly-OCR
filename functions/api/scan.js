const headers = { 'content-type': 'application/json', 'cache-control': 'no-store' };
const prompt = 'Detect every business card in this image. Return JSON only as {"contacts":[...]}. Each contact has first_name, middle_name, last_name, designation, company_name, emails, mobiles, phones, addresses, website, notes. emails, mobiles, phones and addresses are arrays. Leave notes blank. Do not invent information.';

function imageParts(image) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(image || '');
  if (!match) throw new Error('Use a JPG, PNG, or WebP image.');
  return { mimeType: match[1], data: match[2] };
}
function json(text) { return JSON.parse(String(text || '').replace(/^```json\s*|\s*```$/g, '').trim()); }
async function failure(upstream) {
  let message = 'The AI provider did not complete the scan.';
  try { const body = await upstream.json(); message = body.error?.message || body.error || message; } catch (_) {}
  return Response.json({ error: message }, { status: upstream.status, headers });
}

export async function onRequestPost(context) {
  const { image, provider = 'openai', model } = await context.request.json();
  if (typeof image !== 'string' || !image.startsWith('data:image/') || image.length > 8_000_000) return Response.json({ error: 'Use a JPG, PNG, or WebP image smaller than 6 MB.' }, { status: 400, headers });
  const { mimeType, data } = imageParts(image);
  let upstream;
  if (provider === 'anthropic') {
    if (!context.env.ANTHROPIC_API_KEY) return Response.json({ error: 'Add ANTHROPIC_API_KEY in Cloudflare Pages → Settings → Variables and Secrets.' }, { status: 503, headers });
    upstream = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': context.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model, max_tokens: 1600, messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: mimeType, data } }, { type: 'text', text: prompt }] }] }) });
    if (!upstream.ok) return failure(upstream);
    const body = await upstream.json();
    return Response.json(json(body.content?.filter(part => part.type === 'text').map(part => part.text).join('')), { headers });
  }
  if (provider === 'gemini') {
    if (!context.env.GEMINI_API_KEY) return Response.json({ error: 'Add GEMINI_API_KEY in Cloudflare Pages → Settings → Variables and Secrets.' }, { status: 503, headers });
    upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': context.env.GEMINI_API_KEY }, body: JSON.stringify({ contents: [{ parts: [{ inline_data: { mime_type: mimeType, data } }, { text: prompt }] }], generationConfig: { response_mime_type: 'application/json' } }) });
    if (!upstream.ok) return failure(upstream);
    const body = await upstream.json();
    return Response.json(json(body.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('')), { headers });
  }
  if (provider === 'compatible') {
    if (!context.env.COMPATIBLE_AI_API_KEY || !context.env.COMPATIBLE_AI_ENDPOINT) return Response.json({ error: 'Add COMPATIBLE_AI_API_KEY and COMPATIBLE_AI_ENDPOINT in Cloudflare Pages → Settings → Variables and Secrets.' }, { status: 503, headers });
    upstream = await fetch(context.env.COMPATIBLE_AI_ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${context.env.COMPATIBLE_AI_API_KEY}` }, body: JSON.stringify({ model, response_format: { type: 'json_object' }, messages: [{ role: 'user', content: [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: image, detail: 'high' } }] }] }) });
  } else {
    if (!context.env.OPENAI_API_KEY) return Response.json({ error: 'Add OPENAI_API_KEY in Cloudflare Pages → Settings → Variables and Secrets.' }, { status: 503, headers });
    upstream = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${context.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model, response_format: { type: 'json_object' }, messages: [{ role: 'user', content: [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: image, detail: 'high' } }] }] }) });
  }
  if (!upstream.ok) return failure(upstream);
  return Response.json(json((await upstream.json()).choices?.[0]?.message?.content), { headers });
}
