<script setup>
import { computed } from 'vue';


const emit = defineEmits(['completar', 'excluir'])

const props = defineProps({
    tarefa: { required: true, type: Object }
})

const completarTarefa = () => {
    emit('completar')
}

const excluirTarefa = () => {
    emit('excluir')
}

</script>
<template>
    <li
        class="text-lg cursor-pointer flex"
        :class="[
            {'text-green-400': tarefa.prioritaria},
            {'line-through': tarefa.feita}
        ]"
    >
        <p @click="completarTarefa()">{{ tarefa.nome }}</p>
        <p @click="excluirTarefa()" class="text-red-500">Excluir</p>
    </li>
</template>