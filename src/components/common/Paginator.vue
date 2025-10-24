<script setup lang="ts">
import type { Pagination } from '@/types/Repository';


const props = defineProps<{
    pagination: Pagination
}>()

const emit = defineEmits(['goToPage'])

const goToPage = (page: number) => {
    emit('goToPage', page)
}

const goToPrev = () => {
    const newPage = props.pagination.page - 1
    newPage > 0 && emit('goToPage', newPage)
}

const goToNext = () => {
    const newPage = props.pagination.page + 1
    newPage <= props.pagination.totalPages && emit('goToPage', newPage)
}
</script>

<template>
    <div class="paginator">
        <button class="paginator__button paginator__button--prev" @click="goToPrev">Назад</button>
        <template v-for="page in pagination.totalPages">
            <div
                class="paginator__number"
                :class="{ 'paginator__number--current': pagination.page === page }"
                @click="goToPage(page)"
            >
                {{ page }}
            </div>
        </template>
        <button class="paginator__button paginator__button--next" @click="goToNext">Вперёд</button>
    </div>
</template>