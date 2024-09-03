<script setup>
import { ref, computed } from 'vue'


const nome_tarefa = ref('')
const eh_prioritaria = ref(false)
const editando = ref(false)
const contadorCaracteres = computed(() => nome_tarefa.value.length)
const podeSalvar = computed(() => {
	return contadorCaracteres.value > 100
})


const tarefas = ref([
	{
		id: 0,
		nome: 'Aula na pos ate as 17hr',
		prioritaria: true,
		feita: false, 
	},
	{	
		id: 1,
		nome: 'League of legends',
		prioritaria: false,
		feita: false,
	},
	{
		id: 2,
		nome: 'Jogar futebol as 19',
		prioritaria: false,
		feita: false
	},
	{
		id: 3,
		nome:'Nao esquecer de pagar a internet',
		prioritaria: true,
		feita: true
	}
])

const cliente = {
	pessoa_fisica: {
		nome: 'Jessica',
		data_nascimento: '2000-20-02'
	},
	pessoa_juridica: null,
	internacional:null
}

const addItem = () => {
	tarefas.value.push({
		id: tarefas.value.length + 1, 
		nome: nome_tarefa.value,
		prioritaria: eh_prioritaria.value
	})
	cancelar()
}

const cancelar = () => {
	nome_tarefa.value = ''
	eh_prioritaria.value = false
	editando.value = false
}

</script>
<template>
    <div class="w-full flex items-center flex-col justify-center bg-blue-200 pt-5">
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
						@click="editando ? addItem() : editando = true"
						class="px-2 bg-green-500 rounded text-white py-1 disabled:cursor-not-allowed"
						:disabled="podeSalvar"
					>
						{{ editando ? 'Salvar' : 'Nova Tarefa' }}
					</button>
					<p>aqui {{ podeSalvar }}</p>
				</div>
			</div>

			<div v-if="editando" class="flex flex-col">
				<div class="space-x-2">
					<input type="text" class="h-8 px-2 border border-green-500 rounded " v-model="nome_tarefa" />
					<p>{{ contadorCaracteres }}/ <span :class="{'text-red-500': nome_tarefa.length>100}">100</span></p>
					<label>
						<input type="checkbox" v-model="eh_prioritaria" >
						Prioridade Alta
					</label>
				</div>
			</div>
			<ul class="pt-5">
				<li 
					v-for="tarefa in tarefas"
					:key="tarefa.id"
					:id="`tarefa_${tarefa.id}`"
					class="text-lg cursor-pointer"
					:class="[
						{'text-green-400': tarefa.prioritaria},
						{'line-through': tarefa.feita}
					]"
					@click="tarefa.feita = !tarefa.feita"
				>
					{{ tarefa.nome }}
				</li>
			</ul>
			<p v-show="!tarefas.length">
				Adicione uma nova tarefa
			</p>
		</div>
	</div>

	<!-- exemplos durante aula
	<div v-if="cliente.pessoa_juridica">
		{{  cliente.pessoa_juridica.nome_fantasia}}
	</div>
	<div v-else-if="cliente.pessoa_fisica">
		{{ cliente.pessoa_fisica.nome }}
	</div>
	<div v-else>
		{{ cliente.internacional.passaporte }}
	</div>
	 <label>
					<input type="radio" v-model="eh_prioritaria" value="Nao" />
					Nao
				</label>
				<label>
					<input type="radio" v-model="eh_prioritaria" value="Sim" />
					Sim
				</label> -->

				<!-- <select v-model="eh_prioritaria">
					<option value="Nao">Não</option>
					<option value="Sim">Sim</option>
				</select> -->
</template>