const buble = require('rollup-plugin-buble')

export default {
  input: 'dist/app.js',
  plugins: [ buble() ],
  output: { format: 'iife' }
}

