<template>
  <div>
    <div class="page-loading" v-if="pokemonStore.loading">
      Carregando...
    </div>
    <div v-else class="page-container">
      <h1 class="title">Lista de Pokémons</h1>

      <input 
        type="text" 
        v-model="searchQuery" 
        @input="searchPokemon" 
        placeholder="Pesquisar Pokémon..." 
        class="search-bar"
      />

      <div class="pokemon-list">
        <!-- Exibe o Pokémon pesquisado -->
        <div v-if="searchResult" class="pokemon-item" :style="{ backgroundColor: getColor(searchResult.types[0].type.name) }">
          <img :src="searchResult.sprites.front_default" :alt="searchResult.name" />
          <h2>{{ searchResult.name }}</h2>
          <div class="stats">
            <p>HP: {{ searchResult.stats[0].base_stat }}</p>
            <p>Speed: {{ searchResult.stats[5].base_stat }}</p>
            <p>Defense: {{ searchResult.stats[2].base_stat }}</p>
            <p>Attack: {{ searchResult.stats[1].base_stat }}</p>
          </div>
        </div>

        <!-- Exibe os Pokémons da lista -->
        <div v-else v-for="pokemon in pokemonDetails" :key="pokemon.name" class="pokemon-item" :style="{ backgroundColor: getColor(pokemon.types[0].type.name) }">
          <img :src="pokemon.sprites.front_default" :alt="pokemon.name" />
          <h2>{{ pokemon.name }}</h2>
          <div class="stats">
            <p>HP: {{ pokemon.stats[0].base_stat }}</p>
            <p>Speed: {{ pokemon.stats[5].base_stat }}</p>
            <p>Defense: {{ pokemon.stats[2].base_stat }}</p>
            <p>Attack: {{ pokemon.stats[1].base_stat }}</p>
          </div>
        </div>
      </div>

      <!-- Paginação -->
      <div class="pagination">
        <button @click="pokemonStore.prevPage" :disabled="!pokemonStore.previousUrl">Página Anterior</button>
        <button @click="pokemonStore.nextPage" :disabled="!pokemonStore.nextUrl">Próxima Página</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { usePokemonStore } from '../store/pokemonStore';
import axios from 'axios';

const searchQuery = ref(''); // Armazena a consulta de pesquisa
const searchResult = ref(null); // Armazena o resultado da pesquisa
const isSearching = ref(false); // Indica se está pesquisando
const pokemonStore = usePokemonStore();
const pokemonDetails = ref([]); // Array para armazenar os detalhes dos Pokémons

const fetchPokemonDetails = async () => {
  pokemonDetails.value = []; 
  for (const pokemon of pokemonStore.pokemons) {
    const response = await fetch(pokemon.url);
    const data = await response.json();
    pokemonDetails.value.push(data);
  }
};

const searchPokemon = async () => {
  if (searchQuery.value.trim() === '') {
    searchResult.value = null;
    return;
  }

  isSearching.value = true;
  const query = searchQuery.value.toLowerCase().trim();
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${query}`);
    searchResult.value = response.data;
  } catch (error) {
    console.error("Pokémon não encontrado:", error);
    searchResult.value = null;
  } finally {
    isSearching.value = false;
  }
};

// Watch para atualizar os detalhes dos Pokémons quando pokemons muda
watch(() => pokemonStore.pokemons, async () => {
  await fetchPokemonDetails();
}, { immediate: true });

onMounted(() => {
  pokemonStore.init();
});
const getColor = (type) => {
  const colors = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dark: '#705848',
    dragon: '#7038F8',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    normal: '#A8A878'
  };

  return colors[type] || '#A8A878'; // Retorna a cor correspondente ou a cor padrão (normal)
};


// onMounted(async () => {
//   await pokemonStore.init();
//   await fetchPokemonDetails(); // Busca detalhes dos Pokémons após a lista inicial ser carregada
// });
</script>

  
<style scoped>
.page-loading {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
}
.page-container {
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

.title {
  font-size: 36px;
  color: #ffffff;
  margin-bottom: 20px;
  font-weight: bold;
}

.search-bar {
  color: #000; /* Define a cor do texto como preto */
  background-color: #fff; /* (Opcional) Define o fundo como branco */
  border: 1px solid #ccc; /* (Opcional) Adiciona uma borda leve */
  padding: 8px;
  border-radius: 4px;
}

.pokemon-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
}

.pokemon-item {
  background-color: #ffcccb;
  border: 2px solid #ff6f61;
  border-radius: 15px;
  padding: 20px;
  width: 200px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.pokemon-item:hover {
  transform: scale(1.05);
}

.pokemon-item img {
  width: 120px;
  height: 120px;
  margin-bottom: 10px;
}

.pokemon-item h2 {
  font-size: 18px;
  color: white;
  margin: 10px 0;
  text-transform: capitalize;
}

.stats {
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  text-align: left;
}

.stats p {
  margin: 5px 0;
  font-size: 14px;
  color: #333;
}

.pagination {
  margin-top: 20px;
}

.pagination button {
  background-color: #ff6f61;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin: 0 10px;
  transition: background-color 0.3s;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: #ff4a3d;
}
</style>
   