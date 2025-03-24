<template>
  <nav class="bg-white shadow-sm mb-2 h-[80px]">
    <div class="max-w-lg mx-auto px-4 flex items-center justify-between h-full">
      <!-- Logo and Brand -->
      <div class="flex items-center gap-2">
        <span class="text-2xl">🛒</span>
        <span class="text-xl font-bold text-[#2C5F2D]">Grocery Escort</span>
      </div>

      <!-- Menu Button -->
      <div class="relative">
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          ☰
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="isMenuOpen"
          class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50"
        >
        <router-link
            to="/"
            class="block px-4 py-2 text-[#6F4E37] hover:bg-[#F4F1DE] transition-colors"
            @click="isMenuOpen = false"
          >
            📝 Home
          </router-link>
         
          
          <router-link
            to="/history"
            class="block px-4 py-2 text-[#6F4E37] hover:bg-[#F4F1DE] transition-colors"
            @click="isMenuOpen = false"
          >
            📋 Shopping History
          </router-link>
          <router-link
            to="/expenses"
            class="block px-4 py-2 text-[#6F4E37] hover:bg-[#F4F1DE] transition-colors"
            @click="isMenuOpen = false"
          >
            💰 Expense Tracking
          </router-link>
          <router-link
            to="/calculator"
            class="block px-4 py-2 text-[#6F4E37] hover:bg-[#F4F1DE] transition-colors"
            @click="isMenuOpen = false"
          >
          📅 Calculator
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      isMenuOpen: false,
    };
  },
  mounted() {
    // Close menu when clicking outside
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    handleClickOutside(event) {
      if (!event.target.closest(".relative")) {
        this.isMenuOpen = false;
      }
    },
  },
};
</script>