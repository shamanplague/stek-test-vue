<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { Organization, OrganizationField } from '../../types/Organization';
import CommonTable from '../common/CommonTable.vue';
import type { TableAction, TableHeader, TableItem } from '../types';
import type { EntityRepositorySorts, SortDirections } from '@/types/Repository';
import { organizationFields } from '../../types/Organization';
import { typedEntries } from '@/helpers/helpers';

const props = defineProps({
    items: {
        type: Object as PropType<Organization[]>,
        default: () => []
    },
    sorts: {
        type: Object as PropType<EntityRepositorySorts<Organization>>
    }
})

const emit = defineEmits<{
    (e: 'updateSorts', payload: EntityRepositorySorts<Organization>): void
    (e: 'deleteOrg', payload: number): void
    (e: 'updateOrg', payload: Organization): void
}>()


const orgHeaders = computed<TableHeader[]>(() => {
    const headers: TableHeader[] = [
        { title: 'Название', sort: { field: 'name' }},
        { title: 'ФИО директора', sort: { field: 'headManagerName' } },
        { title: 'Номер телефона' },
        { title: 'Адрес' }
    ]

    if (props.sorts) {
        typedEntries(props.sorts).forEach(sortItem => {
            const [ field, direction ] = sortItem
            const neededHeader = headers
                .find(headerItem => headerItem.sort?.field === field)

            if (neededHeader?.sort) {
                neededHeader.sort.direction = direction
            }
        })
    }

    return headers
})


const updateSorts = (newHeaders: TableHeader[]) => {

    const newSorts: EntityRepositorySorts<Organization> = {}
    
    newHeaders
        .forEach(item => {
            if (item.sort && organizationFields.includes(item.sort.field as OrganizationField) && item.sort.direction) {
                newSorts[item.sort.field as OrganizationField] = item.sort.direction
            }
        })

    emit('updateSorts', newSorts)
}

const actions: TableAction[] = [
    {
        icon: 'delete',
        callback: (item: TableItem) => {
            const numId = +item.id
            if (!Number.isNaN(numId)) {
                emit('deleteOrg', numId)
            }
        }
    }
]

const mappedOrganizations = computed<TableItem[]>(() => props.items.map(item => {
    const fullAddress = `г. ${item.address.city}, ул. ${item.address.street}, д.${item.address.house}`

    return {
        id: `${item.id}`,
        data: [item.name, item.headManagerName, item.phone, fullAddress]
    }
}))

const onRowClick = (item: TableItem) => {
    const neededOrg = props.items.find(org => `${org.id}` === item.id)

    neededOrg && emit('updateOrg', neededOrg)
}

console.log('mappedOrganizations', mappedOrganizations.value)

</script>

<template>
    <CommonTable
        :headers="orgHeaders"
        :items="mappedOrganizations"
        :actions
        @changeHeaders="updateSorts"
        @row-click="onRowClick"
    />
</template>