const express = require('express')
const path = require('path')
const stocks = require('./stocks')

const app = express()
app.use(express.static(path.join(__dirname, 'static')))

app.get('/stocks', async (req, res) => {
  const stockSymbols = await stocks.getStocks()
  res.send({ stockSymbols })
})

app.get('/stocks/:symbol', async (req, res) => {
  try {
    const { params: { symbol } } = req
    const data = await stocks.getStockPoints(symbol, new Date())
    res.send(data)
  } catch (error) {
    res.status(500).send({error: 'Failed to retrieve data for stock symbol: '})
  }
})

app.listen(3000, () => console.log('Server is listening on port 3000!'))
