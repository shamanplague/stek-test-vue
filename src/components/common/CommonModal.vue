<script setup lang="ts">

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    isOpen: {
        type: Boolean,
        required: true,
    }
})

const emit = defineEmits(['close'])

</script>

<template>
    <div v-if="isOpen" class="form-modal">
        <div class="form-modal__close-button close-button" @click="emit('close')">
          <div class="close-button__icon"></div>
        </div>

        <div class="form-modal__title" id="organizations-form-modal-title">{{ title }}</div>

        <slot />

    </div>
</template>