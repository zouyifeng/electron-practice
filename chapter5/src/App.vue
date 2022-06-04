<template>
  <div id="app">
    <div style="height: 30px;color: #fff;position: relative;text-align: center">
      <div @click="close">close</div>
      <div @click="minimize">minimize</div>
      <div v-if="isMaxSize" @click="restore">restore</div>
      <div v-else @click="maximize">maximize</div>
      <div @click="newModal">new modal</div>
    </div>
  </div>
</template>
<script>
import { setTimeout } from 'timers'
let { remote } = require('electron')
export default {
  data () {
    return {
      isMaxSize: false
    }
  },
  created () {
    window.onkeydown = function(e) {
      console.log('e: ', e);
      if(e.keyCode == 82 && (e.ctrlKey || e.metaKey)) return false
    }
    console.log('remote lock ', remote.getGlobal('lock'))
  },
  mounted() {
    let win = remote.getCurrentWindow()
    win.on('maximize', _ => {
      this.isMaxSize = true
      this.setState()
    })
    win.on('unmaximize', _ => {
      this.isMaxSize = false
      this.setState()
    })
    win.on('restore', _ => {
      console.log('restore')
    })
    win.on('resize', _ => {
      console.log('restore')
      this.setState()
    })
    win.on('close', e => {
      e.preventDefault()
    })
    this.isMaxSize = win.isMaximized()
    
    window.addEventListener('mousemove', e => {
      let flag = e.target == document.documentElement
      if (flag)
        win.setIgnoreMouseEvents(true, { forward: true })
      else 
        win.setIgnoreMouseEvents(false)
    })
    win.setIgnoreMouseEvents(true, { forward: true })


    // window.onbeforeunload = function() {
    //   console.log('onbeforeunload');
    //   return false
    // }

  },
  methods: {
    close() {
      remote.getCurrentWindow().close()
      console.log('close: ');
    },
    minimize() {
      remote.getCurrentWindow().minimize()
      console.log('minimize: ');
    },
    restore() {
      remote.getCurrentWindow().restore()
      console.log('restore: ');
    },
    maximize() {
      remote.getCurrentWindow().maximize()
      console.log('maximize: ');
    },
    setState() {
      let win = remote.getCurrentWindow()
      let rect = win.getBounds()
      let isMaxSize = win.isMaximized()
      let obj = { rect, isMaxSize }
      localStorage.setItem('winState', JSON.stringify(obj))
    },
    getState() {
      let win = remote.getCurrentWindow()
      let winState = localStorage.getItem('winState')
      if (winState) {
        winState = JSON.parse(winState)
        if (winState.isMaxSize) win.maximize()
        else win.setBounds(win.rect)
      }
      win.on('ready-to-show', () => {
        win.show()
      })
    },
    newModal() {
      const currentWindow = remote.getCurrentWindow()
      const newWin = new remote.BrowserWindow({
        parent: currentWindow,
        modal: true,
      })
      setTimeout(() => {
        newWin.close()
      }, 2000)
    }
  }
}
</script>

<style lang="scss">
#app {
  color: #fff;
  width: 600px;
  height: 600px;
  border-radius: 300px;
  overflow: hidden;
  background: #2c3e50;
  pointer-events: auto;
  -webkit-app-region: drag;
  box-sizing: border-box;
}
body {
  margin: 0;
}

html, body {
  pointer-events: none;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
