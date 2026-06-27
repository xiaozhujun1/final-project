// pages/backup/backup.js
Page({
  data: {
    lastBackupTime: '',
    todoCount: 0
  },

  onLoad() {
    this.loadInfo()
  },

  onShow() {
    this.loadInfo()
  },

  loadInfo() {
    const lastBackupTime = wx.getStorageSync('lastBackupTime') || ''
    const todos = wx.getStorageSync('todos') || []
    this.setData({
      lastBackupTime,
      todoCount: todos.length
    })
  },

  exportData() {
    const todos = wx.getStorageSync('todos') || []
    
    if (todos.length === 0) {
      wx.showToast({ title: '暂无数据可导出', icon: 'none' })
      return
    }

    const exportData = {
      version: '1.0',
      exportTime: new Date().toISOString(),
      todos: todos
    }

    const content = JSON.stringify(exportData, null, 2)
    
    wx.showModal({
      title: '导出数据',
      content: `共 ${todos.length} 条任务，是否复制到剪贴板？`,
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: content,
            success: () => {
              wx.showToast({ title: '已复制到剪贴板', icon: 'success' })
            }
          })
        }
      }
    })
  },

  importData() {
    wx.showModal({
      title: '导入数据',
      content: '将导出的 JSON 数据粘贴到下方',
      confirmText: '粘贴',
      success: (res) => {
        if (res.confirm) {
          wx.getClipboardData({
            success: (res) => {
              if (res.data) {
                this.processImport(res.data)
              } else {
                wx.showToast({ title: '剪贴板为空', icon: 'none' })
              }
            }
          })
        }
      }
    })
  },

  processImport(content) {
    try {
      const data = JSON.parse(content)
      
      if (!data.todos || !Array.isArray(data.todos)) {
        wx.showToast({ title: '数据格式不正确', icon: 'none' })
        return
      }

      wx.showModal({
        title: '确认导入',
        content: `将导入 ${data.todos.length} 条任务，当前数据将被覆盖，是否继续？`,
        success: (res) => {
          if (res.confirm) {
            wx.setStorageSync('todos', data.todos)
            wx.setStorageSync('lastBackupTime', new Date().toISOString())
            wx.showToast({ title: '导入成功', icon: 'success' })
            this.loadInfo()
          }
        }
      })
    } catch (e) {
      wx.showToast({ title: 'JSON 解析失败', icon: 'none' })
    }
  },

  clearData() {
    wx.showModal({
      title: '清空数据',
      content: '确定要清空所有任务吗？此操作不可恢复！',
      success: (res) => {
        if (res.confirm) {
          wx.showModal({
            title: '再次确认',
            content: '清空后所有任务将永久删除！',
            success: (res2) => {
              if (res2.confirm) {
                wx.setStorageSync('todos', [])
                wx.showToast({ title: '已清空', icon: 'success' })
                this.loadInfo()
              }
            }
          })
        }
      }
    })
  },

  goBack() {
    wx.navigateBack()
  }
})
