/**
 * This program prompts the user to enter their name and hometown
 * and then uses GPT-3 language model to generate a limerick about the user.
 */

import { gptPrompt } from "./shared/openai.js";
import { ask, say } from "./shared/cli.js";

main();

async function main() {
  say("Hello, GPT!");

  const name = await ask("What is your name?");
  const town = await ask("Where are you from?");

  say("");

  // Modify `limerick.js`  to generate Haikus
  const prompt =
    ` Create a Haiku for someone named ${name} who comes from ${town} in traditional structure (5-7-5 syllable pattern) that captures the essence of the name and the spirit of her/his hometown.`;

  const haiku = await gptPrompt(prompt, { temperature: 0.7 });
  say(`"""\n${haiku}\n"""`);
}
