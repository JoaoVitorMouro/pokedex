import { ref, toRaw } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const usePokemonStore = defineStore('pokemons', () => {
  const BASE_URL = 'https://pokeapi.co/api/v2/';
  const db = ref(null);
  const errors = ref([]);
  const loading = ref(true);
  const pokemons = ref([]);
  const nextUrl = ref(null);
  const previousUrl = ref(null);
  const options = {
    headers: {
      accept: 'application/json',
    },
  };

  const openDataBase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('pokemonsdb', 2);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('pokemons')) {
          db.createObjectStore('pokemons', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('manager')) {
          const managerStore = db.createObjectStore('manager', { keyPath: 'id' });
          managerStore.createIndex('table', 'table', { unique: true });
        }
      };

      request.onsuccess = (event) => {
        db.value = event.target.result;
        resolve(db.value);
      };

      request.onerror = (event) => {
        errors.value.push('Erro ao carregar dados!');
        reject('Erro ao abrir o banco de dados: ' + event.target.error);
      };
    });
  };

  const fetchPokemons = async (queryType = 'pokemon', additionalParams = '') => {
    try {
      // Monta a URL corretamente
      const url = additionalParams
        ? `${BASE_URL}${queryType}${additionalParams.startsWith('?') ? '' : '?'}${additionalParams}`
        : `${BASE_URL}${queryType}`;
  
      console.log('Chamando URL:', url); // Log a URL para depuração
  
      const response = await axios.get(url, options);
      const data = response.data;
  
      console.log('Resposta da API:', data);
  
      if (data.results && Array.isArray(data.results)) {
        pokemons.value = data.results;
      } else {
        console.error('Formato inesperado de dados:', data);
        pokemons.value = [];
      }
  
      nextUrl.value = data.next;
      previousUrl.value = data.previous;
  
      // Limpa os dados antigos no IndexedDB antes de armazenar os novos
      const transaction = db.value.transaction(['pokemons'], 'readwrite');
      const store = transaction.objectStore('pokemons');
  
      // Deleta todos os dados antigos
      const clearRequest = store.clear();
  
      clearRequest.onsuccess = () => {
        console.log('Dados antigos removidos.');
  
        // Armazena os novos dados
        const newTransaction = db.value.transaction(['pokemons'], 'readwrite');
        const newStore = newTransaction.objectStore('pokemons');
  
        data.results.forEach((pokemon) => {
          newStore.put({
            ...pokemon,
            id: crypto.randomUUID(),
          });
        });
  
        console.log('Dados novos armazenados.');
      };
  
      clearRequest.onerror = (event) => {
        errors.value.push('Erro ao remover dados antigos do banco.');
        console.error('Erro ao remover dados:', event.target.error);
      };
  
      transaction.oncomplete = () => {
        console.log('Transação completa.');
  
        // Atualiza a interface do usuário se necessário
        // Exemplo de força uma atualização (pode não ser necessário)
        pokemonDetails.value = [...pokemons.value];
      };
  
      transaction.onerror = (event) => {
        errors.value.push('Erro na transação.');
        console.error('Erro na transação:', event.target.error);
      };
    } catch (error) {
      errors.value.push('Erro ao buscar Pokémons da API.');
      console.error('Erro ao buscar Pokémons:', error);
    }
  };
  

  const searchPokemon = async (pokemonName) => {
    try {
      const response = await axios.get(`${BASE_URL}pokemon/${pokemonName}`, options);
      pokemons.value = [response.data];
      console.log(response)
    } catch (error) {
      errors.value.push(`Erro ao buscar Pokémon ${pokemonName}: ${error.message}`);
    }
  };
  
  

  const init = async () => {
    console.log('Iniciando...');
    loading.value = true;
    try {
      db.value = await openDataBase();
      await fetchPokemons('pokemon', 'limit=24');
    } catch (error) {
    } finally {
      loading.value = false;
    }
  };
  

  const nextPage = async () => {
    if (nextUrl.value) {
      // Garante que a URL contenha o tipo de consulta correto
      const url = new URL(nextUrl.value);
      const searchParams = url.searchParams.toString();
      await fetchPokemons('pokemon', searchParams);
    } else {
      console.warn('Não há próxima página.');
    }
  };
  
  const prevPage = async () => {
    if (previousUrl.value) {
      // Garante que a URL contenha o tipo de consulta correto
      const url = new URL(previousUrl.value);
      const searchParams = url.searchParams.toString();
      await fetchPokemons('pokemon', searchParams);
    } else {
      console.warn('Não há página anterior.');
    }
  };
  

  return {
    errors,
    init,
    pokemons,
    loading,
    nextPage,
    prevPage,
    nextUrl,
    previousUrl,
    searchPokemon,
    BASE_URL
  };
});
