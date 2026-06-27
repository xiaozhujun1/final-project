// pages/stats/stats.js
Page({
  data: {
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
    categoryStats: [],
    priorityStats: []
  },

  onLoad() {
    this.loadStats()
  },

  onShow() {
    this.loadStats()
  },

  onPullDownRefresh() {
    this.loadStats()
    wx.stopPullDownRefresh()
  },

  loadStats() {
    const todos = wx.getStorageSync('todos') || []
    
    const total = todos.length
    const completed = todos.filter(t => t.completed).length
    const pending = total - completed
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    // 分类统计
    const categories = ['工作', '生活', '学习', '其他']
    const categoryStats = categories.map(cat => {
      const catTodos = todos.filter(t => t.category === cat)
      const catCompleted = catTodos.filter(t => t.completed).length
      return {
        name: cat,
        total: catTodos.length,
        completed: catCompleted,
        rate: catTodos.length > 0 ? Math.round((catCompleted / catTodos.length) * 100) : 0
      }
    }).filter(s => s.total > 0)

    // 优先级统计
    const priorities = [
      { name: '高', key: 'high' },
      { name: '中', key: 'mid' },
      { name: '低', key: 'low' }
    ]
    const priorityStats = priorities.map(pri => {
      const priTodos = todos.filter(t => t.priority === pri.name)
      const priCompleted = priTodos.filter(t => t.completed).length
      return {
        name: pri.name,
        nameKey: pri.key,
        total: priTodos.length,
        completed: priCompleted
      }
    }).filter(s => s.total > 0)

    this.setData({
      total,
      completed,
      pending,
      completionRate,
      categoryStats,
      priorityStats
    })
  },

  goBack() {
    wx.navigateBack()
  }
})
