/**
 * This program "fakes" a text adventure game using Javascript and GPT.
 * It provides a basic loop which prompts the user for commands and then prompts
 * GPT with some high level instructions, the last few GPT responses
 * for context, and the users command.
 *
 * If the user "plays along" the experience is suprisingly similar to a true
 * text adventure game. But the user can easily "break" the game by issuing
 * outlandish commands.
 */

import { gptPrompt } from "./shared/openai.js";
import { ask, say } from "./shared/cli.js";

main();

async function main() {
  say("Welcome to the urban jungle, adventurer!");

  const context = [];
  let playing = true;
  const location = "the streets of New York City";
  const player = {};
  player.name = await ask("What's your name, newcomer?");
  player.class = await ask(
    "What's your hustle? You a hustler, a dreamer, or maybe a bit of both?",
  );
  say("Alright, let's dive into the heart of the city.");

  while (playing) {
    const command = await ask("What's your move?");
    if (command.toLowerCase() == "quit") {
      playing = false;
      say("Catch you on the flip side.");
      break;
    }

    const prompt = `
This is a text adventure game set in the heart of New York City.
The player, a ${player.class}, goes by the name ${player.name}, navigating through ${location}.

Recently: ${context.slice(-3).join(" ")}

Adopt a New Yorker's tone—direct, witty, and a bit cynical.
Narrate in second person, keeping it real and grounded.
Give life to the bustling streets, the diverse characters, and the city's unending energy.
When describing actions or locations, add a touch of the city's humor and sharpness.

The player's command is '${command}'.
`;

    const response = await gptPrompt(prompt, {
      max_tokens: 128,
      temperature: 0.5,
    });
    context.push(response);
    say(`\n"${response}"\n`);
  }
}
