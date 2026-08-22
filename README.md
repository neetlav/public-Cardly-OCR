# Cardly

Cardly turns photos of business cards into editable contacts. Review the result, save it in your browser, or export it as a VCF or CSV file.

**[Open the live demo →](https://public-cardly-ocr.pages.dev/)**

You bring your own AI provider. Cardly has no user accounts and does not run its own database.

## Choose how to use Cardly

### Option 1 — Use a browser API key

This is the fastest option for personal use.

1. Open Cardly and go to **Settings**.
2. Select **Browser API key**.
3. Choose your provider and enter a vision-capable model.
4. Paste your API key.
5. Select **Save settings**, then return to **Scan**.

The key is saved only in that browser. Each card image is sent directly to the provider you choose when you scan.

### Option 2 — Self-host on Cloudflare Pages

This is the recommended option when you want to run your own Cardly site without exposing an AI key to visitors.

1. Fork this repository on GitHub.
2. In Cloudflare, create a **Pages** project and connect your fork.
3. Use these build settings:

   | Setting | Value |
   | --- | --- |
   | Framework preset | Vite |
   | Build command | `pnpm run build` |
   | Build output directory | `dist` |
   | Production branch | `main` |

4. Deploy once.
5. In **Pages → Settings → Variables and Secrets**, add the secret for your AI provider.
6. Redeploy after adding or changing a secret.
7. In your Cardly site, open **Settings**, choose **Cloudflare Secret**, select the same provider and model, then save.

Your Cloudflare Pages Function sends scan requests to the selected provider. The provider key stays in Cloudflare and is never placed in a visitor’s browser.

## AI providers

Choose a model that supports image input.

| Provider | Where to create a key | Cloudflare Secret |
| --- | --- | --- |
| OpenAI | [OpenAI API keys](https://platform.openai.com/api-keys) | `OPENAI_API_KEY` |
| Google Gemini | [Google AI Studio](https://aistudio.google.com/app/apikey) | `GEMINI_API_KEY` |
| Anthropic Claude | [Anthropic Console](https://console.anthropic.com/settings/keys) | `ANTHROPIC_API_KEY` |
| Other provider | Your provider’s console | `COMPATIBLE_AI_API_KEY` and `COMPATIBLE_AI_ENDPOINT` |

For an **Other provider**, it must offer an image-capable API compatible with OpenAI Chat Completions. The endpoint must be the complete chat-completions URL.

## Run locally

You need a current version of Node.js and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev
```

Open the local address shown in the terminal. For a production build:

```bash
pnpm run build
```

The built site is in `dist`. Cloudflare Pages automatically deploys the API routes in `functions/api`.

## Privacy and data

- Saved contacts and browser-mode settings stay in the browser on that device.
- Card images are sent only to the AI provider configured for a scan.
- In Cloudflare Secret mode, the image passes through your Cloudflare deployment to that provider; Cardly does not save it.
- Export contacts as **VCF** for contact apps or **CSV** for a spreadsheet backup.
- Export local data before clearing browser data or moving to a new device.

## Tips for better scans

- Use bright, even lighting.
- Keep the card flat, fully visible, and in focus.
- Avoid glare and heavy shadows.
- One card per photo gives the clearest review flow.
- Always check the extracted fields before saving or exporting.

## Need help?

The in-app **Support** page covers setup modes, providers, exports, privacy, and common troubleshooting steps.

## Keeping your fork up to date

Pull the latest changes from this repository into your fork, then let Cloudflare Pages deploy the new `main` branch. Your Cloudflare secrets remain in your own Cloudflare account.
