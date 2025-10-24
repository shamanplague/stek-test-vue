<script setup lang="ts">

import { computed, onMounted, ref, watch } from 'vue'
import CommonModal from './components/common/CommonModal.vue'
import Paginator from './components/common/Paginator.vue'
import { OrganizationsRepositoryFactory } from './repositories/organizations/OrganizationsRepository'
import type { Organization } from './types/Organization'
import type { EntityRepositoryFilters, EntityRepositorySorts, Pagination } from './types/Repository'
import OrganizationsTable from '@components/tables/OrganizationsTable.vue'
import OrganizationForm from './components/forms/OrganizationForm.vue'

const isFormModalOpen = ref(false)
const orgForUpdate = ref<Organization | undefined>()

const formModalTitle = computed(() => orgForUpdate.value?.id ? 'Редактирование организации' : 'Создание организации')

const items = ref<Organization[]>([])
const pagination = ref<Pagination>({
  page: 0,
  perPage: 0,
  totalItems: 0,
  totalPages: 0
})
const currentSorts = ref<EntityRepositorySorts<Organization>>({})
const currentFilters = ref<EntityRepositoryFilters>({
  searchString: '',
})

const orgRepository = OrganizationsRepositoryFactory.createLocal({ perPage: 15 })

const setOrganizations = (page: number) => {
  const response = orgRepository.getOrganizations({
    ...currentFilters.value,
    pagination: {
      page
    }
  },
  currentSorts.value)

  items.value = response.items
  pagination.value = response.pagination
}

watch(currentFilters, () => {
  setOrganizations(1)
}, { deep: true })

const updateSorts = (sorts: EntityRepositorySorts<Organization>) => {
  currentSorts.value = sorts
  setOrganizations(1)
}

const goToPage = (page: number) => {
  setOrganizations(page)
}

const deleteOrg = (id: number) => {
  orgRepository.removeOrganization(id)
  setOrganizations(pagination.value.page)
}

const openFormModal = () => {
  isFormModalOpen.value = true
}

const closeFormModal = () => {
  isFormModalOpen.value = false
  orgForUpdate.value = undefined
}

const onSubmitForm = (item: Organization) => {
  if (item.id) {
    orgRepository.updateOrganization(item)
    setOrganizations(pagination.value.page)
  } else {
    orgRepository.addOrganization(item)
    setOrganizations(1)
  }

  closeFormModal()
}

const updateOrg = (org: Organization) => {
  orgForUpdate.value = org
  openFormModal()
}

onMounted(() => {
  setOrganizations(1)
})

</script>

<template>
  <div class="container">

    <div class="top-panel">
      <div class="search-input-wrapper">
        <input
          v-model="currentFilters.searchString"
          class="search-input"
          type="text"
          placeholder="Найти по ФИО..."
        >
      </div>
      <div class="add-button-wrapper">
        <button @click="openFormModal">Добавить</button>
      </div>
    </div>

    <OrganizationsTable
      :items
      :sorts="currentSorts"
      @deleteOrg="deleteOrg"
      @updateSorts="updateSorts"
      @updateOrg="updateOrg"
    />

    <div v-if="pagination?.totalPages" class="paginator-wrapper">
      <Paginator
        :pagination
        @goToPage="goToPage"
      />
    </div>

    <CommonModal 
      :isOpen="isFormModalOpen"
      :title="formModalTitle"
      @close="closeFormModal"
    >
      <OrganizationForm
        :organization="orgForUpdate"
        @submit="onSubmitForm"
        @close="closeFormModal"
      />
    </CommonModal>
  </div>
</template>
