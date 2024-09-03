<template>
    <div class="page-container">
      <h1 class="title">Lista de Pokémons</h1>
      <input type="text" v-model="searchQuery" @input="searchPokemon" placeholder="Pesquisar Pokémon..." class="search-bar"/>
  
      <div class="pokemon-list">
        <div v-if="searchQuery && !isSearching" class="pokemon-item" :style="{ backgroundColor: getColor(searchResult.types[0].type.name) }">
          <img :src="searchResult.sprites.front_default" :alt="searchResult.name" />
          <h2>{{ searchResult.name }}</h2>
          <div class="stats">
            <p>HP: {{ searchResult.stats[0].base_stat }}</p>
            <p>Speed: {{ searchResult.stats[5].base_stat }}</p>
            <p>Defense: {{ searchResult.stats[2].base_stat }}</p>
            <p>Attack: {{ searchResult.stats[1].base_stat }}</p>
          </div>
        </div>
        <div v-else v-for="pokemon in filteredPokemons" :key="pokemon.name" class="pokemon-item" :style="{ backgroundColor: getColor(pokemon.types[0].type.name) }">
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
  
      <div class="pagination">
        <button @click="prevPage" :disabled="!previousUrl">Anterior</button>
        <button @click="nextPage" :disabled="!nextUrl">Próxima</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        pokemons: [],
        filteredPokemons: [],
        searchQuery: '',
        searchResult: null,
        isSearching: false,
        nextUrl: 'https://pokeapi.co/api/v2/pokemon?limit=24',
        previousUrl: null,
      };
    },
    created() {
      this.fetchPokemons(this.nextUrl);
    },
    methods: {
      async fetchPokemons(url) {
        try {
          const response = await axios.get(url);
          const pokemonUrls = response.data.results.map(pokemon => pokemon.url);
  
          const pokemonDetailsPromises = pokemonUrls.map(url => axios.get(url));
          const pokemonDetails = await Promise.all(pokemonDetailsPromises);
  
          this.pokemons = pokemonDetails.map(p => p.data);
          this.filteredPokemons = this.pokemons; // Inicialmente, mostrar todos
          this.nextUrl = response.data.next;
          this.previousUrl = response.data.previous;
        } catch (error) {
          console.error("Erro ao buscar lista de Pokémons:", error);
        }
      },
      async searchPokemon() {
        if (this.searchQuery.trim() === '') {
          this.searchResult = null;
          return;
        }
  
        this.isSearching = true;
        const query = this.searchQuery.toLowerCase().trim();
        try {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${query}`);
          this.searchResult = response.data;
        } catch (error) {
          console.error("Pokémon não encontrado:", error);
          this.searchResult = null;
        } finally {
          this.isSearching = false;
        }
      },
      nextPage() {
        if (this.nextUrl) {
          this.fetchPokemons(this.nextUrl);
          this.searchQuery = ''; // Limpa a pesquisa ao mudar de página
          this.searchResult = null;
        }
      },
      prevPage() {
        if (this.previousUrl) {
          this.fetchPokemons(this.previousUrl);
          this.searchQuery = ''; // Limpa a pesquisa ao mudar de página
          this.searchResult = null;
        }
      },
      getColor(type) {
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
      }
    }
  };
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
  