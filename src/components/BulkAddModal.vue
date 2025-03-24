<!-- BulkAddModal.vue -->
<template>
  <div>
    <button  type="button"
      @click="openModal" 
      :class="buttonClass"
    >
      Bulk Add
    </button>

    <div v-if="isOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeModal"
    >
      <div class="bg-white rounded-2xl p-6 max-w-lg w-full mx-4" @click.stop>
        <!-- Title Input -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-[#6F4E37] mb-1">List Title</label>
          <input 
            v-model="title"
            placeholder="Enter a title for your list"
            class="w-full p-3 rounded-xl border border-[#A1C181] focus:ring-2 focus:ring-[#2C5F2D] focus:border-transparent"
          />
        </div>

        <!-- Quick Add Items Section -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-[#6F4E37] mb-1">Quick Add Items</label>
          <div class="flex gap-2">
            <input 
              v-model="newItemName"
              @keyup.enter="addItem"
              placeholder="Enter item name"
              class="flex-1 p-3 rounded-xl border border-[#A1C181] focus:ring-2 focus:ring-[#2C5F2D] focus:border-transparent"
            />
            <button 
              @click="addItem"
              class="px-4 py-2 bg-[#2C5F2D] text-white rounded-xl hover:bg-[#214823] transition-colors"
              :disabled="!newItemName.trim()"
            >
              Add
            </button>
          </div>
          <p class="text-sm text-[#6F4E37] mt-1">
            Add items quickly now, set prices and quantities later
          </p>
        </div>

        <!-- Items List -->
        <div class="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
          <div v-for="item in items" :key="item.id" 
            class="bg-[#F4F1DE] p-4 rounded-xl"
          >
            <div class="flex items-center gap-3">
              <div class="flex-1">
                <div class="font-medium">{{ item.name }}</div>
              </div>
              <button 
                @click="removeItem(item)"
                class="text-[#C34A36] hover:text-[#A33D2D]"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button 
            @click="submitItems"
            :disabled="!canSubmit"
            class="flex-1 px-4 py-2 bg-[#2C5F2D] text-white rounded-xl hover:bg-[#214823] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to List
          </button>
          <button 
            @click="closeModal"
            class="flex-1 px-4 py-2 bg-[#6F4E37] text-white rounded-xl hover:bg-[#5D4230] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BulkAddModal',
  
  props: {
    buttonClass: {
      type: String,
      required: true
    },
    onAddItems: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      isOpen: false,
      items: [],
      newItemName: '',
      title: ''
    }
  },

  computed: {
    canSubmit() {
      return this.items.length > 0 && this.title.trim() !== '';
    }
  },

  methods: {
    openModal() {
      this.isOpen = true
      this.items = []
      this.title = ''
      this.newItemName = ''
    },

    closeModal() {
      this.isOpen = false
    },

    addItem() {
      if (this.newItemName.trim()) {
        this.items.push({
          id: Date.now() + Math.random(),
          name: this.newItemName.trim(),
          price: 0,
          quantity: 1
        })
        this.newItemName = ''
      }
    },

    removeItem(itemToRemove) {
      this.items = this.items.filter(item => item.id !== itemToRemove.id)
    },

    submitItems() {
      if (this.canSubmit) {
        this.onAddItems(this.items, this.title)
        this.closeModal()
      }
    }
  }
}
</script>