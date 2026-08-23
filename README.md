# Cardly

Cardly turns photos of business cards into editable contacts. Review the result, save it in your browser, or export it as a VCF or CSV file.

**[Use Cardly in your browser →](https://public-cardly-ocr.pages.dev/)**  
No self-hosting is needed—configure your own browser API key in Settings.

You bring your own AI provider. Cardly has no user accounts and does not run its own database.

## Choose how to use Cardly

### Use a browser API key

Best for personal use.

1. Open **Settings** in Cardly.
2. Select **Browser API key**.
3. Choose OpenAI, Google Gemini, Anthropic Claude, or a custom provider.
4. Enter a vision-capable model and paste your API key.
5. Select **Save settings**, then return to **Scan**.

The key is saved only in that browser. Each card image is sent directly to the provider you choose.

### Self-host on Cloudflare Pages

Best when you want to run your own Cardly site without exposing an AI key to visitors.

1. Fork this repository on GitHub.
2. Create a Cloudflare Pages project connected to your fork.
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
7. In Cardly, open **Settings**, select **Cloudflare Secret**, choose the same provider and model, then save.

Your Cloudflare Pages Function sends scan requests to the selected provider. The provider key remains in Cloudflare, not in a visitor’s browser.

## AI providers

Use a model that supports image input.

| Provider | Where to create a key | Cloudflare secret |
| --- | --- | --- |
| OpenAI | [OpenAI API keys](https://platform.openai.com/api-keys) | `OPENAI_API_KEY` |
| Google Gemini | [Google AI Studio](https://aistudio.google.com/app/apikey) | `GEMINI_API_KEY` |
| Anthropic Claude | [Anthropic Console](https://console.anthropic.com/settings/keys) | `ANTHROPIC_API_KEY` |
| Other provider | Your provider’s console | `COMPATIBLE_AI_API_KEY` and `COMPATIBLE_AI_ENDPOINT` |

Other providers must offer an image-capable API compatible with OpenAI Chat Completions. Use the complete chat-completions URL as the endpoint.

## Run locally

You need a current version of Node.js and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev
```

For a production build:

```bash
pnpm run build
```

Cloudflare Pages publishes the `dist` directory and automatically deploys API routes from `functions/api`.

## Install Cardly on your phone

Install Cardly for quick, app-like access. Your contacts remain stored locally in that browser or installed app.

- **Android / Chrome:** open Cardly and tap **Install Cardly** on the Scan screen. You can also use the browser menu and choose **Install app**.
- **iPhone / iPad:** open Cardly in **Safari**, tap **Share**, then select **Add to Home Screen**.

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
- Always check extracted fields before saving or exporting.

## Need help?

Use the in-app **Support** page for setup modes, providers, exports, privacy, installation, and troubleshooting.