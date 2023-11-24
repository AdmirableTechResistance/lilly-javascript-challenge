const canvas = document.getElementById('chart')
const ctx = canvas.getContext('2d')
const colours = {
  MSFT: "green",
  AAPL: "red",
  FB: "blue",
  IBM: "black",
  EA: "purple" 
}

function getStockData() {
  fetch('/stocks')
    .then(res => res.json())
    .then(stocks => {
      
      //iterate through stocks and add to list
      let listOfStocks = stocks.stockSymbols;

      //query data on each stock in list
      for (let i = 0; i < listOfStocks.length; i++) {
        let stock = listOfStocks[i];
        let noError = false;
        fetch('/stocks/' + stock)
          .then(res => {
            if (res.ok) { //confirm no error in response
              noError = true;
            }
            return res.json();
          })
          .then(stockData => {
            if (noError) {
              let dataPoints = logStockData(stock, stockData);
              plotStockData(stock, dataPoints);
            } else {
              console.log("\n" + stockData.error + stock);
              removeStockFromLegend(stock);
            }
          })
      }

      hideSpinner();
      labelAxes();
      showLegend();
    })
}

function plotStockData(stock, dataPoints) { //takes in the stock and a list of its data points coords and draws lines between them on chart
  let line_colour = colours[stock];

  //iterate through data points for stock and draw lines between
  for (let i = 0; i < dataPoints.length-1; i++) {
    let x = dataPoints[i][0];
    let y = dataPoints[i][1];

    let x_next = dataPoints[i+1][0];
    let y_next = dataPoints[i+1][1];

    drawLine([x, y],[x_next, y_next],line_colour);
  }
}

function logStockData(stockName, data) { //takes in the stock name and its data. outputs stock name and corresponding data values to console while also storing coords of data values in a list. returns this list
  console.log("\nData for " + stockName + ": ");
  let index = 0;
  let dataPoints = [];

  //log each value and corresponding timestamp for given stock
  data.forEach( obj => {
    console.log("Value: £" + obj.value + ", Timestamp: " + obj.timestamp);
    let dataPoint = storeDataPointCoords(obj.value, index);
    dataPoints.push(dataPoint);
    index ++;
  })

  return dataPoints;
}

function storeDataPointCoords(value, value_index) { //takes in a specific value of a stock and returns x and y coordinates for that value in a list
  let x_step = 90 //width of x axis divided by num of data points

  let x = 50 + (x_step * value_index); //50 is starting positon for x-axis
  let y = calculateCoordY(value);

  return [x, y];
}

function calculateCoordY(value) { //takes in a specific value of a stock and calculates its y coordinate relative to the chart. returns this coordinate
  let graph_y_zero = 550;
  let graph_y_max = 50;

  return graph_y_zero + ((graph_y_max-graph_y_zero) * (value / 100));
}

function hideSpinner() {
  let spinner = document.querySelector('.spinner');
  spinner.style.display = 'none';
}

function labelAxes() { //labels the axes of the chart
  let chart_x_left = 50;
  let chart_y_bottom = 550;
  let chart_y_top = 50;

  ctx.font = 'bold 18px Courier';
  ctx.fillStyle = 'black';
  ctx.fillText('Time', canvas.width / 2, chart_y_bottom + 30);
  ctx.fillText('Val', chart_x_left - 40, canvas.height / 2);

  ctx.font = '16px Courier';
  ctx.fillText('100', chart_x_left - 34, chart_y_top + 20);
  ctx.fillText('0', chart_x_left - 16, chart_y_bottom + 5)
}

function showLegend() { //changes display of the chart legend from none to flex (aimed for after data has been loaded)
  let legend = document.querySelector('#chart-legend');
  legend.style.display = 'flex';
}

function removeStockFromLegend(stockName) { //removes stock name from the legend (this is done for stocks that have failed in the fetching of their data)
  let legendItem = document.querySelector('#'+stockName);
  legendItem.remove();
}

function drawLine (start, end, style) { 
  ctx.beginPath()
  ctx.strokeStyle = style || 'black'
  ctx.moveTo(...start)
  ctx.lineTo(...end)
  ctx.stroke()
}

function drawTriangle (apex1, apex2, apex3) {
  ctx.beginPath()
  ctx.moveTo(...apex1)
  ctx.lineTo(...apex2)
  ctx.lineTo(...apex3)
  ctx.fill()
}

drawLine([50, 50], [50, 550])
drawTriangle([35, 50], [65, 50], [50, 35])

drawLine([50, 550], [950, 550])
drawTriangle([950, 535], [950, 565], [965, 550])

getStockData();