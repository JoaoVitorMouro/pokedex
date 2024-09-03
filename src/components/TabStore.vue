<script setup>
import { ref, watch, onMounted } from 'vue';
import { useTaskStore } from '../store'
import TabStoreItemList from '../components/TabStoreItemList.vue'

const taskStore = useTaskStore()
const nome_tarefa = ref('')
const eh_prioritaria = ref(false)
const editando = ref(false)
const tarefas = ref([])

// watch(taskStore.getTarefas, (tarefas_atualizadas) => {
//   tarefas.value = tarefas_atualizadas
// })

onMounted(() => tarefas.value = taskStore.getTarefas)

</script>
<template>
    <div class="w-full flex items-center flex-col justify-center bg-green-100/20 pt-5">
        <div class="p-6 bg-white shadow rounded w-[500px]">
			<div class="flex w-full justify-between items-center">
				<h1 class="text-xl font-bold text-gray-800">
					Lista de Tarefas
				</h1>
				<div class="flex space-x-1">
					<button
						type="button" 
						@click="cancelar()" 
						class="px-2 bg-greay-200 rounded text-green-500 py-1 border border-gray-200"
					>
						Cancelar
					</button>
					<button
						type="button" 
						@click="editando ? taskStore.addTarefa(nome_tarefa, eh_prioritaria) : editando = true"
						class="px-2 bg-green-500 rounded text-white py-1"
					>
						{{ editando ? 'Salvar' : 'Nova Tarefa' }}
					</button>
				</div>
			</div>

			<div v-if="editando" class="flex flex-col">
				<div class="space-x-2">
					<input type="text" class="h-8 px-2 border border-green-500 rounded" v-model="nome_tarefa" />
					
					<label>
						<input type="checkbox" v-model="eh_prioritaria" >
						Prioridade Alta
					</label>
				</div>
				
				
			</div>
			<ul class="pt-5">
				<tab-store-item-list
					v-for="tarefa in taskStore.getTarefas"
					:key="tarefa.id"
					:id="`tarefa_store_${tarefa.id}`"
					:tarefa="tarefa"
					@completar="tarefa.feita = !tarefa.feita"
					@excluir="excluirTarefa(tarefa)"
				/>
			</ul>
			<p v-show="!taskStore.getTarefas.length">
				Adicione uma nova tarefa
			</p>
		</div>
    </div>
</template>