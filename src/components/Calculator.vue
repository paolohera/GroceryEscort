<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#faf7e6] p-4 mt-[-20px]">
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-[340px] p-6 border border-gray-100">
      <!-- Display -->
      <div class="bg-[#faf7e6] rounded-2xl p-6 mb-5 shadow-inner">
        <div class="text-right">
          <div class="text-sm text-[#6F4E37] opacity-75 h-5 mb-1">{{ expression || '' }}</div>
          <div class="text-5xl font-semibold text-[#2C5F2D] transition-all">{{ current || '0' }}</div>
        </div>
      </div>

      <!-- Calculator Grid -->
      <div class="grid grid-cols-4 gap-3">
        <!-- Top Row -->
        <button 
          @click="clear" 
          class="col-span-2 h-16 bg-[#faf7e6] text-[#6F4E37] rounded-2xl hover:bg-[#f5f0d8] font-medium shadow-sm hover:shadow transition-all active:scale-95"
        >
          Clear
        </button>
        <button 
          @click="del" 
          class="h-16 bg-[#faf7e6] text-[#6F4E37] rounded-2xl hover:bg-[#f5f0d8] font-medium shadow-sm hover:shadow transition-all active:scale-95"
        >
          ←
        </button>
        <button 
          @click="append('+')" 
          class="h-16 bg-[#2C5F2D] text-white rounded-2xl hover:bg-[#214823] font-medium shadow-sm hover:shadow transition-all active:scale-95"
        >
          +
        </button>

        <!-- Numbers and Operators -->
        <button 
          @click="append('7')" 
          class="h-16 bg-white text-[#6F4E37] rounded-2xl hover:bg-[#faf7e6] font-medium border border-gray-100 shadow-sm hover:shadow transition-all active:scale-95"
        >
          7
        </button>
        <button 
          @click="append('8')" 
          class="h-16 bg-white text-[#6F4E37] rounded-2xl hover:bg-[#faf7e6] font-medium border border-gray-100 shadow-sm hover:shadow transition-all active:scale-95"
        >
          8
        </button>
        <button 
          @click="append('9')" 
          class="h-16 bg-white text-[#6F4E37] rounded-2xl hover:bg-[#faf7e6] font-medium border border-gray-100 shadow-sm hover:shadow transition-all active:scale-95"
        >
          9
        </button>
        <button 
          @click="append('-')" 
          class="h-16 bg-[#2C5F2D] text-white rounded-2xl hover:bg-[#214823] font-medium shadow-sm hover:shadow transition-all active:scale-95"
        >
          −
        </button>

        <button 
          @click="append('4')" 
          class="h-16 bg-white text-[#6F4E37] rounded-2xl hover:bg-[#faf7e6] font-medium border border-gray-100 shadow-sm hover:shadow transition-all active:scale-95"
        >
          4
        </button>
        <button 
          @click="append('5')" 
          class="h-16 bg-white text-[#6F4E37] rounded-2xl hover:bg-[#faf7e6] font-medium border border-gray-100 shadow-sm hover:shadow transition-all active:scale-95"
        >
          5
        </button>
        <button 
          @click="append('6')" 
          class="h-16 bg-white text-[#6F4E37] rounded-2xl hover:bg-[#faf7e6] font-medium border border-gray-100 shadow-sm hover:shadow transition-all active:scale-95"
        >
          6
        </button>
        <button 
          @click="append('*')" 
          class="h-16 bg-[#2C5F2D] text-white rounded-2xl hover:bg-[#214823] font-medium shadow-sm hover:shadow transition-all active:scale-95"
        >
          ×
        </button>

        <button 
          @click="append('1')" 
          class="h-16 bg-white text-[#6F4E37] rounded-2xl hover:bg-[#faf7e6] font-medium border border-gray-100 shadow-sm hover:shadow transition-all active:scale-95"
        >
          1
        </button>
        <button 
          @click="append('2')" 
          class="h-16 bg-white text-[#6F4E37] rounded-2xl hover:bg-[#faf7e6] font-medium border border-gray-100 shadow-sm hover:shadow transition-all active:scale-95"
        >
          2
        </button>
        <button 
          @click="append('3')" 
          class="h-16 bg-white text-[#6F4E37] rounded-2xl hover:bg-[#faf7e6] font-medium border border-gray-100 shadow-sm hover:shadow transition-all active:scale-95"
        >
          3
        </button>
        <button 
          @click="append('/')" 
          class="h-16 bg-[#2C5F2D] text-white rounded-2xl hover:bg-[#214823] font-medium shadow-sm hover:shadow transition-all active:scale-95"
        >
          ÷
        </button>

        <button 
          @click="append('0')" 
          class="h-16 bg-white text-[#6F4E37] rounded-2xl hover:bg-[#faf7e6] font-medium border border-gray-100 shadow-sm hover:shadow transition-all active:scale-95"
        >
          0
        </button>
        <button 
          @click="append('.')" 
          class="h-16 bg-white text-[#6F4E37] rounded-2xl hover:bg-[#faf7e6] font-medium border border-gray-100 shadow-sm hover:shadow transition-all active:scale-95"
        >
          .
        </button>
        <button 
          @click="calculate" 
          class="h-16 col-span-2 bg-[#2C5F2D] text-white rounded-2xl hover:bg-[#214823] font-medium shadow-sm hover:shadow transition-all active:scale-95"
        >
          =
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calculator',
  data() {
    return {
      current: '',
      expression: '',
      lastOperation: false
    }
  },
  methods: {
    append(value) {
      if (this.lastOperation) {
        this.current = ''
        this.lastOperation = false
      }
      
      if (['+', '-', '*', '/'].includes(value)) {
        this.lastOperation = true
        if (this.current) {
          this.expression = this.current + ' ' + value + ' '
        }
        return
      }
      
      if (value === '.' && this.current.includes('.')) return
      if (this.current === '0' && value !== '.') {
        this.current = value
      } else {
        this.current += value
      }
    },
    clear() {
      this.current = ''
      this.expression = ''
      this.lastOperation = false
    },
    del() {
      this.current = this.current.slice(0, -1)
    },
    calculate() {
      try {
        if (!this.expression || !this.current) return
        
        // Replace eval with Function constructor
        const calculateExpression = new Function('return ' + this.expression + this.current);
        const result = calculateExpression();
        
        this.expression = ''
        this.current = Number(result).toLocaleString('en-US', {
          maximumFractionDigits: 8
        })
        this.lastOperation = true
      } catch (e) {
        this.current = 'Error'
        this.lastOperation = true
      }
    }
  }
}
</script>