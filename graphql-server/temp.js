const express = require('express')
const app = express()
const port = 3000

const f = app.get('/');
console.log(f)
