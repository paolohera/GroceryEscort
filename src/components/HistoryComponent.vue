<!-- HistoryComponent.vue -->
<template>
  <div class="min-h-screen bg-[#F4F1DE]">
    <div class="max-w-lg mx-auto p-4 w-full">
      <!-- History Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-[#2C5F2D]">Shopping History</h1>
        <p class="text-[#6F4E37] text-sm">Track your shopping activities</p>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div class="bg-white rounded-2xl shadow-sm p-4">
          <div class="text-sm text-[#6F4E37] mb-1">Total Purchased</div>
          <div class="text-2xl font-bold text-[#2C5F2D]">
            ₱{{ totalPurchased.toFixed(2) }}
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-4">
          <div class="text-sm text-[#6F4E37] mb-1">Items Purchased</div>
          <div class="text-2xl font-bold text-[#2C5F2D]">
            {{ purchasedIndividualItems.length + purchasedBulkItems.length }}
          </div>
        </div>
      </div>
      
      <!-- Tabs Navigation -->
      <div class="flex bg-white rounded-xl mb-4 overflow-hidden">
        <button 
          @click="activeTab = 'purchased'"
          class="flex-1 py-3 px-4 text-center transition-colors"
          :class="activeTab === 'purchased' ? 'bg-[#2C5F2D] text-white' : 'text-[#6F4E37] hover:bg-[#F4F1DE]'"
        >
          Purchased Items
        </button>
        <button 
          @click="activeTab = 'deleted'"
          class="flex-1 py-3 px-4 text-center transition-colors relative"
          :class="activeTab === 'deleted' ? 'bg-[#2C5F2D] text-white' : 'text-[#6F4E37] hover:bg-[#F4F1DE]'"
        >
          Deleted Items
          <span v-if="hasAnyDeletedItems" class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
      
      <!-- Clear History button -->
      <button 
        v-if="activeTab === 'purchased'"
        @click="showClearConfirmation = true"
        class="px-4 py-2 bg-[#C34A36] hover:bg-[#A33D2D] text-white rounded-xl transition-colors text-sm flex items-center gap-2 mb-6"
      >
        🗑️ Clear History
      </button>

      <!-- Clear Deleted Items button -->
      <button 
        v-if="activeTab === 'deleted' && hasAnyDeletedItems"
        @click="showClearDeletedConfirmation = true"
        class="px-4 py-2 bg-[#C34A36] hover:bg-[#A33D2D] text-white rounded-xl transition-colors text-sm flex items-center gap-2 mb-6"
      >
        🗑️ Clear Deleted Items
      </button>

      <!-- Clear History Confirmation Modal -->
      <div v-if="showClearConfirmation" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click="showClearConfirmation = false"
      >
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4" @click.stop>
          <h3 class="text-lg font-semibold text-[#2C5F2D] mb-2">Clear History</h3>
          <p class="text-[#6F4E37] mb-6">Are you sure you want to clear all purchase history? Your current shopping list will not be affected.
            But you will not be able to track your weekly, monthly and yearly expenses.
          </p>
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              @click="clearHistory"
              class="flex-1 px-4 py-2 bg-[#C34A36] hover:bg-[#A33D2D] text-white rounded-xl transition-colors"
            >
              Yes, Clear History
            </button>
            <button 
              @click="showClearConfirmation = false"
              class="flex-1 px-4 py-2 bg-[#2C5F2D] hover:bg-[#5D4230] text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Clear Deleted Items Confirmation Modal -->
      <div v-if="showClearDeletedConfirmation" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click="showClearDeletedConfirmation = false"
      >
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4" @click.stop>
          <h3 class="text-lg font-semibold text-[#2C5F2D] mb-2">Clear Deleted Items</h3>
          <p class="text-[#6F4E37] mb-6">Are you sure you want to permanently remove all deleted items? This action cannot be undone.</p>
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              @click="clearDeletedItems"
              class="flex-1 px-4 py-2 bg-[#C34A36] hover:bg-[#A33D2D] text-white rounded-xl transition-colors"
            >
              Yes, Clear Deleted Items
            </button>
            <button 
              @click="showClearDeletedConfirmation = false"
              class="flex-1 px-4 py-2 bg-[#2C5F2D] hover:bg-[#5D4230] text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Soft Delete Confirmation Modal -->
      <div v-if="showDeleteModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click="closeDeleteModal"
      >
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4" @click.stop>
          <h3 class="text-lg font-semibold text-[#2C5F2D] mb-2">Delete Item</h3>
          <p class="text-[#6F4E37] mb-6">Are you sure you want to delete "{{ itemToDelete?.name || itemToDelete?.title }}"? You can restore it later from the Deleted tab.</p>
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              @click="softDeleteItem"
              class="flex-1 px-4 py-2 bg-[#C34A36] hover:bg-[#A33D2D] text-white rounded-xl transition-colors"
            >
              Yes, Delete
            </button>
            <button 
              @click="closeDeleteModal"
              class="flex-1 px-4 py-2 bg-[#6F4E37] hover:bg-[#5D4230] text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      
      <!-- PURCHASED ITEMS TAB -->
      <div v-if="activeTab === 'purchased'">
        <!-- Individual Purchased Items Section -->
        <div v-if="purchasedIndividualItems.length > 0" class="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <h2 class="text-lg font-semibold text-[#2C5F2D] mb-4">Individual Purchased Items</h2>
          <div class="space-y-3">
            <div v-for="item in purchasedIndividualItems" :key="item.id" 
              class="bg-[#F4F1DE] p-4 rounded-xl"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-medium text-[#2C5F2D]">{{ item.name }}</div>
                  <div class="text-sm text-[#6F4E37] mt-1">
                    ₱{{ item.price.toFixed(2) }} × {{ item.quantity }}
                  </div>
                  <div class="text-xs text-[#2C5F2D] mt-1">
                    ✓ {{ formatDateTime(item.boughtAt) }}
                  </div>
                </div>
                <div class="flex flex-col gap-2 items-end">
                  <div class="text-[#2C5F2D] font-medium">
                    ₱{{ (item.price * item.quantity).toFixed(2) }}
                  </div>
                  <button 
                    @click="openDeleteModal(item)"
                    class="w-8 h-8 flex items-center justify-center bg-[#C34A36] text-white rounded-lg hover:bg-[#A33D2D] transition-colors"
                    title="Delete Item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bulk Purchased Items Section -->
        <div v-if="purchasedBulkGroups.length > 0" class="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <h2 class="text-lg font-semibold text-[#2C5F2D] mb-4">Bulk Purchased Items</h2>
          <div class="space-y-4">
            <div v-for="group in purchasedBulkGroups" :key="group.id" 
              class="bg-[#F4F1DE] p-4 rounded-xl"
            >
              <!-- Group Header -->
              <div class="flex justify-between items-start mb-3">
                <div>
                  <div class="font-medium text-[#2C5F2D]">{{ group.title }}</div>
                  <div class="text-xs text-[#2C5F2D] mt-1">
                    ✓ {{ formatDateTime(group.boughtAt) }}
                  </div>
                </div>
                <div class="text-[#2C5F2D] font-medium">
                  ₱{{ group.totalAmount.toFixed(2) }}
                </div>
              </div>

              <!-- Group Items -->
              <div class="space-y-2 mt-3 pl-4 border-l-2 border-[#2C5F2D]">
                <div v-for="item in group.items" :key="item.id" 
                  class="text-sm text-[#6F4E37]"
                >
                  <div class="flex justify-between">
                    <span>{{ item.name }} ({{ item.quantity }}x)</span>
                    <span>₱{{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <button 
                @click="openDeleteModal(group)"
                class="mt-3 w-8 h-8 flex items-center justify-center bg-[#C34A36] text-white rounded-lg hover:bg-[#A33D2D] transition-colors"
                title="Delete Group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- No Purchased Items Message -->
        <div v-if="!hasAnyPurchasedItems" class="bg-white rounded-2xl shadow-sm p-4 mb-6 text-center py-6 text-[#6F4E37]">
          No purchased items yet
        </div>
      </div>
      
      <!-- DELETED ITEMS TAB -->
      <div v-if="activeTab === 'deleted'">
        <!-- Individual Deleted Items Section -->
        <div v-if="deletedIndividualItems.length > 0" class="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <h2 class="text-lg font-semibold text-[#2C5F2D] mb-4">Individual Deleted Items</h2>
          <div class="space-y-3">
            <TransitionGroup name="list">
              <div v-for="item in deletedIndividualItems" :key="item.id" 
                class="bg-[#F4F1DE] p-4 rounded-xl"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <div class="font-medium text-[#2C5F2D]">{{ item.name }}</div>
                    <div class="text-sm text-[#6F4E37] mt-1">
                      ₱{{ item.price.toFixed(2) }} × {{ item.quantity }}
                    </div>
                    <div class="text-xs text-red-500 mt-1">
                      🗑️ {{ formatDateTime(item.deletedAt) }}
                    </div>
                  </div>
                  <div class="flex flex-col gap-2 items-end">
                    <div class="text-[#2C5F2D] font-medium">
                      ₱{{ (item.price * item.quantity).toFixed(2) }}
                    </div>
                    <div class="flex gap-2">
                      <button 
                        @click="restoreItem(item)"
                        class="w-8 h-8 flex items-center justify-center bg-[#2C5F2D] text-white rounded-lg hover:bg-[#214823] transition-colors"
                        title="Restore Item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                          <path d="M3 3v5h5"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>

        <!-- Bulk Deleted Items Section -->
        <div v-if="deletedBulkGroups.length > 0" class="bg-white rounded-2xl shadow-sm p-4">
          <h2 class="text-lg font-semibold text-[#2C5F2D] mb-4">Bulk Deleted Items</h2>
          <div class="space-y-4">
            <div v-for="group in deletedBulkGroups" :key="group.id" 
              class="bg-[#F4F1DE] p-4 rounded-xl"
            >
              <!-- Group Title and Total -->
              <div class="flex justify-between items-start mb-1">
                <div class="font-medium text-[#2C5F2D]">{{ group.title }}</div>
                <div class="text-[#2C5F2D] font-medium">₱{{ group.totalAmount.toFixed(2) }}</div>
              </div>

              <!-- Timestamp -->
              <div class="text-xs text-red-500 mb-2">
                🗑️ {{ formatDateTime(group.deletedAt) }}
              </div>

              <!-- Group Items -->
              <div class="space-y-1 pl-4 border-l-2 border-[#2C5F2D] mb-3">
                <div v-for="item in group.items" :key="item.id" 
                  class="text-sm text-[#6F4E37] flex justify-between"
                >
                  <span>{{ item.name }} ({{ item.quantity }}×)</span>
                  <span>₱{{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>

              <!-- Restore Button -->
              <button 
                @click="restoreItem(group)"
                class="w-8 h-8 inline-flex items-center justify-center bg-[#2C5F2D] text-white rounded-lg hover:bg-[#214823] transition-colors"
                title="Restore Group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- No Deleted Items Message -->
        <div v-if="!hasAnyDeletedItems" class="bg-white rounded-2xl shadow-sm p-4 text-center py-6 text-[#6F4E37]">
          No deleted items
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

export default {
  name: 'History',
  emits: ['restoreItem'],
  
  setup(props, { emit }) {
    const completedItems = ref([]) // Separate storage for completed items
    const deletedItems = ref([])
    const showClearConfirmation = ref(false)
    const showClearDeletedConfirmation = ref(false) // New ref for clear deleted items confirmation
    const showDeleteModal = ref(false)
    const itemToDelete = ref(null)
    const activeTab = ref('purchased') // Default active tab

    const purchasedBulkGroups = computed(() => {
      const groups = {}
      
      completedItems.value
        .filter(item => item.source === 'bulk')
        .forEach(item => {
          if (!groups[item.groupId]) {
            groups[item.groupId] = {
              id: item.groupId,
              title: item.groupTitle,
              boughtAt: item.boughtAt,
              items: [],
              totalAmount: 0
            }
          }
          groups[item.groupId].items.push(item)
          groups[item.groupId].totalAmount += item.price * item.quantity
        })
      
      return Object.values(groups).sort((a, b) => new Date(b.boughtAt) - new Date(a.boughtAt))
    })

    const deletedBulkGroups = computed(() => {
      const groups = {}
      
      deletedItems.value
        .filter(item => item.source === 'bulk')
        .forEach(item => {
          if (!groups[item.groupId]) {
            groups[item.groupId] = {
              id: item.groupId,
              title: item.groupTitle,
              deletedAt: item.deletedAt,
              items: [],
              totalAmount: 0
            }
          }
          groups[item.groupId].items.push(item)
          groups[item.groupId].totalAmount += item.price * item.quantity
        })
      
      return Object.values(groups).sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt))
    })

    const openDeleteModal = (item) => {
      itemToDelete.value = item
      showDeleteModal.value = true
    }
    
    const closeDeleteModal = () => {
      showDeleteModal.value = false
      itemToDelete.value = null
    }
    
    // Modified to use soft delete instead of permanent delete
    const softDeleteItem = () => {
      if (!itemToDelete.value) return

      const now = new Date().toISOString()
      
      if (itemToDelete.value.items) {
        // Handling bulk group deletion (soft delete)
        const groupId = itemToDelete.value.id
        const itemsToDelete = completedItems.value.filter(item => item.groupId === groupId)
        
        // Remove from completed items
        completedItems.value = completedItems.value.filter(item => item.groupId !== groupId)
        
        // Add to deleted items with deletedAt timestamp
        itemsToDelete.forEach(item => {
          const deletedItem = {
            ...item,
            deletedAt: now
          }
          deletedItems.value.push(deletedItem)
        })
      } else {
        // Handling individual item deletion (soft delete)
        const itemToRemove = completedItems.value.find(item => item.id === itemToDelete.value.id)
        
        if (itemToRemove) {
          // Remove from completed items
          completedItems.value = completedItems.value.filter(item => item.id !== itemToDelete.value.id)
          
          // Add to deleted items with deletedAt timestamp
          const deletedItem = {
            ...itemToRemove,
            deletedAt: now
          }
          deletedItems.value.push(deletedItem)
        }
      }

      // Update localStorage
      localStorage.setItem('completedItems', JSON.stringify(completedItems.value))
      localStorage.setItem('deletedItems', JSON.stringify(deletedItems.value))

      // Close modal
      closeDeleteModal()
      
      // Switch to deleted tab after deleting
      activeTab.value = 'deleted'
    }

    // Function to update data from localStorage
    const updateFromStorage = () => {
      const storedCompletedItems = localStorage.getItem('completedItems')
      const storedDeletedItems = localStorage.getItem('deletedItems')
      
      // Only include items that are still marked as inCart
      if (storedCompletedItems) {
        const allCompletedItems = JSON.parse(storedCompletedItems)
        completedItems.value = allCompletedItems.filter(item => item.inCart)
      } else {
        completedItems.value = []
      }
      
      deletedItems.value = storedDeletedItems ? JSON.parse(storedDeletedItems) : []
    }
    
    // Function to clear history
    const clearHistory = () => {
      // Clear only the history storage
      localStorage.setItem('completedItems', JSON.stringify([]))
      localStorage.setItem('deletedItems', JSON.stringify([]))
      
      // Update local refs
      completedItems.value = []
      deletedItems.value = []
      
      // Hide confirmation modal
      showClearConfirmation.value = false
    }

    // New function to clear only deleted items
    const clearDeletedItems = () => {
      // Clear only the deleted items storage
      localStorage.setItem('deletedItems', JSON.stringify([]))
      
      // Update local ref
      deletedItems.value = []
      
      // Hide confirmation modal
      showClearDeletedConfirmation.value = false
    }

    // Storage event listener
    const handleStorageChange = (event) => {
      if (event.key === 'completedItems' || event.key === 'deletedItems') {
        updateFromStorage()
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      updateFromStorage()
      window.addEventListener('storage', handleStorageChange)
      
      // Initial migration of completed items if needed
      const shoppingItems = localStorage.getItem('shoppingItems')
      if (shoppingItems && !localStorage.getItem('completedItems')) {
        const items = JSON.parse(shoppingItems)
        const completed = items.filter(item => item.inCart && item.boughtAt)
        localStorage.setItem('completedItems', JSON.stringify(completed))
      }
    })

    onUnmounted(() => {
      window.removeEventListener('storage', handleStorageChange)
    })

    watch(completedItems, (newValue) => {
      // Ensure we only save items that are still marked as inCart
      const itemsToSave = newValue.filter(item => item.inCart)
      localStorage.setItem('completedItems', JSON.stringify(itemsToSave))
    }, { deep: true })

    watch(deletedItems, (newValue) => {
      localStorage.setItem('deletedItems', JSON.stringify(newValue))
    }, { deep: true })

    // Separate purchased items by type
    const purchasedIndividualItems = computed(() => {
      return completedItems.value
        .filter(item => item.source === 'individual' || !item.source)
        .sort((a, b) => new Date(b.boughtAt) - new Date(a.boughtAt))
    })
    
    const purchasedBulkItems = computed(() => {
      return completedItems.value
        .filter(item => item.source === 'bulk')
        .sort((a, b) => new Date(b.boughtAt) - new Date(a.boughtAt))
    })
    
    // Separate deleted items by type
    const deletedIndividualItems = computed(() => {
      return deletedItems.value
        .filter(item => item.source === 'individual' || !item.source)
        .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt))
    })

    const deletedBulkItems = computed(() => {
      return deletedItems.value
        .filter(item => item.source === 'bulk')
        .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt))
    })

    // Helper computed properties
    const hasAnyPurchasedItems = computed(() => {
      return purchasedIndividualItems.value.length > 0 || purchasedBulkItems.value.length > 0
    })

    const hasAnyDeletedItems = computed(() => {
      return deletedIndividualItems.value.length > 0 || deletedBulkItems.value.length > 0
    })

    const totalPurchased = computed(() => {
      const individualTotal = purchasedIndividualItems.value.reduce((sum, item) => {
        return sum + (item.price * item.quantity)
      }, 0)
      const bulkTotal = purchasedBulkItems.value.reduce((sum, item) => {
        return sum + (item.price * item.quantity)
      }, 0)
      return individualTotal + bulkTotal
    })

    const formatDateTime = (date) => {
      if (!date) return ''
      const d = new Date(date)
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
    }

    const restoreItem = (itemOrGroup) => {
      if (itemOrGroup.items) {
        // Handling bulk group restoration
        const groupId = itemOrGroup.id
        const itemsToRestore = deletedItems.value.filter(item => item.groupId === groupId)
        
        // Add all items back to completed items (they were already purchased)
        itemsToRestore.forEach(item => {
          // Check if the item isn't already in completedItems
          if (!completedItems.value.some(i => i.id === item.id)) {
            const restoredItem = {
              ...item,
              deletedAt: null
            }
            completedItems.value.push(restoredItem)
          }
        })
        
        // Remove from deleted items
        deletedItems.value = deletedItems.value.filter(item => item.groupId !== groupId)
      } else {
        // Individual item restoration
        const itemToRestore = deletedItems.value.find(i => i.id === itemOrGroup.id)
        
        if (itemToRestore) {
          // Add back to completed items (it was already purchased)
          if (!completedItems.value.some(i => i.id === itemToRestore.id)) {
            const restoredItem = {
              ...itemToRestore,
              deletedAt: null
            }
            completedItems.value.push(restoredItem)
          }
          
          // Remove from deleted items
          deletedItems.value = deletedItems.value.filter(i => i.id !== itemOrGroup.id)
        }
      }
      
      // Update localStorage
      localStorage.setItem('completedItems', JSON.stringify(completedItems.value))
      localStorage.setItem('deletedItems', JSON.stringify(deletedItems.value))
      
      // Switch to purchased tab after restoring
      activeTab.value = 'purchased'
    }
    
    const addToHistory = (item) => {
      if (!completedItems.value.some(i => i.id === item.id)) {
        completedItems.value.push(item)
      }
    }

    return {
      purchasedIndividualItems,
      purchasedBulkItems,
      deletedIndividualItems,
      deletedBulkItems,
      hasAnyPurchasedItems,
      hasAnyDeletedItems,
      totalPurchased,
      formatDateTime,
      restoreItem,
      clearHistory,
      clearDeletedItems,
      purchasedBulkGroups,
      deletedBulkGroups,
      activeTab,
      showClearConfirmation,
      showClearDeletedConfirmation,
      showDeleteModal,
      openDeleteModal,
      closeDeleteModal,
      softDeleteItem,
      itemToDelete,
      addToHistory
    }
  }
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>