import { defineStore } from 'pinia';
import { ref, toRaw } from 'vue';
import axios from 'axios';

export const usePokemonStore = defineStore('pokemonStore', () => {
    const pokemons = ref(null);
    const db = ref(null);
    const BASE_URL = 'https://pokeapi.co/api/v2/';

    const errors = ref([]);
    const options = {
        headers: {
            accept: 'application/json',
        },
    };

    const openDataBase = async () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('pokemonsdb', 1);

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
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                errors.value.push('Erro ao carregar dados!');
                reject('Error ao abrir o banco de dados: ' + event.target.error);
            };
        });
    };

    const checkAndUpdateTable = (
        tableName,
        fetchApi,
        stateRef,
        queryType,
        additionalParams,
    ) => {
        return new Promise((resolve, reject) => {
            const transaction = db.value.transaction(['manager'], 'readwrite');
            const managerStore = transaction.objectStore('manager');
            const request = managerStore.index('table').get(tableName);

            request.onsuccess = async function (event) {
                const record = event.target.result;
                const now = Math.floor(Date.now() / 1000); // unix timestamp em sec

                if (!record || now - record.last_updated > 60) {
                    await fetchApi(db, tableName, queryType, additionalParams);
                    const newRecord = {
                        id: record ? record.id : crypto.randomUUID(),
                        table: tableName,
                        last_updated: now
                    };

                    managerStore.put(newRecord);
                } else {
                    stateRef.value = await fetchFromTable(tableName);
                }
                resolve();
            };

            request.onerror = function (event) {
                errors.value.push('Erro ao carregar dados');
                reject('Error ao verificar a table manager: ' + event.target.errorCode);
            };
        });
    };

    const fetchFromTable = (tableName) => {
        return new Promise((resolve, reject) => {
            const transaction = db.value.transaction([tableName], 'readonly');
            const store = transaction.objectStore(tableName);

            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                errors.value.push(`Erro ao buscar ${tableName}`);
                reject(`Error ao carregar dados da tabela ${tableName}: ` + event.target.errorCode);
            };
        });
    };

    const fetchPokemons = async (db, tableName, queryType, additionalParams = '') => {
      
         axios.get(`${BASE_URL}${queryType}?${additionalParams}`, options).then(
            response => {
                console.log('Pokemons recebidos da API:', response.data);
    
            // Atualize o estado com os dados recebidos da API
                pokemons.value = response.data;
    
            // Abra uma transação e armazene os dados no IndexedDB
                const transaction = db.value.transaction([tableName], 'readwrite');
                const store = transaction.objectStore(tableName);
    
            // Insira os dados no store
            // response.data.results.forEach(pokemon => {
                pokemons.value.id = crypto.randomUUID();
                store.put(toRaw(pokemons.value));
            }
         )
            
         
    };
    

    const init = async () => {
        db.value = await openDataBase();

        await checkAndUpdateTable(
            'pokemons',
            fetchPokemons,
            pokemons,
            'pokemon',
            'limit=24'
        );
    };

    return {
        errors,
        init,
        pokemons
    };
});