<template>
    <div class="page-container">
      <h1 class="title">Lista de Pokémons</h1>
      <input type="text" v-model="searchQuery" @input="searchPokemon" placeholder="Pesquisar Pokémon..." class="search-bar"/>
  
      <div class="pokemon-list">
        <div v-if="searchResult" class="pokemon-item" :style="{ backgroundColor: getColor(searchResult.types[0].type.name) }">
          <img :src="searchResult.sprites.front_default" :alt="searchResult.name" />
          <h2>{{ searchResult.name }}</h2>
          <div class="stats">
            <p>speed: {{ searchResult.stats[5].base_stat }}</p>
            <p>HP: {{ searchResult.stats[0].base_stat }}</p>
            <p>defense: {{ searchResult.stats[2].base_stat }}</p>
            <p>attack: {{ searchResult.stats[1].base_stat }}</p>
          </div>
        </div>
        <div v-else v-for="pokemon in pokemons" :key="pokemon.name" class="pokemon-item" :style="{ backgroundColor: getColor(pokemon.types[0].type.name) }">
          <img :src="pokemon.sprites.front_default" :alt="pokemon.name" />
          <h2>{{ pokemon.name }}</h2>
          <div class="stats">
            <p>speed: {{ pokemon.stats[5].base_stat }}</p>
            <p>HP: {{ pokemon.stats[0].base_stat }}</p>
            <p>defense: {{ pokemon.stats[2].base_stat }}</p>
            <p>attack: {{ pokemon.stats[1].base_stat }}</p>
          </div>
        </div>
      </div>
  
      <div class="pagination">
        <button @click="prevPage" :disabled="!previousUrl">Anterior</button>
        <button @click="nextPage" :disabled="!nextUrl">Próxima</button>
      </div>
    </div>
  </template>
  
  <script setup>

  import { usePokemonStore } from '../store/pokemonStore';
  import { ref, computed, onMounted } from 'vue';


const searchPokemon = async () => {
    // Aqui você pode implementar a lógica de busca, se necessário
};

const getColor = (type) => {
    const colors = {
        fire: '#F08030',
        grass: '#78C850',
        water: '#6890F0',
        bug: '#A8B820',
        normal: '#A8A878',
        poison: '#A040A0',
        electric: '#F8D030',
        ground: '#E0C068',
        fairy: '#EE99AC',
        fighting: '#C03028',
        psychic: '#F85888',
        rock: '#B8A038',
        ghost: '#705898',
        ice: '#98D8D8',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        flying: '#A890F0',
    };
    return colors[type] || '#A8A878';
};

const prevPage = async () => {
    // Implementar navegação para a página anterior
};

const nextPage = async () => {
    // Implementar navegação para a próxima página
};

const pokemonStore = usePokemonStore();
console.log(pokemonStore.pokemons.results)
onMounted(async () => {
  pokemonStore.init();
});
  </script>

  
   <style scoped>
   .page-container {
     background-color: #ff4d4d;
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
     margin-bottom: 20px;
     padding: 10px;
     width: 300px;
     font-size: 16px;
     border: 2px solid #ff6f61;
     border-radius: 5px;
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
   