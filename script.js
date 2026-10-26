const campoAno = document.getElementById('ano')
const listaFeriados = document.getElementById('listaFeriados')
const totalFeriados = document.getElementById('totalFeriados')
const mensagem = document.getElementById('mensagem')
const proximoFeriado = document.getElementById('proximoFeriado')

campoAno.value = new Date().getFullYear()

document.getElementById('formFeriados').addEventListener('submit', (evento) => {
    evento.preventDefault()

    consultarFeriados()
})

function consultarFeriados() {
    const ano = campoAno.value

    listaFeriados.innerHTML = ''
    totalFeriados.textContent = ''
    mensagem.textContent = ''
    proximoFeriado.innerHTML = ''

    fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`)
        .then(response => {

            if (!response.ok) {
                throw new Error('Ano inválido ou erro na consulta.')
            }

            return response.json()
        })
        .then(feriados => {

            totalFeriados.textContent =
                `Total de feriados em ${ano}: ${feriados.length}`

            feriados.forEach(feriado => {

                const data = new Date(feriado.date + 'T12:00:00')

                const dataFormatada = data.toLocaleDateString('pt-BR')

                const diaSemana = data.toLocaleDateString('pt-BR', {
                    weekday: 'long'
                })

                const linha = document.createElement('tr')

                if (data.getDay() === 0 || data.getDay() === 6) {
                    linha.classList.add('fim-semana')
                }

                linha.innerHTML = `
                    <td>${dataFormatada}</td>
                    <td>${diaSemana}</td>
                    <td>${feriado.name}</td>
                `

                listaFeriados.appendChild(linha)
            })

            mostrarProximoFeriado(feriados)
        })
        .catch(erro => {
            mensagem.textContent = erro.message
        })
}

function mostrarProximoFeriado(feriados) {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const proximos = feriados.filter(feriado => {
        const data = new Date(feriado.date + 'T12:00:00')
        return data >= hoje
    })

    if (proximos.length === 0) {
        proximoFeriado.textContent =
            'Não existem mais feriados neste ano.'
        return
    }

    const feriado = proximos[0]

    const data = new Date(feriado.date + 'T12:00:00')

    const diferenca = data - hoje

    const dias = Math.ceil(
        diferenca / (1000 * 60 * 60 * 24)
    )

    proximoFeriado.innerHTML = `
        <strong>Próximo feriado:</strong>
        ${feriado.name} -
        ${data.toLocaleDateString('pt-BR')}
        - faltam ${dias} dia(s).
    `
}

consultarFeriados()