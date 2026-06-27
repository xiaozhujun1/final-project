// pages/index/index.js
Page({
  data: {
    todos: [],
    filteredTodos: [],
    completedCount: 0,
    filterIndex: 0,
    sortIndex: 0,
    today: new Date().toISOString().split('T')[0],
    categories: ['全部', '待完成', '已完成'],
    sortOptions: ['按创建时间', '按优先级', '按截止日期'],
    currentTodoIndex: -1
  },

  onLoad() {
    this.loadTodos()
  },

  onShow() {
    this.loadTodos()
  },

  onPullDownRefresh() {
    this.loadTodos()
    wx.stopPullDownRefresh()
  },

  loadTodos() {
    const todos = wx.getStorageSync('todos') || []
    const completedCount = todos.filter(t => t.completed).length
    const filteredTodos = this.getFilteredTodos(todos)
    this.setData({ todos, completedCount, filteredTodos })
  },

  getFilteredTodos(todos) {
    let filtered
    const { filterIndex, sortIndex } = this.data
    
    if (filterIndex === 0) filtered = [...todos]
    else if (filterIndex === 1) filtered = todos.filter(t => !t.completed)
    else filtered = todos.filter(t => t.completed)

    // 排序
    if (sortIndex === 0) {
      filtered.sort((a, b) => b.createTime - a.createTime)
    } else if (sortIndex === 1) {
      const priorityMap = { '高': 0, '中': 1, '低': 2 }
      filtered.sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority])
    } else {
      // 按截止日期排序，有截止日期的排前面
      filtered.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return a.deadline.localeCompare(b.deadline)
      })
    }
    
    return filtered
  },

  isOverdue(todo) {
    if (!todo.hasDeadline || !todo.deadline || todo.completed) return false
    const today = new Date().toISOString().split('T')[0]
    return todo.deadline < today
  },

  onFilterTap(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ filterIndex: index })
    this.loadTodos()
  },

  onSortChange(e) {
    const index = e.detail.value
    this.setData({ sortIndex: index })
    this.loadTodos()
  },

  onTodoTap(e) {
    const index = e.currentTarget.dataset.index
    const todos = this.data.todos
    const todo = this.data.filteredTodos[index]
    const realIndex = todos.findIndex(t => t.createTime === todo.createTime)
    
    todos[realIndex].completed = !todos[realIndex].completed
    wx.setStorageSync('todos', todos)
    this.loadTodos()
  },

  onLongPress(e) {
    const index = e.currentTarget.dataset.index
    const todo = this.data.filteredTodos[index]
    const todos = this.data.todos
    const realIndex = todos.findIndex(t => t.createTime === todo.createTime)
    
    this.setData({ currentTodoIndex: realIndex })
    
    wx.showActionSheet({
      itemList: [todo.completed ? '标记未完成' : '标记完成', '编辑', '删除'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.toggleComplete(realIndex)
        } else if (res.tapIndex === 1) {
          this.onEditTap({ currentTarget: { dataset: { index: realIndex } } })
        } else if (res.tapIndex === 2) {
          this.deleteTodo(realIndex)
        }
      }
    })
  },

  toggleComplete(index) {
    const todos = this.data.todos
    todos[index].completed = !todos[index].completed
    wx.setStorageSync('todos', todos)
    this.loadTodos()
  },

  deleteTodo(index) {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          const todos = this.data.todos
          todos.splice(index, 1)
          wx.setStorageSync('todos', todos)
          this.loadTodos()
        }
      }
    })
  },

  onAddTap() {
    wx.navigateTo({ url: '/pages/add/add' })
  },

  onEditTap(e) {
    const index = e.currentTarget.dataset.index
    wx.navigateTo({ url: `/pages/edit/edit?index=${index}` })
  },

  goToStats() {
    wx.navigateTo({ url: '/pages/stats/stats' })
  }
})
