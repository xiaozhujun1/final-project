// pages/add/add.js
Page({
  data: {
    title: '',
    categoryIndex: 0,
    priorityIndex: 1,
    categories: ['工作', '生活', '学习', '其他'],
    priorities: ['高', '中', '低']
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

  onSave() {
    const { title, categoryIndex, priorityIndex, categories, priorities } = this.data
    
    if (!title.trim()) {
      wx.showToast({ title: '请输入任务标题', icon: 'none' })
      return
    }

    const todos = wx.getStorageSync('todos') || []
    const newTodo = {
      title: title.trim(),
      category: categories[categoryIndex],
      priority: priorities[priorityIndex],
      completed: false,
      createTime: Date.now()
    }

    todos.unshift(newTodo)
    wx.setStorageSync('todos', todos)
    
    wx.showToast({ title: '添加成功', icon: 'success' })
    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  }
})
