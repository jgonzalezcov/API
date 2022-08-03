'use strict'
const apiURL = 'https://mindicador.cl/api/'
let currency = 'dolar'
const btn = document.querySelector('#search')
const selector = document.querySelector('#selector')
const todayDates = document.querySelector('#todayDates')
const exchangeDate = document.querySelector('#exchangeDate')
const clp = document.querySelector('#clp')
const messageServer = document.querySelector('#messageServer')
const result = document.querySelector('#result')
const html = document.querySelector('.table_body')
const containerTable = document.querySelector('#container_table')
const containerTableBody = document.querySelector('.table_body')
const numReg = document.querySelector('#nu_reg')

let myChart = null
let templateTable = ''
result.innerHTML = '..'

//Resetean los parámetros
function reset() {
  if (myChart != null) {
    myChart.destroy()
  }
  result.innerHTML = '..'
  todayDates.innerHTML = 'Sin información disponible'
  exchangeDate.innerHTML = 'Sin información disponible'
}

//Comunicación con el EndPoint

async function ConectionServer(type) {
  try {
    currency = selector.value
    const res = await fetch(`${apiURL}${currency}`)
    if (res.status === 200) {
      const data = await res.json()
      messageServer.innerHTML = 'Mensaje del Servidor: La conexión fue exitosa'
      date(data.serie[0].fecha)
      calculate(data.serie[0].valor, type)
      calcArray(data.serie)
    } else {
      const data = await res.json()
      messageServer.innerHTML = `Mensaje del Servidor: ${data.message}`
      reset()
    }
  } catch (e) {
    messageServer.innerHTML =
      'Mensaje del Servidor: No se pudo establecer la conexión'
    reset()
  }
}
//Validaciones de Ingreso
function validation(type) {
  if (clp.value === '' && type === 'click') {
    alert('Debes ingresar una cantidad a convertir')
    return
  }
  if (isNaN(clp.value) && type === 'click') {
    alert('Solo puedes ingresar valores numéricos en la cantidad aconvertir')
    return
  }
  if (isNaN(numReg.value) && type === 'click') {
    alert(
      'Solo puedes ingresar valores numéricos en el número de registros a graficar'
    )
    return
  }
  if (numReg.value > 31 && type === 'click') {
    alert('El máximo de registros a graficar es de 31')
    return
  }
  if (numReg.value === '' && type === 'click') {
    alert('Debes ingresar el número de registros a graficar')
    return
  }
  ConectionServer(type)
}
//Boton
btn.addEventListener('click', () => {
  validation('click')
})
//Busca la fecha actual del sistema y la última fecha de modificación al tipo de cambio
function date(dateLast) {
  let dateNow = new Date()
  let dateIN =
    String(dateNow.getDate()).padStart(2, '0') +
    '/' +
    String(dateNow.getMonth() + 1).padStart(2, '0') +
    '/' +
    dateNow.getFullYear()
  todayDates.innerHTML = `Fecha de consulta: ${dateIN}`
  exchangeDate.innerHTML = `Ultima fecha de modificación del tipo de cambio  ${currency.toUpperCase()}: ${dateLast.substring(
    8,
    10
  )}-${dateLast.substring(5, 7)}-${dateLast.substring(0, 4)}`
}
//Calculado el tipo de cambio
function calculate(exchangeRate, type) {
  currency = selector.value
  let suffix = 'USD'
  if (currency === 'dolar') {
    suffix = 'DOLARES'
  } else if (currency === 'euro') {
    suffix = 'EUROS'
  } else if (currency === 'utm') {
    suffix = 'UTM'
  } else if (currency === 'uf') {
    suffix = 'UF'
  }
  if (type === 'click') {
    result.innerHTML = `${(clp.value / exchangeRate).toFixed(2)} ${suffix}`
    clp.value = ''
  }
}
//Grafico
function calcArray(datIn) {
  let n = numReg.value
  //Se muestra los 10 primeros valores
  let datFilter = datIn.slice(0, n)
  tableRender(datFilter)
  //Se davuelta el arreglo para dejar en orden los datos
  const reversed = datFilter.reverse()
  //Aca se pasa la fecha a formato DD/MM/YYYY
  const datLabel = reversed.map(
    (x) =>
      `${x.fecha.substring(8, 10)}-${x.fecha.substring(
        5,
        7
      )}-${x.fecha.substring(0, 4)}`
  )
  const datChange = reversed.map((x) => x.valor)
  chartRender(datLabel, datChange)
}
function chartRender(datLabel, datChange) {
  const ctx = document.getElementById('myChart').getContext('2d')
  if (myChart != null) {
    myChart.destroy()
  }
  myChart = new Chart(ctx, {
    type: 'line',

    data: {
      labels: datLabel,
      datasets: [
        {
          label: `Valor: ${currency.toUpperCase()}`,
          data: datChange,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'DarkTurquoise',
          },
        },
        x: {
          beginAtZero: true,
          grid: {
            color: 'DarkTurquoise',
          },
        },
      },
    },
  })
}
//Esto muestra los valores en la tabla
function tableRender(data) {
  containerTableBody.setAttribute(
    'style',
    'border-radius: 5px;  border-style: double;  width: 98%;  margin-left: 20px;'
  )
  containerTable.innerHTML = `<table class="table_head">
  <tr>
    <th class="title_date title_list">FECHA</th>
    <th class="title_value title_list">${currency.toUpperCase()}</th>
  </tr>
</table>`

  templateTable = ''
  for (let dat of data) {
    console.log(dat)
    templateTable += `<tr> <th class="title_date title_dat">${dat.fecha.substring(
      8,
      10
    )}-${dat.fecha.substring(5, 7)}-${dat.fecha.substring(0, 4)}</th>
    <th class="title_value title_dat">${dat.valor}</th> </tr>`
  }

  html.innerHTML = templateTable
}

containerTableBody.setAttribute('style', 'display:none;')
