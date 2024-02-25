import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";

async function main() {
  say("Welcome to the GUESSSSS NYC Subway Color Game!");

  let score = 0;
  const questions = [
    { line: "A", color: "Blue" },
    { line: "C", color: "Blue" },
    { line: "E", color: "Blue" },
    { line: "1", color: "Red" },
    { line: "2", color: "Red" },
    { line: "3", color: "Red" },
    { line: "L", color: "Grey" },
    { line: "7", color: "Purple" },
    { line: "G", color: "Lime" },
  ];

  for (const { line, color } of questions) {
    const gambleChance = Math.random() < 0.3; // 30% chance to trigger the gamble
    let doublePoints = false;

    const userColor = await ask(`What's the color of the ${line} line? `);

    if (gambleChance) {
      const gamble = await ask(
        "wanna double? say yes！ ",
      );
      if (gamble.trim().toLowerCase() === "yes") {
        doublePoints = true; // The user accepts the gamble
        // Randomly decide if the gamble is true or just a bluff
        const isTrueGamble = Math.random() < 0.5;
        if (isTrueGamble) {
          say("Lucky you! It's a true gamble. But is your answer correct?");
        } else {
          say(
            "Oops, it was a bluff! Let's see if your original answer was correct...",
          );
        }
      }
    }

    if (userColor.trim().toLowerCase() === color.toLowerCase()) {
      score += doublePoints ? 2 : 1; // Double points if the gamble was accepted and true
      say("Right!");
    } else {
      score -= 5; // Deduct points for a wrong answer
      say(`Oops! The ${line} line is ${color}.`);
    }
  }

  // Final feedback based on score
  const finalMessage = score > 5
    ? "Congratulations! You've won the gamble."
    : "Oh no, you've lost the game.";
  say(finalMessage + ` Your final score is ${score}.`);

  const feedbackPrompt =
    `The player ended with a score of ${score}. Give some playful or encouraging feedback.`;
  const feedback = await gptPrompt(feedbackPrompt, { temperature: 0.8 });
  say(feedback);
}

main();
