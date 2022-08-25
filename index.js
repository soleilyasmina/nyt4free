const axios = require("axios");
const chalk = require("chalk");

const formatIngredients = (ingredients) => chalk.bold.white("INGREDIENTS:\n\n") + ingredients.join("\n")

const formatInstructions = (instructions, heading = "INSTRUCTIONS:\n\n") => {
  return instructions.reduce((acc, curr) => {
    if (curr.text) {
      acc += curr.text + "\n\n"
    } else {
      acc += formatInstructions(curr.itemListElement, chalk.bold.white(curr.name.toUpperCase() + "\n\n"))
    }
    return acc;
  }, chalk.bold.white(heading));
}

const main = async () => {
  const endpoint = process.argv[2];
  const resp = await axios.get(endpoint);
  const recipeContentJSON = resp.data.split('<script id="ad-manager"')[0].split('<script type="application/ld+json">')[1].replace("</script>", "")
  const recipe = JSON.parse(recipeContentJSON, null, 2)
  const items = [chalk.bold.white(`${recipe.name} - (${recipe.author.name})`), recipe.description, formatIngredients(recipe.recipeIngredient), formatInstructions(recipe.recipeInstructions), chalk.underline.white(endpoint)];
  console.log(items.join("\n\n"))
}

main();

