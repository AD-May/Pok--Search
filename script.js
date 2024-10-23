const endpoint = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/"; 
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const pokemonName = document.getElementById("pokemon-name");
const pokemonId = document.getElementById("pokemon-id");
const weightSpan = document.getElementById("weight");
const heightSpan = document.getElementById("height");
const typesContainer = document.getElementById("types");
const hp = document.getElementById("hp");
const attack = document.getElementById("attack");
const defense = document.getElementById("defense");
const spAttack = document.getElementById("special-attack");
const spDefense = document.getElementById("special-defense");
const speed = document.getElementById("speed");
const imageContainer = document.getElementById("image-container");
const hiddenElements = document.querySelectorAll(".hidden");
let pokemonUrl;

// Formats the user input such that special characters are removed, spaces are hyphenated, and male or female Unicode characters are formatted so they may be used by the API
const parseInput = (input) => {
    let cleanedInput = input;
    const regexChars = /[!@#$%^&*()=+`~{}\|\[\];:"'<>,.?\/_-]/g;
    cleanedInput.replace(regexChars, "");
    cleanedInput.replace(" ", "-");
    cleanedInput.replace("&#9794;", "-m");
    cleanedInput.replace("&#9792;", "-f");
    return cleanedInput;
}


const appendData = (data) => {
    let cleanedInput = parseInput(searchInput.value.toLowerCase());
    const { results } = data;
    if (foundPokemon(cleanedInput, results)) {
        hiddenElements.forEach((el) => el.classList.remove("hidden"));
        fetchPokemon();
    } else {
        alert("Pokémon not found");
    }
}

const getTraits = (pokemon) => {
    const { id, name, height, weight } = pokemon;
    pokemonName.innerText = name.toUpperCase();
    pokemonId.innerText = `#${id}`;
    weightSpan.innerText = `Weight: ${weight}`;
    heightSpan.innerText = `Height: ${height}`;
}

const getSprite = (pokemon) => {
    const { name, sprites } = pokemon;
    const { front_default } = sprites;
    imageContainer.innerHTML = `<img id="sprite" alt="Image of ${name}" src="${front_default}">`
}

const getType = (pokemon) => {
    const { types } = pokemon;
    
    types.forEach((el) => {
        const { name } = el.type;
        typesContainer.innerHTML += `<span class="${name}">${name.toUpperCase()}</span>`
    })
}

const getStats = (pokemon) => {
    let pokemonStats = {
        "hp": 0,
        "attack": 0,
        "defense": 0,
        "special-attack": 0,
        "special-defense": 0,
        "speed": 0
    }
    const { stats } = pokemon;

    stats.forEach((el) => {
        const { name } = el.stat;
        pokemonStats[name] += el.base_stat;
    });

    hp.innerText = pokemonStats["hp"];
    attack.innerText = pokemonStats["attack"];
    defense.innerText = pokemonStats["defense"];
    spAttack.innerText = pokemonStats["special-attack"];
    spDefense.innerText = pokemonStats["special-defense"];
    speed.innerText = pokemonStats["speed"];

}

// A function returning a boolean for processing whether a searched Pokemon exists in the API
const foundPokemon = (input, pokemon) => {
    let found = false;
    pokemon.forEach((el) => {
        if(parseInt(input) === el.id || input === el.name) {
            pokemonUrl = el.url;
            found = true;
        }
    });
    return found;
}

const resetPokemon = () => {
    pokemonUrl = "";
    hiddenElements.forEach((el) => el.classList.add("hidden"));
    pokemonName.innerText = "";
    pokemonId.innerText = "";
    weightSpan.innerText = "";
    heightSpan.innerText = "";
    types.innerHTML = "";
    hp.innerText = "";
    defense.innerText = "";
    spAttack.innerText = "";
    spDefense.innerText = "";
    speed.innerText = "";
    imageContainer.innerHTML = "";
}

// Fetches the main Pokemon JSON
const fetchData = async () => {
    try {
        const res = await fetch(endpoint);
        const data = await res.json();
        appendData(data);
    } catch(err) {
        console.log(err);
        alert("An error has occurred, please try again");
    }
}

// Fetches information specific to searched Pokemon
const fetchPokemon = async () => {
    try {
        const res = await fetch(pokemonUrl);
        const data = await res.json();
        getTraits(data);
        getSprite(data);
        getType(data);
        getStats(data);
    } catch(err) {
        console.log(err);
        alert("An error occured while obtaining Pokemon info, please try again");
    }
}

searchBtn.addEventListener("click", () => {
    resetPokemon();
    fetchData();
});
