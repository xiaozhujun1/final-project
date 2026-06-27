// pages/edit/edit.js
Page({
  data: {
    index: -1,
    title: '',
    categoryIndex: 0,
    priorityIndex: 1,
    hasDeadline: false,
    deadline: '',
    remark: '',
    categories: ['工作', '生活', '学习', '其他'],
    priorities: ['高', '中', '低']
  },

  onLoad(options) {
    const index = parseInt(options.index)
    const todos = wx.getStorageSync('todos') || []
    const todo = todos[index]

    if (todo) {
      const categoryIndex = this.data.categories.indexOf(todo.category)
      const priorityIndex = this.data.priorities.indexOf(todo.priority)
      
      this.setData({
        index,
        title: todo.title,
        categoryIndex: categoryIndex >= 0 ? categoryIndex : 0,
        priorityIndex: priorityIndex >= 0 ? priorityIndex : 1,
        hasDeadline: todo.hasDeadline || false,
        deadline: todo.deadline || '',
        remark: todo.remark || ''
      })
    }
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value })
  },

  onCategoryChange(e) {
    this.setData({ categoryIndex: e.detail.value })
  },

  onPriorityChange(e) {
    this.setData({ priorityIndex: e.detail.value })
  },

  onDeadlineChange(e) {
    this.setData({ 
      deadline: e.detail.value,
      hasDeadline: true
    })
  },

  onClearDeadline() {
    this.setData({
      hasDeadline: false,
      deadline: ''
    })
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value })
  },

  onSave() {
    const { index, title, categoryIndex, priorityIndex, categories, priorities, hasDeadline, deadline, remark } = this.data
    
    if (!title.trim()) {
      wx.showToast({ title: '请输入任务标题', icon: 'none' })
      return
    }

    const todos = wx.getStorageSync('todos') || []
    
    if (index >= 0 && index < todos.length) {
      todos[index].title = title.trim()
      todos[index].category = categories[categoryIndex]
      todos[index].priority = priorities[priorityIndex]
      todos[index].hasDeadline = hasDeadline
      todos[index].deadline = hasDeadline ? deadline : ''
      todos[index].remark = remark.trim()

      wx.setStorageSync('todos', todos)
      wx.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  }
})
