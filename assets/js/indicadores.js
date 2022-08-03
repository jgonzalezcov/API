async function ConectionServer() {
  try {
    currency = selector.value
    const res = await fetch('https://mindicador.cl/api')
    const data = await res.json()
    let indic_filter = Object.keys(data)
      .slice(3, 20)
      .filter((e) => e != 'imacec' && e != 'tpm' && e != 'tasa_desempleo') //Con esta linea lo obtengo
    console.log(indic_filter)
  } catch (e) {
    messageServer.innerHTML =
      'Mensaje del Servidor: No se pudo establecer la conexión'
  }
}
ConectionServer()
