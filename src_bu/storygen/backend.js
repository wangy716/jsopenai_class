import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

import { createExitSignal, staticServer } from "../shared/server.ts";
import { gptPrompt } from "../shared/openai.ts";

// change working dirctory to the current file's directory
Deno.chdir(new URL(".", import.meta.url).pathname);
// log the current working directory with friendly message
console.log(`Current working directory: ${Deno.cwd()}`);

const app = new Application();
const router = new Router();

router.get("/api/nonsense", async (ctx) => {
  const character = ctx.request.url.searchParams.get("character");
  const setting = ctx.request.url.searchParams.get("setting");
  const objectives = ctx.request.url.searchParams.get("objectives");
  const obstacles = ctx.request.url.searchParams.get("obstacles");
  const themes = ctx.request.url.searchParams.get("themes");
  console.log(
    "Character:",
    character,
    "Setting:",
    setting,
    "Objectives:",
    objectives,
    "Obstacles:",
    obstacles,
    "Themes:",
    themes,
  );

  const result = await gptPrompt(
    `Generate a one sentence story based on the character: ${character}, setting: ${setting}, objectives: ${objectives}, obstacles: ${obstacles}, themes: ${themes}`,
  );
  ctx.response.body = result;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

console.log("Listening on http://localhost:8000");

await app.listen({ port: 8000, signal: createExitSignal() });
