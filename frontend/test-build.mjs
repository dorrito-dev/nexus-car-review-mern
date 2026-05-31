import { build } from 'vite'
build({
  root: '.',
  build: {
    rollupOptions: {
      input: 'test-chakra.jsx'
    }
  }
}).catch(console.error)
