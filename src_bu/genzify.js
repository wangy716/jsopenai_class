import { ask, say } from "./shared/cli.js";
import chalk from "chalk";
import boxen from "boxen";
import figlet from "figlet";
import ora from "ora";
import { gptPrompt } from "./shared/openai.js";

async function main() {
  console.log(
    chalk.green(
      figlet.textSync("GenZify", { horizontalLayout: "full" }),
    ),
  );
  console.log(
    boxen(chalk.yellow("Welcome to GenZify - Your Slang Translator!"), {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "blue",
    }),
  );

  say("Choose a nation for slang exploration:");
  say(chalk.yellow("1. United States"));
  say(chalk.yellow("2. China"));
  const nationChoice = await ask("Enter your choice (1/2): ");
  let nation = nationChoice === "1" ? "United States" : "China";
  let explorationCount = 0;

  async function exploreSlang() {
    explorationCount++;
    const spinner = ora({
      text: "Fetching new slang terms...",
      spinner: "dots",
      color: "green",
    }).start();

    const slangPrompt =
      `List six new and different popular or emerging slang terms in ${nation} not previously mentioned. Please provide unique terms that were not included in previous explorations. Exploration attempt #${explorationCount}:`;

    try {
      const slangTerms = await gptPrompt(slangPrompt, {
        temperature: 0.5,
      });
      spinner.succeed("New slang terms fetched!");
      say(
        boxen(chalk.magenta(slangTerms), {
          padding: 1,
          margin: 1,
          borderStyle: "round",
          borderColor: "magenta",
        }),
      );
    } catch (error) {
      spinner.fail("Failed to fetch slang terms.");
      console.error(error.message);
    }

    postActionOptionsSlang();
  }

  async function translatePhrase() {
    const translationDirection = await ask(
      "Translate from (1) Standard to Slang or (2) Slang to Standard? Enter 1 or 2: ",
    );
    const phrase = await ask(
      translationDirection === "1"
        ? "Enter the standard phrase to translate to slang: "
        : "Enter the slang phrase to translate to standard language: ",
    );

    const spinner = ora("Translating...").start();
    const translationPrompt = `${
      translationDirection === "1"
        ? `Translate this standard phrase to ${nation} slang: '${phrase}'`
        : `Translate this ${nation} slang to standard language: '${phrase}'`
    }`;
    try {
      const translation = await gptPrompt(translationPrompt, {
        temperature: 0.7,
      });
      spinner.succeed("Translation complete:");
      say(
        boxen(chalk.cyan(translation), {
          padding: 1,
          margin: 1,
          borderStyle: "round",
          borderColor: "cyan",
        }),
      );
    } catch (error) {
      spinner.fail("Translation failed.");
      console.error(error.message);
    }

    postActionOptionsTranslate();
  }

  async function postActionOptionsSlang() {
    const option = await ask(
      boxen(
        chalk.yellow(
          "What do you wanna do now? (1) Regenerate slang (2) Translate a phrase (3) Change nation (4) Quit",
        ),
        { padding: 1 },
      ),
    );
    switch (option) {
      case "1":
        exploreSlang();
        break;
      case "2":
        translatePhrase();
        break;
      case "3":
        nation = await ask(
          chalk.blue(
            "Choose a new nation for slang exploration (United States/China):",
          ),
        );
        explorationCount = 0; // Reset exploration count for the new nation
        postActionOptionsSlang();
        break;
      case "4":
        say(chalk.green("Thank you for using GenZify. Goodbye!"));
        return;
      default:
        say(chalk.red("Invalid option. Please choose again."));
        postActionOptionsSlang();
        break;
    }
  }

  async function postActionOptionsTranslate() {
    const option = await ask(
      boxen(
        chalk.yellow(
          "What do you wanna do now? (1) Translate another phrase(or another translation) (2) Explore slang (3) Change nation (4) Quit",
        ),
        { padding: 1 },
      ),
    );

    switch (option) {
      case "1":
        translatePhrase();
        break;
      case "2":
        exploreSlang();
        break;
      case "3":
        nation = await ask(
          chalk.blue(
            "Choose a new nation for slang exploration (United States/China):",
          ),
        );
        explorationCount = 0; // Reset for consistency, though it's mainly for exploreSlang
        postActionOptionsTranslate();
        break;
      case "4":
        say(chalk.green("Thank you for using GenZify. Goodbye!"));
        return;
      default:
        say(chalk.red("Invalid option. Please choose again."));
        postActionOptionsTranslate();
        break;
    }
  }

  const initialAction = await ask(
    chalk.blue(
      "Do you want to (1) explore popular slang or (2) translate a phrase? Enter 1 or 2:",
    ),
  );
  if (initialAction === "1") {
    exploreSlang();
  } else if (initialAction === "2") {
    translatePhrase();
  } else {
    say(chalk.red("Invalid selection. Exiting."));
  }
}

main();
