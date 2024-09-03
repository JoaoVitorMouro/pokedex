<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    nome: { required: true, type: String },
    selecionada: { required: true, type: Boolean, default: false }
})
</script>
<template>
    <div 
        :class="selecionada ? 'bg-green-400 text-white' : 'text-green-400 bg-white'"
        class="shadow-sm flex flex-col w-1/2 py-2 items-center justify-center hover:bg-green-400 hover:text-white  cursor-pointer"
    >
        {{ nome }}
    </div>
</template>