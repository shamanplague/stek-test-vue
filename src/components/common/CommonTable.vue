<script setup lang="ts">
import { watchEffect, type PropType } from 'vue';
import type { TableAction, TableHeader, TableItem } from '../types';
import type { SortDirections } from '@/types/Repository';


const props = defineProps({
  headers: {
    type: Object as PropType<TableHeader[]>,
    required: true
  },
  items: {
    type: Object as PropType<TableItem[]>,
    required: true
  },
  actions: {
    type: Object as PropType<TableAction[]>
  }
})

const emit = defineEmits<{
  (e: 'changeHeaders', payload: TableHeader[]): void
  (e: 'rowClick', payload: TableItem): void
}>()

watchEffect(() => {
  if (props.headers?.length && props.items?.length) {
    const expected = props.headers.length
    const invalid = props.items.some(item => item.data.length !== expected )

    invalid
      && console.warn(`[CommonTable] Количество ячеек не совпадает с количеством заголовков`)
  }
})

const changeSort = (field: string | undefined) => {

  if (!field) return

  const getNextSort = (currentSort: SortDirections): SortDirections => {
    if (!currentSort) return 'ASC'
    if (currentSort === 'ASC') return 'DESC'
    if (currentSort === 'DESC') return
  }

  const newHeaders = JSON.parse(JSON.stringify(props.headers)) as TableHeader[]

  const neededField = newHeaders.find(item => item.sort?.field === field)

  if (neededField?.sort) {
    neededField.sort.direction = getNextSort(neededField.sort.direction)

    emit('changeHeaders', newHeaders)
  }

}

console.log(props.actions)

</script>

<template>
  <div class="common-table">
    <div class="common-table__header">
      <template v-for="header in headers">
        <div
          class="common-table__cell"
          :class="[{ 'sort-arrow-down': header.sort?.direction === 'ASC', 'sort-arrow-up': header.sort?.direction === 'DESC' }, header.classList]"
          @click="changeSort(header.sort?.field)"
        >
          {{ header.title}}
        </div>
      </template>
      <div v-if="props.actions" class="common-table__cell common-table__cell--action"></div>
    </div>

    <div class="common-table__content">
      <template v-if="items.length">
        <div
          v-for="row in items"
          class="common-table__row"
          @click="$emit('rowClick', row)"
        >
          <template v-for="cell in row.data">
            <div class="common-table__cell">{{ cell }}</div>
          </template>
          
          <div class="common-table__cell common-table__cell--action" @click.stop>
            <template v-for="action in actions">
              <div class="action-button" @click.stop="() => action.callback(row)">
                <img :src="`/icons/${action.icon}.svg`">
              </div>
            </template>
            </div>
        </div>
      </template>
      <template v-else>
        <div class="common-table__no-data">Нет данных</div>
      </template>
    </div>
  </div>
</template>