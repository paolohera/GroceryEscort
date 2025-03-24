<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-md animate-fade-in">
      <!-- Logo Section -->
      <div class="p-8 text-center">
        <div class="mb-6">
          <div class="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div class="w-24 h-24 relative">
              <img 
                src="/src/assets/Glogo.png" 
                alt="Grocery Escort Logo"
                class="w-full h-full object-contain rounded-full"
              >
            </div>
          </div>
          <h1 class="text-3xl font-bold text-[#2C5F2D] mb-2">Grocery Escort</h1>
          <p class="text-[#6F4E37]">Your smart shopping companion</p>
        </div>

        <!-- Features List -->
        <div class="space-y-4 mb-8 text-left">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 flex items-center justify-center bg-[#2C5F2D] rounded-full text-white shrink-0">
              ✓
            </div>
            <div>
              <h3 class="font-medium text-[#2C5F2D]">Easy Item Management</h3>
              <p class="text-sm text-[#6F4E37]">Add, edit, and organize your shopping items effortlessly</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 flex items-center justify-center bg-[#2C5F2D] rounded-full text-white shrink-0">
              ✓
            </div>
            <div>
              <h3 class="font-medium text-[#2C5F2D]">Track Your Expenses</h3>
              <p class="text-sm text-[#6F4E37]">Monitor your Weekly, Monthly and Yearly and  expenses</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 flex items-center justify-center bg-[#2C5F2D] rounded-full text-white shrink-0">
              ✓
            </div>
            <div>
              <h3 class="font-medium text-[#2C5F2D]">Quick Bulk Add</h3>
              <p class="text-sm text-[#6F4E37]">Add multiple items at once with our smart suggestions</p>
            </div>
            
          </div>
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 flex items-center justify-center bg-[#2C5F2D] rounded-full text-white shrink-0">
              ✓
            </div>
            <div>
              <h3 class="font-medium text-[#2C5F2D]">And More...</h3>
              
            </div>
            
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button 
            @click="getStarted"
            class="w-full py-3 px-6 bg-[#2C5F2D] hover:bg-[#214823] text-white rounded-xl transition-colors"
          >
            Get Started
          </button>
          <button
            v-if="showDontShowAgain"
            @click="dontShowAgain"
            class="w-full py-3 px-6 bg-[#F4F1DE] hover:bg-[#E9C46A] text-[#6F4E37] rounded-xl transition-colors"
          >
            Don't show again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IntroModal',
  props: {
    showDontShowAgain: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isVisible: true
    }
  },
  mounted() {
    // Check if user has chosen to not show the intro
    const dontShow = localStorage.getItem('dontShowIntro')
    if (dontShow === 'true') {
      this.isVisible = false
    }
  },
  methods: {
    getStarted() {
      this.isVisible = false
      this.$emit('close')
    },
    dontShowAgain() {
      localStorage.setItem('dontShowIntro', 'true')
      this.isVisible = false
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
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
</style>