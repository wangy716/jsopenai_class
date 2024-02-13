/**
 * This file implements a simple battle simulation between a fox and a cat
 * using JavaScript basic imperative code. The outcome of each attack is
 * described as a string.
 * After the battle simulation completes, the program prompts the gpt to write
 * a short story about the battle.
 * It then feeds this story back into gpt to summarize it.
 */

import { say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";

async function main() {
  const fox = { hp: 10, attack: 12, defense: 6 };
  const cat = { hp: 10, attack: 12, defense: 6 };

  let outline = "";
  while (fox.hp > 0 && cat.hp > 0) {
    outline += "The fox attacks the cat. ";
    if (Math.random() * fox.attack > Math.random() * cat.defense) {
      const damage = 2 + Math.floor(Math.random() * 5);
      cat.hp -= damage;
      outline += `The fox hits the cat doing ${damage} damage. `;
    } else {
      outline += "The fox misses the cat. ";
    }

    outline += "\n";

    outline += "The cat attacks the fox. ";
    if (Math.random() * cat.attack > Math.random() * fox.defense) {
      const damage = 2 + Math.floor(Math.random() * 5);
      fox.hp -= damage;
      outline += `The cat hits the fox doing ${damage} damage. `;
    } else {
      outline += "The cat misses the fox. ";
    }

    outline += "\n";
  }

  const battleOutcome = fox.hp <= 0 ? "cat" : "fox";
  outline += `In the end, the ${battleOutcome} emerges victorious. `;

  say(outline);

  const storyPrompt = `
Based on the outline provided, write a short story about a fierce battle between a cat and a fox. Use vivid, descriptive language to bring the battle to life, avoiding specific numerical details for a more narrative-driven approach.
Outline:
${outline}`;

  const storyResponse = await gptPrompt(storyPrompt, {
    max_tokens: 200,
    temperature: 0.7,
  });

  say(`${storyResponse}`);

  const summaryPrompt = `
Summarize the following epic tale in just four sentences, capturing the essence of the battle and the valor of its participants.
Story:
${storyResponse}`;

  const summaryResponse = await gptPrompt(summaryPrompt, {
    max_tokens: 200,
    temperature: 0.5,
  });

  say(`${summaryResponse}`);
}

main();
