console.log("Hello, front end!");

async function storyGen() {
  // Retrieve the value from the text input
  const promptCharacter = document.getElementById("characters").value;
  const promptSetting = document.getElementById("settings").value;
  const promptObjectives = document.getElementById("objectives").value;
  const promptObstacles = document.getElementById("obstacles").value;
  const promptThemes = document.getElementById("themes").value;

  // Construct the URL with the prompt as a query parameter
  const url = `/api/nonsense?character=${
    encodeURIComponent(promptCharacter)
  }&setting=${encodeURIComponent(promptSetting)}&objectives=${
    encodeURIComponent(promptObjectives)
  }&obstacles=${encodeURIComponent(promptObstacles)}&themes=${
    encodeURIComponent(promptThemes)
  }`;

  const response = await fetch(url);
  const responseText = await response.text();
  const nonsenseSpan = document.getElementById("story");
  const nonsenseText = document.getElementById("instruction-text");

  nonsenseSpan.textContent = responseText;
  nonsenseText.style.display = "block";
}

document.getElementById("generate").addEventListener("click", storyGen);
