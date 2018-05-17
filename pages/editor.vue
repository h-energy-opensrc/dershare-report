<template>
    <div>
        <h3> Editor </h3>
         <monaco-editor
            class="editor"
            v-model="code"
            language="javascript">
        </monaco-editor>
    </div>
</template>

<script>

if (process.BROWSER_BUILD) {
  var MonacoEditor = require('vue-monaco')
}
// import MonacoEditor from 'vue-monaco-editor'
// import MonacoEditor from 'vue-monaco'

// use in component
export default {

  components: {
    MonacoEditor
  },
    data() {
        return {
        code: 'const noop = () => {}'
        }
    }
}
</script>
<style>
.editor {
  width: 600px;
  height: 800px;
}
</style>