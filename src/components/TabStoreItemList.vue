<script setup>
import { useTaskStore } from '../store'

const taskStore = useTaskStore()
const props = defineProps({
    tarefa: { required: true, type: Object }
})

</script>
<template>
    <li
        class="text-lg cursor-pointer flex"
        :class="[
            {'text-green-400': tarefa.prioritaria},
        ]"
    >
        <p @click="tarefa.feita = !tarefa.feita" :class="{'line-through': tarefa.feita}">{{ tarefa.nome }}</p>
        <p @click="taskStore.excluirTarefa(tarefa)" class="text-red-500">Excluir</p>
    </li>
</template>