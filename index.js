const DEFAULT_URL = 'https://pokeapi.co/api/v2/pokemon?limit=5'
const pokeListSection = document.querySelector('section#poke-list')
const pokeNav = document.querySelector("#poke-nav")
const nextBtn = document.querySelector("#nextBtn")
const prevBtn = document.querySelector("#prevBtn")
let state

pokeNav.addEventListener("click", (event) => {
    const trigger = event.target

    if (trigger.id === "nextBtn") fetchPokemon(state.next)
    if (trigger.id === "prevBtn") fetchPokemon(state.previous)

})

pokeListSection.addEventListener("click", (event) => {
    const trigger = event.target

    if (trigger.className === "poke-card" || trigger.parentNode.className === "poke-card") {
        const pokemon = trigger.dataset.pokemon
        addPokemon(pokemon)
    }
})

async function addPokemon(pokemon){
    const initObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            name: pokemon
        })
    }

    const result = await fetch("http://localhost:3000/pokemon", initObj)
    console.log(result.ok)
    if(result.ok) alert(`Added ${pokemon}`)

    const data = await result.json()

    console.log(data)
}

async function fetchPokeDetails(url) {
    try {
        const response = await fetch(url)
        const data = await response.json()

        return data
    } catch (error) {
        console.error(error)
    }
}

async function fetchPokemon(url) {
    const response = await fetch(url) 
    const data = await response.json()

    state = data
    toggleNavigation()
    updatePokemon(data)

    return data
}

function updatePokemon({ results }) {
    let html = ""
    
    results.forEach(async poke => {
        const pokemon = await fetchPokeDetails(poke.url)
        
        html += renderPokemon(pokemon)
        pokeListSection.innerHTML = html
    })
}

function toggleNavigation() {
    if (state.previous === null) prevBtn.disabled = true
    else prevBtn.disabled = false

    if (state.next === null) nextBtn.disabled = true
    else nextBtn.disabled = false
}

function renderPokemon({name, sprites}) {
   return `
        <div 
            class="poke-card" 
            data-pokemon='${name}'
        >
            <h2 
                class="poke-name" 
                data-pokemon='${name}'
            >
                ${name}
            </h2>
            <img 
                src="${sprites.front_default}" data-pokemon='${name}'
            />
        </div>
    `
}

fetchPokemon(DEFAULT_URL)






