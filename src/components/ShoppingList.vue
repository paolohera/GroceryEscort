<template>
  <div class="min-h-screen bg-[#F4F1DE]">
    <IntroModal />
    <div class="max-w-lg mx-auto p-4">
      <!-- Header -->
      <div class="mb-5 text-center">
        <p class="text-[#6F4E37] text-sm">Your smart shopping companion</p>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <div class="bg-white rounded-2xl shadow-sm p-4">
          <div class="text-sm text-[#6F4E37] mb-1">Total Cost</div>
          <div class="text-2xl font-bold text-[#2C5F2D]">
            ₱{{ totalCost.toFixed(2) }}
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-4">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-sm text-[#6F4E37] mb-1">Items In Cart</div>
              <div class="text-2xl font-bold text-[#2C5F2D] font-sans">{{ totalItems }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Item Form -->
      <div class="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <form @submit.prevent="addNewItem" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#6F4E37] mb-1">Item Name</label>
            <input 
              v-model="newItem.name" 
              placeholder="What do you need to buy?" 
              :class="[
                'w-full p-3 rounded-xl border focus:ring-2 focus:ring-[#2C5F2D] focus:border-transparent',
                formErrors.name ? 'border-red-500' : 'border-[#A1C181]'
              ]"
            />
            <p v-if="formErrors.name" class="mt-1 text-sm text-red-500">{{ formErrors.name }}</p>
          </div>
          <div class="flex gap-3">
            <div class="flex-1">
              <label class="block text-sm font-medium text-[#6F4E37] mb-1">Price (₱)</label>
              <input 
                v-model.number="newItem.price" 
                type="number" 
                step="0.01" 
                min="0"
                placeholder="0.00"
                :class="[
                  'w-full p-3 rounded-xl border focus:ring-2 focus:ring-[#2C5F2D] focus:border-transparent',
                  formErrors.price ? 'border-red-500' : 'border-[#A1C181]'
                ]"
              />
              <p v-if="formErrors.price" class="mt-1 text-sm text-red-500">{{ formErrors.price }}</p>
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-[#6F4E37] mb-1">Quantity</label>
              <input 
                v-model.number="newItem.quantity" 
                type="number" 
                min="1"
                placeholder="1" 
                :class="[
                  'w-full p-3 rounded-xl border focus:ring-2 focus:ring-[#2C5F2D] focus:border-transparent',
                  formErrors.quantity ? 'border-red-500' : 'border-[#A1C181]'
                ]"
              />
              <p v-if="formErrors.quantity" class="mt-1 text-sm text-red-500">{{ formErrors.quantity }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button 
              type="submit" 
              class="flex-1 h-12 bg-[#2C5F2D] hover:bg-[#214823] text-white rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span class="text-xl">+</span>
              Add Item
            </button>
            <BulkAddModal 
              :onAddItems="handleBulkAdd"
              buttonClass="h-12 px-6 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl transition-colors flex items-center justify-center"
            />
          </div>
        </form>
      </div>

      <!-- Controls -->
      <div class="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div class="space-y-3">
          <div class="relative">
            <span class="absolute inset-y-0 left-3 flex items-center text-[#6F4E37]">
              🔍
            </span>
            <input 
              v-model="searchTerm" 
              placeholder="Search items..." 
              class="w-full pl-10 pr-4 py-3 rounded-xl border border-[#A1C181] focus:ring-2 focus:ring-[#2C5F2D] focus:border-transparent"
            />
          </div>
          
          <div class="flex gap-2">
            <select 
                v-model="currentFilter"
                class="flex-1 p-3 rounded-xl border border-[#A1C181] focus:ring-2 focus:ring-[#2C5F2D] focus:border-transparent"
              >
                <option value="all">All Items</option>
                <option value="individual">Individual Items</option>
                <option value="bulk">Bulk Items</option>
              </select>
            
            <select 
              v-model="currentSort"
              class="flex-1 p-3 rounded-xl border border-[#A1C181] focus:ring-2 focus:ring-[#2C5F2D] focus:border-transparent"
            >
              <option value="nameAsc">A-Z</option>
              <option value="nameDesc">Z-A</option>
              <option value="priceLow">₱ Low-High</option>
              <option value="priceHigh">₱ High-Low</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Individual Items Section -->
      <div v-if="showIndividualItems && individualItems.length > 0" class="mb-6">
        <h2 class="text-lg font-semibold text-[#2C5F2D] mb-3">Individual Items</h2>
        <TransitionGroup 
          name="list" 
          tag="ul" 
          class="space-y-3"
        >
          <li 
            v-for="item in filteredAndSortedIndividualItems" 
            :key="item.id"
            :class="[
              'bg-white rounded-2xl shadow-sm p-4 transition-all cursor-pointer hover:bg-[#F4F1DE]',
              item.inCart ? 'border-l-4 border-[#2C5F2D]' : 'border-l-4 border-transparent',
              item.price === 0 ? 'bg-yellow-50' : ''
            ]"
            @click="openEditModal(item)"
          >
            <div class="flex items-start gap-3">
              <input 
                type="checkbox" 
                :checked="item.inCart || item.id === tempCheckedItemId"
                @change="openPurchaseConfirmation(item)"
                @click.stop
                class="mt-1 w-4 h-4 rounded text-[#2C5F2D] focus:ring-[#2C5F2D]"
              />
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span 
                    class="font-medium truncate"
                    :class="{'line-through text-[#A1C181]': item.inCart}"
                  >
                    {{ item.name }}
                  </span>
                </div>
                
                <div class="flex flex-wrap gap-2 text-sm text-[#6F4E37] mt-1">
                  <span>₱{{ item.price.toFixed(2) }} × {{ item.quantity }}</span>
                  <span v-if="item.boughtAt" class="text-[#2C5F2D]">
                    ✓ {{ formatDate(item.boughtAt) }}
                  </span>
                  <span v-if="item.price === 0" class="text-yellow-600">
                    (Click to set price)
                  </span>
                </div>
              </div>
              
              <button 
                @click.stop="deleteItem(item)"
                class="p-2 text-[#C34A36] hover:text-[#A33D2D] transition-colors"
              >
                🗑️
              </button>
            </div>
          </li>
        </TransitionGroup>
      </div>

      <!-- Purchase Confirmation Modal -->
      <div v-if="showPurchaseConfirmation" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click="closePurchaseConfirmation"
      >
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4" @click.stop>
          <h3 class="text-lg font-semibold text-[#2C5F2D] mb-2">Confirm Purchase</h3>
          <p class="text-[#6F4E37] mb-6">Are you done buying this product?</p>
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              @click="confirmPurchase"
              class="flex-1 px-4 py-2 bg-[#2C5F2D] hover:bg-[#214823] text-white rounded-xl transition-colors"
            >
              Yes, Mark as Purchased
            </button>
            <button 
              @click="closePurchaseConfirmation"
              class="flex-1 px-4 py-2 bg-[#6F4E37] hover:bg-[#5D4230] text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
 
      <!-- Bulk Items Section -->
      <div v-if="showBulkItems && filteredGroupedBulkItems.length > 0" class="mb-6">
        <h2 class="text-lg font-semibold text-[#2C5F2D] mb-3">Bulk Items</h2>
        <TransitionGroup name="list" tag="div" class="space-y-4">
          <div v-for="group in filteredGroupedBulkItems" :key="group.id" 
            class="bg-white rounded-2xl shadow-sm p-4"
          >
            <!-- Group Header -->
            <div class="flex justify-between items-center mb-4">
              <div>
                <h3 class="font-medium text-[#2C5F2D]">{{ group.title || 'Bulk Group' }}</h3>
                <p class="text-sm text-[#6F4E37]">Added: {{ formatDate(group.createdAt) }}</p>
              </div>
              <div class="flex gap-2">
                <button 
                  @touchstart.prevent="markGroupAsBought(group)"
                  @click="markGroupAsBought(group)"
                  class="p-2 hover:bg-[#F4F1DE] rounded-lg transition-colors active:bg-[#E8E5D4]"
                  title="Mark All as Done"
                >
                  <span class="text-[#2C5F2D] text-xl">✅</span>
                </button>
                <button 
                  @touchstart.prevent="openDeleteGroupConfirmation(group)"
                  @click="openDeleteGroupConfirmation(group)"
                  class="p-2 hover:bg-[#F4F1DE] rounded-lg transition-colors active:bg-[#E8E5D4]"
                  title="Delete Group"
                >
                  <span class="text-[#C34A36] text-xl">🗑️</span>
                </button>
              </div>
            </div>

            <!-- Group Items -->
            <div class="space-y-2">
              <div v-for="item in group.filteredItems" :key="item.id"
                class="flex items-center gap-3 p-3 rounded-xl bg-[#F4F1DE] active:bg-[#E8E5D4] touch-manipulation"
                @touchstart.prevent="handleItemTap(item)"
                @click="handleItemTap(item)"
              >
                <input 
                  type="checkbox" 
                  v-model="item.checked"
                  class="w-4 h-4 rounded text-[#2C5F2D] focus:ring-[#2C5F2D]"
                  @touchstart.stop
                  @click.stop
                />
                <div class="flex-1 min-w-0">
                  <span class="font-medium">{{ item.name }}</span>
                  <div class="text-sm text-[#6F4E37]">
                    {{ item.price === 0 ? 'Tap to set price' : `₱${item.price.toFixed(2)} × ${item.quantity}` }}
                  </div>
                </div>
                <div v-if="item.price > 0" class="text-[#2C5F2D] font-medium">
                  ₱{{ (item.price * item.quantity).toFixed(2) }}
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
 
      <!-- Edit Modal -->
      <EditItemModal
        :is-open="editModalOpen"
        :item="selectedItem"
        :on-save="handleEditSave"
        :on-close="closeEditModal"
      />
  
      <!-- Undo Delete Notification -->
      <div 
        v-if="showUndoDelete" 
        class="fixed bottom-6 right-6 flex items-center gap-2 p-4 bg-[#2C5F2D] text-white rounded-xl shadow-lg animate-fade-in"
      >
        Item deleted
        <button 
          @click="undoDelete"
          class="px-3 py-1 bg-[#A1C181] rounded-lg hover:bg-[#8EAF70] transition-colors"
        >
          Undo
        </button>
      </div>
      
      <!-- Group Purchase Confirmation Modal -->
      <div v-if="showGroupPurchaseModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click="showGroupPurchaseModal = false"
      >
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4" @click.stop>
          <h3 class="text-lg font-semibold text-[#2C5F2D] mb-2">Confirm Purchase</h3>
          <p class="text-[#6F4E37] mb-6">Are you done buying these items?</p>
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              @click="confirmGroupPurchase"
              class="flex-1 px-4 py-2 bg-[#2C5F2D] hover:bg-[#214823] text-white rounded-xl transition-colors"
            >
              Yes, Mark as Purchased
            </button>
            <button 
              @click="showGroupPurchaseModal = false"
              class="flex-1 px-4 py-2 bg-[#6F4E37] hover:bg-[#5D4230] text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Group Delete Confirmation Modal -->
      <div v-if="showDeleteGroupConfirmation" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click="showDeleteGroupConfirmation = false"
      >
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4" @click.stop>
          <h3 class="text-lg font-semibold text-[#C34A36] mb-2">Delete Group</h3>
          <p class="text-[#6F4E37] mb-6">Are you sure you want to delete this group? This action cannot be undone.</p>
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              @click="confirmDeleteGroup"
              class="flex-1 px-4 py-2 bg-[#C34A36] hover:bg-[#A33D2D] text-white rounded-xl transition-colors"
            >
              Yes, Delete Permanently
            </button>
            <button 
              @click="showDeleteGroupConfirmation = false"
              class="flex-1 px-4 py-2 bg-[#6F4E37] hover:bg-[#5D4230] text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Prevent grey highlight on tap in mobile */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Ensure proper touch target size */
