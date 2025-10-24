<script setup lang="ts">
import { toFlatObject } from '@/helpers/helpers';
import type { Organization } from '@/types/Organization';
import { computed, onMounted, reactive, watch, watchEffect, type PropType } from 'vue';


const props = defineProps({
    organization: {
        type: Object as PropType<Organization>
    }
})

const emit = defineEmits<{
    (e: 'submit', payload: Organization): void
    (e: 'close'): void
}>()

const defaultStoreState = {
    name: '',
    headManagerName: '',
    phone: '',
    address: {
        city: '',
        street: '',
        house: ''
    }
}

const formData = reactive<Omit<Organization, 'id'>>(defaultStoreState)

const isSubmitAvailable = computed(() => Object.values(toFlatObject(formData)).every(item => item) )

const submitForm = () => {
    emit('submit', { id: props.organization?.id || 0, ...formData})
}

const loadForm = (org: Organization) => {
    Object.assign(formData, org)
}

watchEffect(() => {
    props.organization && loadForm(props.organization)
})

onMounted(() => {
    Object.assign(formData, defaultStoreState)
    console.log('отработало')
})

</script>

<template>
    <form class="form-modal__content form-content">

        <div class="form-content__fields-section fields-section">

            <div class="fields-section__field">
                <div class="fields-section__label">Название</div>
                <input v-model="formData.name" type="text" class="fields-section__input">
            </div>
            <div class="fields-section__field">
                <div class="fields-section__label">ФИО директора</div>
                <input v-model="formData.headManagerName" type="text" class="fields-section__input">
            </div>
            <div class="fields-section__field">
                <div class="fields-section__label">Телефон</div>
                <input v-model="formData.phone" type="number" class="fields-section__input">
            </div>
            <div class="fields-section__field">
                <div class="fields-section__label">Город</div>
                <input v-model="formData.address.city" type="text" class="fields-section__input">
            </div>
            <div class="fields-section__field">
                <div class="fields-section__label">Улица</div>
                <input v-model="formData.address.street" type="text" class="fields-section__input">
            </div>
            <div class="fields-section__field">
                <div class="fields-section__label">Дом</div>
                <input v-model="formData.address.house" type="text" class="fields-section__input">
            </div>
        </div>

        <div class="form-content__buttons-section buttons-section">
            <button class="buttons-section__button" type="button" @click="$emit('close')">Отмена</button>
            <button class="buttons-section__button" type="submit" @click.prevent="submitForm" :disabled="!isSubmitAvailable">Ок</button>
        </div>
    </form>
</template>