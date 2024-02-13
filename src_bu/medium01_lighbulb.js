import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";

async function main() {
  say("Welcome to the Light Bulb Joke Generator!");

  const subject = await ask(
    "Give me a subject, and I'll create a light bulb joke for you~",
  );

  // Generating the joke using GPT with a playful tone
  const jokePrompt = `Create a light bulb joke about ${subject}.`;
  const joke = await gptPrompt(jokePrompt, {
    max_tokens: 80,
    temperature: 0.5,
  });

  say(`Here's your lighbulb joke on ${subject} : \n${joke}`);
}

main();