button, 
input[type="checkbox"] {
  min-height: 16px;
  min-width: 16px;
}

/* Improve touch scrolling */
.touch-manipulation {
  touch-action: manipulation;
}
</style>

// Completed version of the script section
<script>
import { ref, computed, onMounted, watch } from 'vue'
import BulkAddModal from './BulkAddModal.vue'
import IntroModal from './IntroModal.vue'
import EditItemModal from './EditItemModal.vue'

export default {
  name: 'ShoppingList',
  components: {
    BulkAddModal,
    IntroModal,
    EditItemModal
  },
  
  setup() {
    const items = ref([])
    const searchTerm = ref('')
    const currentFilter = ref('all')
    const currentSort = ref('nameAsc')
    const deletedItems = ref([])
    const lastDeletedItem = ref(null)
    const showUndoDelete = ref(false)
    const editModalOpen = ref(false)
    const selectedItem = ref(null)
    const showGroupPurchaseModal = ref(false)
    const selectedGroup = ref(null)
    const showPurchaseConfirmation = ref(false)
    const itemToConfirm = ref(null)
    const tempCheckedItemId = ref(null)
    const showDeleteGroupConfirmation = ref(false)
    const groupToDelete = ref(null)

    // Computed properties to control section visibility
    const showIndividualItems = computed(() => {
      return currentFilter.value === 'all' || currentFilter.value === 'individual'
    })

    const showBulkItems = computed(() => {
      return currentFilter.value === 'all' || currentFilter.value === 'bulk'
    })

    const openPurchaseConfirmation = (item) => {
      itemToConfirm.value = item
      tempCheckedItemId.value = item.id 
      showPurchaseConfirmation.value = true
    }

    const closePurchaseConfirmation = () => {
      showPurchaseConfirmation.value = false
      tempCheckedItemId.value = null 
      itemToConfirm.value = null
    }

    const confirmPurchase = () => {
      if (!itemToConfirm.value) return

      // Set purchase timestamp
      itemToConfirm.value.inCart = true
      itemToConfirm.value.boughtAt = new Date()

      // Add to completed items in localStorage
      const completedItems = JSON.parse(localStorage.getItem('completedItems') || '[]')
      completedItems.push(itemToConfirm.value)
      localStorage.setItem('completedItems', JSON.stringify(completedItems))

      // Remove from current items
      items.value = items.value.filter(item => item.id !== itemToConfirm.value.id)

      // Close modal and clear temporary state
      tempCheckedItemId.value = null
      closePurchaseConfirmation()
    }
    
    const newItem = ref({
      name: '',
      price: '',
      quantity: 1
    })

    const handleItemTap = (item) => {
      // Add a small delay to prevent accidental double taps
      setTimeout(() => {
        selectedItem.value = item;
        editModalOpen.value = true;
      }, 50);
    };
    
    const groupedBulkItems = computed(() => {
      const groups = {}
      items.value
        .filter(item => item.source === 'bulk')
        .forEach(item => {
          if (!groups[item.groupId]) {
            groups[item.groupId] = {
              id: item.groupId,
              title: item.groupTitle,
              createdAt: item.addedAt,
              items: []
            }
          }
          groups[item.groupId].items.push({
            ...item,
            checked: false
          })
        })
      return Object.values(groups)
    })
    
    const formErrors = ref({
      name: '',
      price: '',
      quantity: ''
    })

    // Load data from localStorage
    onMounted(() => {
      const savedItems = localStorage.getItem('shoppingItems')
      if (savedItems) {
        items.value = JSON.parse(savedItems)
      }
      
      const savedDeletedItems = localStorage.getItem('deletedItems')
      if (savedDeletedItems) {
        deletedItems.value = JSON.parse(savedDeletedItems)
      } else {
        // Initialize as empty array if not exists
        deletedItems.value = []
        localStorage.setItem('deletedItems', JSON.stringify([]))
      }
    })

    // Watch for changes and save to localStorage
    watch(items, (newItems) => {
      localStorage.setItem('shoppingItems', JSON.stringify(newItems))
    }, { deep: true })

    watch(deletedItems, (newValue) => {
      localStorage.setItem('deletedItems', JSON.stringify(newValue))
    })

    const validateForm = () => {
      let isValid = true
      formErrors.value = {
        name: '',
        price: '',
        quantity: ''
      }

      if (!newItem.value.name.trim()) {
        formErrors.value.name = 'Please enter an item name'
        isValid = false
      }
      if (newItem.value.price === '' || newItem.value.price === null) {
        formErrors.value.price = 'Please enter a price'
        isValid = false
      } else if (newItem.value.price < 0) {
        formErrors.value.price = 'Price cannot be negative'
        isValid = false
      }
      if (!newItem.value.quantity || newItem.value.quantity < 1) {
        formErrors.value.quantity = 'Quantity must be at least 1'
        isValid = false
      }
      return isValid
    }

    // Computed properties for item filtering
    const individualItems = computed(() => {
      return items.value.filter(item => item.source === 'individual' || !item.source)
    })

    const filterAndSortItems = (itemsList) => {
      let filtered = itemsList.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
        return matchesSearch
      })
      
      return filtered.sort((a, b) => {
        switch (currentSort.value) {
          case 'nameAsc':
            return a.name.localeCompare(b.name)
          case 'nameDesc':
            return b.name.localeCompare(a.name)
          case 'priceLow':
            return a.price - b.price
          case 'priceHigh':
            return b.price - a.price
          default:
            return 0
        }
      })
    }
    
    const filteredAndSortedIndividualItems = computed(() => {
      return filterAndSortItems(individualItems.value)
    })

    const totalCost = computed(() => {
      return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    })

    const totalItems = computed(() => items.value.length)

    // Methods
    const addNewItem = () => {
      if (!validateForm()) {
        return
      }

      items.value.push({
        id: Date.now(),
        name: newItem.value.name.trim(),
        price: parseFloat(newItem.value.price) || 0,
        quantity: parseInt(newItem.value.quantity) || 1,
        isEditing: false,
        inCart: false,
        addedAt: new Date(),
        boughtAt: null,
        source: 'individual'
      })

      newItem.value = {
        name: '',
        price: '',
        quantity: 1
      }
      formErrors.value = {
        name: '',
        price: '',
        quantity: ''
      }
    }
   
    const handleBulkAdd = (newItems, title) => {
      const groupId = Date.now().toString()
      
      const itemsWithGroup = newItems.map(item => ({
        ...item,
        id: Date.now() + Math.random(),
        source: 'bulk',
        groupId,
        groupTitle: title, // Use the custom title
        addedAt: new Date(),
        inCart: false,
        checked: false
      }))
      
      items.value.push(...itemsWithGroup)
    }
    
    // Group operations
    const markGroupAsBought = (group) => {
      selectedGroup.value = group
      showGroupPurchaseModal.value = true
    }

    const confirmGroupPurchase = () => {
      if (!selectedGroup.value) return
      
      const groupItems = items.value.filter(item => item.groupId === selectedGroup.value.id)
      const now = new Date()
      
      groupItems.forEach(item => {
        item.inCart = true
        item.boughtAt = now
      })
      
      // Add to completed items
      const completedItems = JSON.parse(localStorage.getItem('completedItems') || '[]')
      completedItems.push(...groupItems)
      localStorage.setItem('completedItems', JSON.stringify(completedItems))
      
      // Remove from current items
      items.value = items.value.filter(item => item.groupId !== selectedGroup.value.id)
      
      showGroupPurchaseModal.value = false
      selectedGroup.value = null
    }

    // Methods for soft delete with confirmation
    const openDeleteGroupConfirmation = (group) => {
      groupToDelete.value = group
      showDeleteGroupConfirmation.value = true
    }

    const confirmDeleteGroup = () => {
      if (!groupToDelete.value) return
      
      // Permanently remove items from current items array
      items.value = items.value.filter(item => item.groupId !== groupToDelete.value.id)
      
      // Close confirmation modal
      showDeleteGroupConfirmation.value = false
      groupToDelete.value = null
    }

    const formatDate = (date) => {
      if (!date) return ''
      return new Date(date).toLocaleDateString()
    }

    const updateItem = (item) => {
      const index = items.value.findIndex(i => i.id === item.id)
      if (index !== -1) {
        items.value[index] = { ...item }
      }
    }

    const deleteItem = (item) => {
      const index = items.value.findIndex(i => i.id === item.id)
      if (index !== -1) {
        // Create a copy of the item with deletedAt timestamp
        const itemToDelete = {
          ...items.value[index],
          deletedAt: new Date().toISOString() // Ensure consistent date format
        }
        
        // Remove from items array
        items.value.splice(index, 1)
        
        // Add to deletedItems array
        deletedItems.value.push(itemToDelete)
        lastDeletedItem.value = itemToDelete
        
        // Update localStorage immediately
        localStorage.setItem('deletedItems', JSON.stringify(deletedItems.value))
        
        // Show undo notification
        showUndoDelete.value = true
        setTimeout(() => {
          showUndoDelete.value = false
        }, 4000)
      }
    }

    const undoDelete = () => {
      if (lastDeletedItem.value) {
        const { deletedAt, ...itemToRestore } = lastDeletedItem.value
        
        // Add back to items array
        items.value.push(itemToRestore)
        
        // Remove from deletedItems array
        deletedItems.value = deletedItems.value.filter(
          item => item.id !== lastDeletedItem.value.id
        )
        
        // Update localStorage immediately
        localStorage.setItem('deletedItems', JSON.stringify(deletedItems.value))
        
        // Reset state
        lastDeletedItem.value = null
        showUndoDelete.value = false
      }
    }

    const openEditModal = (item) => {
      selectedItem.value = item
      editModalOpen.value = true
    }

    const closeEditModal = () => {
      selectedItem.value = null
      editModalOpen.value = false
    }

    const handleEditSave = (updatedItem) => {
      const index = items.value.findIndex(item => item.id === updatedItem.id)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
    }
    
    const filteredGroupedBulkItems = computed(() => {
      return groupedBulkItems.value.map(group => {
        return {
          ...group,
          filteredItems: group.items.filter(item => 
            item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
          ).sort((a, b) => {
            switch (currentSort.value) {
              case 'nameAsc':
                return a.name.localeCompare(b.name)
              case 'nameDesc':
                return b.name.localeCompare(a.name)
              case 'priceLow':
                return a.price - b.price
              case 'priceHigh':
                return b.price - a.price
              default:
                return 0
            }
          })
        }
      }).filter(group => group.filteredItems.length > 0)
    })

    return {
      items,
      newItem,
      searchTerm,
      currentFilter,
      currentSort,
      formErrors,
      showIndividualItems,
      showBulkItems,
      individualItems,
      filteredAndSortedIndividualItems,
      filteredGroupedBulkItems,
      totalCost,
      totalItems,
      showUndoDelete,
      editModalOpen,
      selectedItem,
      showGroupPurchaseModal,
      showPurchaseConfirmation,
      itemToConfirm,
      tempCheckedItemId,
      showDeleteGroupConfirmation,
      
      // Methods
      addNewItem,
      validateForm,
      deleteItem,
      undoDelete,
      updateItem,
      formatDate,
      openEditModal,
      closeEditModal,
      handleEditSave,
      handleBulkAdd,
      markGroupAsBought,
      confirmGroupPurchase,
      openDeleteGroupConfirmation,
      confirmDeleteGroup,
      openPurchaseConfirmation,
      closePurchaseConfirmation,
      confirmPurchase,
      handleItemTap
    }
  }
}
</script>