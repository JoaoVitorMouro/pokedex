<template>
    <div>
      <h1 v-if="pokemon.name">{{ pokemon.name }}</h1>
      <img v-if="pokemon.sprites" :src="pokemon.sprites.front_default" alt="Imagem do Pokémon" />
      <button @click="fetchPokemon">Buscar outro Pokémon</button>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        pokemon: {},
        pokemonId: 1,
      };
    },
    created() {
      this.fetchPokemon();
    },
    methods: {
      async fetchPokemon() {
        console.log('Fetching Pokémon...');
        try {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${this.pokemonId}`);
          this.pokemon = response.data;
          console.log(response.data);
          this.pokemonId++;
        } catch (error) {
          console.error("Erro ao buscar Pokémon:", error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  img {
    width: 200px;
    height: auto;
  }
  </style>
  