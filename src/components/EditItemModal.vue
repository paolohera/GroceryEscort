<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-lg w-full max-w-md">
        <!-- Modal Header -->
        <div class="p-5 border-b border-[#F4F1DE]">
          <h2 class="text-xl font-bold text-[#2C5F2D]">Edit Item: {{ item.name }}</h2>
        </div>
  
        <!-- Modal Body -->
        <div class="p-5">
          <form @submit.prevent="saveChanges" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#6F4E37] mb-1">Price (₱)</label>
              <input 
                v-model.number="editedPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full p-3 rounded-xl border border-[#A1C181] focus:ring-2 focus:ring-[#2C5F2D]"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-[#6F4E37] mb-1">Quantity</label>
              <input 
                v-model.number="editedQuantity"
                type="number"
                min="1"
                placeholder="1"
                class="w-full p-3 rounded-xl border border-[#A1C181] focus:ring-2 focus:ring-[#2C5F2D]"
              />
            </div>
          </form>
        </div>
  
        <!-- Modal Footer -->
        <div class="p-5 border-t border-[#F4F1DE] flex justify-end gap-3">
          <button
            @click="close"
            class="px-4 py-2 text-[#6F4E37] hover:text-[#2C5F2D] transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveChanges"
            class="px-4 py-2 bg-[#2C5F2D] hover:bg-[#214823] text-white rounded-xl transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EditItemModal',
    props: {
      isOpen: {
        type: Boolean,
        required: true
      },
      item: {
        type: Object,
        required: true
      },
      onSave: {
        type: Function,
        required: true
      },
      onClose: {
        type: Function,
        required: true
      }
    },
    data() {
      return {
        editedPrice: 0,
        editedQuantity: 1
      }
    },
    watch: {
      isOpen(newValue) {
        if (newValue) {
          this.editedPrice = this.item.price
          this.editedQuantity = this.item.quantity
        }
      }
    },
    methods: {
      saveChanges() {
        // Validate inputs
        const price = this.editedPrice >= 0 ? this.editedPrice : 0
        const quantity = this.editedQuantity >= 1 ? this.editedQuantity : 1
  
        this.onSave({
          ...this.item,
          price,
          quantity
        })
        this.close()
      },
      close() {
        this.onClose()
      }
    }
  }
  </script>