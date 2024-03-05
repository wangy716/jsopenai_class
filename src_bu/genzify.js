import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";

async function main() {
  say("GenZify Enabled...100%");

  let conversationHistory = "";
  let currentStatementForExplanation = ""; // This will hold the latest statement for explanation.

  // Generate a conversation starter if the history is empty
  if (conversationHistory === "") {
    const genZStarterPrompt =
      "Create a conversation starter in GenZ slang. (emojis are recommended)";
    const genZStarter = await gptPrompt(genZStarterPrompt, {
      temperature: 0.8,
    });
    if (genZStarter.toLowerCase().includes("byebye")) {
      say("GenzFriend A: It was nice chatting! Byebye 👋");
      return; // Exit the function
    }
    conversationHistory += `GenzFriend A: ${genZStarter}\n`;
    currentStatementForExplanation = genZStarter; // Set the current statement to the starter for initial explanation.
    say(`GenzFriend A: ${genZStarter}`);
  }

  while (true) {
    // Provide translation and explanations for the latest slang/selected translation
    const explanationPrompt =
      `Translate the slang into an easily understandable sentence first!!! And then use bulletpoints to briefly explain the slang & emoji used in this sentence without any greeting language: '${currentStatementForExplanation}'. Your response should follow the format of 'Translation:.... Explanation:....'`;
    const slangExplanation = await gptPrompt(explanationPrompt, {
      temperature: 0.5,
    });
    say(`${slangExplanation}`);

    // Ask for user input
    const userResponse = await ask(
      "What do you want to respond? (Just in your words, Genzify got your back!)",
    );
    if (userResponse.toLowerCase().includes("byebye")) {
      say("You: Byebye 👋");
      break;
    }
    conversationHistory += `You: ${userResponse}\n`;

    // Generate multiple translations of the user's input considering the whole conversation
    const translations = [];
    const styles = [
      "with lots of emojis 😄",
      "in a casual brief genz tone",
      "using trendy slang words",
    ];
    for (let i = 0; i < styles.length; i++) {
      const translationPrompt =
        `Given the conversation context, translate this to GenZ slang ${
          styles[i]
        }: '${userResponse}'`;
      const translatedResponse = await gptPrompt(translationPrompt, {
        temperature: 0.7,
      });
      translations.push(translatedResponse);
      say(`${i + 1}: ${translatedResponse}`);
    }

    // Let the user pick which translation to send
    const selection = await ask("Pick one you like to send (1, 2, or 3):");
    const selectedTranslation = translations[parseInt(selection) - 1];
    conversationHistory += `You: ${selectedTranslation}\n`;
    say(`You: ${selectedTranslation}`);
    currentStatementForExplanation = selectedTranslation; // Update the statement for the next explanation.

    // Generate a response from GenZ friend considering the entire conversation
    const genzResponsePrompt =
      `Considering the whole conversation, respond in GenZ slang: '${selectedTranslation}'`;
    const genzResponse = await gptPrompt(genzResponsePrompt, {
      temperature: 0.8,
    });
    if (genzResponse.toLowerCase().includes("byebye")) {
      say(`GenzFriend A: ${genzResponse}`);
      break;
    }
    conversationHistory += `GenzFriend A: ${genzResponse}\n`;
    say(`GenzFriend A: ${genzResponse}`);
    currentStatementForExplanation = genzResponse; // Update the statement for the next explanation.
  }

  say("The chat has ended. Thanks for using GenZify!");
}

main();
