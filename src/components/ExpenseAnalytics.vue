
<template>
  <div class="max-w-4xl mx-auto p-4">
    <!-- Main Dashboard Header -->
    <div class="mb-6 text-center">
      
      <p class="text-[#6F4E37]">Track, analyze, and manage your spending</p>
    </div>
    
    <!-- Summary Cards with improved styling -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="bg-white rounded-2xl shadow-sm p-5 transition-all hover:shadow-md">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#2C5F2D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-sm text-[#6F4E37]">Weekly Expenses</div>
            <div class="text-2xl font-bold text-[#2C5F2D]">₱{{ weeklyTotal.toFixed(2) }}</div>
            <div v-if="budgets[0]" class="mt-2 text-xs">
              {{ (weeklyTotal / budgets[0].limit * 100).toFixed(0) }}% of budget
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm p-5 transition-all hover:shadow-md">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#2C5F2D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div class="text-sm text-[#6F4E37]">Monthly Total</div>
            <div class="text-2xl font-bold text-[#2C5F2D]">₱{{ monthlyTotal.toFixed(2) }}</div>
            <div v-if="budgets[1]" class="mt-2 text-xs">
              {{ (monthlyTotal / budgets[1].limit * 100).toFixed(0) }}% of budget
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm p-5 transition-all hover:shadow-md">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#2C5F2D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <div class="text-sm text-[#6F4E37]">Yearly Total</div>
            <div class="text-2xl font-bold text-[#2C5F2D]">₱{{ yearlyTotal.toFixed(2) }}</div>
            <div v-if="budgets[2]" class="mt-2 text-xs">
              {{ (yearlyTotal / budgets[2].limit * 100).toFixed(0) }}% of budget
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget Progress & Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Budget Progress Bars -->
      <div class="bg-white rounded-2xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-[#2C5F2D] mb-4">Budget Status</h2>
        <div class="space-y-4">
          <div v-for="budget in budgets" :key="budget.category">
            <div class="flex justify-between mb-1">
              <span class="font-medium text-sm">{{ budget.category }}</span>
              <span class="text-sm" :class="{ 'text-red-500': isOverBudget(budget.spent, budget.limit) }">
                ₱{{ budget.spent.toFixed(2) }} / ₱{{ budget.limit.toFixed(2) }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="h-2.5 rounded-full" 
                   :class="getBudgetBarClass(budget.spent, budget.limit)"
                   :style="{ width: calculatePercentage(budget.spent, budget.limit) + '%' }"></div>
            </div>
          </div>
        </div>
        <button 
          @click="showBudgetModal = true"
          class="mt-4 w-full px-4 py-2 bg-[#2C5F2D] text-white rounded-lg hover:bg-[#1A4D1A] transition-colors">
          Update Budget Limits
        </button>
      </div>
      
      <!-- Expense Chart -->
      <div class="bg-white rounded-2xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-[#2C5F2D] mb-4">Expense Trend</h2>
        <div v-if="chartData.labels.length > 0" class="h-64">
          <!-- Simplified chart visualization using DIVs instead of Canvas -->
          <div class="flex h-full items-end space-x-1">
            <div 
              v-for="(value, index) in chartData.datasets[0].data" 
              :key="index" 
              class="bg-[#2C5F2D] bg-opacity-70 rounded-t-md flex-1"
              :style="{ height: `${(value / Math.max(...chartData.datasets[0].data) * 100)}%` }">
            </div>
          </div>
          <div class="flex text-xs text-[#6F4E37] mt-2 justify-between">
            <div v-for="(label, index) in chartData.labels" :key="index" class="text-center truncate" style="max-width: 50px">
              {{ label }}
            </div>
          </div>
          <div class="flex justify-between mt-2">
            <div class="text-xs text-[#6F4E37]">
              Daily Expenses (Last 7 days)
            </div>
            <div class="text-xs font-medium text-[#2C5F2D]">
              Max: ₱{{ Math.max(...chartData.datasets[0].data).toFixed(2) }}
            </div>
          </div>
        </div>
        <div v-else class="h-64 flex items-center justify-center">
          <div class="text-center text-[#6F4E37]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>No expense data available</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white rounded-2xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-[#2C5F2D]">Recent Activity</h2>
        <button class="text-sm text-[#2C5F2D] hover:underline">View All</button>
      </div>
      
      <div v-if="recentTransactions.length > 0" class="space-y-4">
        <div v-for="transaction in recentTransactions" 
             :key="transaction.id" 
             class="flex justify-between items-center border-b border-gray-100 pb-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-50 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2C5F2D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <div class="font-medium">{{ transaction.name }}</div>
              <div class="text-xs text-[#6F4E37]">{{ formatDate(transaction.boughtAt) }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-[#2C5F2D] font-medium">₱{{ (transaction.price * transaction.quantity).toFixed(2) }}</div>
            <div class="text-xs text-[#6F4E37]">{{ transaction.quantity }} × ₱{{ transaction.price.toFixed(2) }}</div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-[#6F4E37] text-center py-8 bg-gray-50 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>No recent transactions</p>
        <button class="mt-2 text-sm text-[#2C5F2D] hover:underline">Add Your First Expense</button>
      </div>
    </div>
    
    <!-- Budget Edit Modal -->
    <div v-if="showBudgetModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-bold mb-4 text-[#2C5F2D]">Update Budget Limits</h3>
        <div class="space-y-4">
          <div v-for="(budget, index) in editableBudgets" :key="index">
            <label class="block text-sm font-medium text-gray-700">{{ budget.category }}</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">₱</span>
              </div>
              <input type="number" 
                     v-model.number="editableBudgets[index].limit" 
                     class="focus:ring-[#2C5F2D] focus:border-[#2C5F2D] block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                     placeholder="0.00" />
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="showBudgetModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button @click="saveBudgets" class="px-4 py-2 bg-[#2C5F2D] text-white rounded-md text-sm font-medium hover:bg-[#1A4D1A]">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'

export default {
  name: 'ExpenseAnalytics',
  
  setup() {
    const weeklyTotal = ref(0)
    const monthlyTotal = ref(0)
    const yearlyTotal = ref(0)
    const showBudgetModal = ref(false)
    
    // Load saved budgets from localStorage or use defaults
    const loadBudgets = () => {
      const savedBudgets = localStorage.getItem('budgets')
      if (savedBudgets) {
        return JSON.parse(savedBudgets)
      }
      return [
        {
          category: 'Weekly Budget',
          spent: 0,
          limit: 500,
        },
        {
          category: 'Monthly Budget',
          spent: 0,
          limit: 2000,
        },
        {
          category: 'Yearly Budget',
          spent: 0,
          limit: 24000,
        }
      ]
    }

    const budgets = ref(loadBudgets())
    const editableBudgets = ref([])

    // Initialize editable budgets when opening modal
    const initializeEditableBudgets = () => {
      editableBudgets.value = budgets.value.map(budget => ({
        ...budget,
        limit: budget.limit
      }))
    }
    
    // Save budgets to localStorage
    const saveBudgets = () => {
      budgets.value = editableBudgets.value.map(budget => ({
        ...budget
      }))
      localStorage.setItem('budgets', JSON.stringify(budgets.value))
      showBudgetModal.value = false
      calculateTotals() // Update progress bars
    }

    // Watch for modal opening to initialize editable budgets
    watch(showBudgetModal, (newValue) => {
      if (newValue) {
        initializeEditableBudgets()
      }
    })

    const recentTransactions = computed(() => {
      const completedItems = JSON.parse(localStorage.getItem('completedItems') || '[]')
      return completedItems
        .sort((a, b) => new Date(b.boughtAt) - new Date(a.boughtAt))
        .slice(0, 5)
    })
    
    // All transactions for the chart
    const allTransactions = computed(() => {
      const completedItems = JSON.parse(localStorage.getItem('completedItems') || '[]')
      return completedItems.sort((a, b) => new Date(a.boughtAt) - new Date(b.boughtAt))
    })
    
    // Chart data computed property
    const chartData = computed(() => {
      // Group transactions by day and calculate daily totals
      const groupedByDay = allTransactions.value.reduce((acc, transaction) => {
        const date = new Date(transaction.boughtAt).toLocaleDateString()
        if (!acc[date]) {
          acc[date] = 0
        }
        acc[date] += transaction.price * transaction.quantity
        return acc
      }, {})
      
      // Sort by date and get the last 7 days
      const sortedDates = Object.keys(groupedByDay).sort((a, b) => new Date(a) - new Date(b))
      const last7Days = sortedDates.slice(-7)
      
      return {
        labels: last7Days.map(date => {
          const d = new Date(date)
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }),
        datasets: [
          {
            label: 'Daily Expenses',
            data: last7Days.map(date => groupedByDay[date]),
            borderColor: '#2C5F2D',
            backgroundColor: 'rgba(44, 95, 45, 0.2)'
          }
        ]
      }
    })

    const calculateTotals = () => {
      const completedItems = JSON.parse(localStorage.getItem('completedItems') || '[]')
      const now = new Date()
      
      // Calculate start of week (Sunday)
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      startOfWeek.setHours(0, 0, 0, 0)
      
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const thisYear = new Date(now.getFullYear(), 0, 1)

      weeklyTotal.value = completedItems
        .filter(item => new Date(item.boughtAt) >= startOfWeek)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0)

      monthlyTotal.value = completedItems
        .filter(item => new Date(item.boughtAt) >= thisMonth)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0)

      yearlyTotal.value = completedItems
        .filter(item => new Date(item.boughtAt) >= thisYear)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0)

      // Update budget spent values
      budgets.value = budgets.value.map(budget => {
        if (budget.category === 'Weekly Budget') {
          return { ...budget, spent: weeklyTotal.value }
        }
        if (budget.category === 'Monthly Budget') {
          return { ...budget, spent: monthlyTotal.value }
        }
        if (budget.category === 'Yearly Budget') {
          return { ...budget, spent: yearlyTotal.value }
        }
        return budget
      })
    }

    const calculatePercentage = (spent, limit) => {
      return Math.min((spent / limit) * 100, 100)
    }

    const getBudgetBarClass = (spent, limit) => {
      const percentage = (spent / limit) * 100
      if (percentage >= 90) return 'bg-red-500'
      if (percentage >= 75) return 'bg-yellow-500'
      return 'bg-[#2C5F2D]'
    }

    const isOverBudget = (spent, limit) => {
      return spent > limit
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Storage event listener
    const handleStorageChange = (event) => {
      if (event.key === 'completedItems' || event.key === 'budgets') {
        calculateTotals()
      }
    }

    onMounted(() => {
      calculateTotals()
      window.addEventListener('storage', handleStorageChange)
    })

    return {
      weeklyTotal,
      monthlyTotal,
      yearlyTotal,
      recentTransactions,
      chartData,
      formatDate,
      budgets,
      calculatePercentage,
      getBudgetBarClass,
      isOverBudget,
      showBudgetModal,
      editableBudgets,
      saveBudgets
    }
  }
}
</script>