import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";

async function main() {
  say("GenZify Enabled...100%");

  // GenZ slang conversation start
  const genZStarterPrompt =
    "Create a conversation starter in GenZ slang. (emoji use allowed and recommended)";
  const genZStarter = await gptPrompt(genZStarterPrompt, { temperature: 0.8 });

  say(`GenzFriend A: ${genZStarter}`);

  // Provide translation and explanations for the GenZ slang
  const explanationPrompt =
    `Translate the slang into an easily understandable sentence first!!! And then use bulletpoints to beifly explain the slang & emoji used in this sentence without any greeting language: '${genZStarter}'. your respond should follow the format of 'Translation:.... Explanation:....'`;
  const slangExplanation = await gptPrompt(explanationPrompt, {
    temperature: 0.5,
  });

  say(`${slangExplanation}`);

  // Ask for input
  const userResponse = await ask(
    "What do you wanna resnpond? (just in your word, Genzify got your back!)",
  );

  // Translate the user's input into GenZ slang style
  const translationPrompt =
    `Translate this to GenZ slang: '${userResponse}'.(emoji use allowed and recommended)`;
  const translatedResponse = await gptPrompt(translationPrompt, {
    temperature: 0.7,
  });
  say(`You: ${translatedResponse}`);

  //further features developing...
}

main();
