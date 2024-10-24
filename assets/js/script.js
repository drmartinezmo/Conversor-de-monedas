document.getElementById('buscarBtn').addEventListener('click', async function() {
    const pesos = document.getElementById('pesosInput').value;
    const moneda = document.getElementById('monedaSelect').value;

    try {
        const response = await fetch('https://mindicador.cl/api/' + moneda);
        const data = await response.json();
        
        const valorMoneda = data.serie[0].valor;
        const resultado = pesos / valorMoneda;
        document.getElementById('resultado').innerText = 'Resultado: $' + resultado.toFixed(2);
        
        // Cargar historial de los últimos 10 días
        const fechas = data.serie.slice(0, 10).map(item => item.fecha.split('T')[0]);
        const valores = data.serie.slice(0, 10).map(item => item.valor);
        const titulo = `Gráfica de ${moneda.toUpperCase()}`;

        agregaGrafico()
        createChart(fechas, valores, titulo)

    } catch (error) {
        document.getElementById('resultado').innerText = 'Debes seleccionar una moneda valida!!!'
        console.error(error);
    }
});

function createChart(labels, datasets, titulo) {
    const ctx = document.getElementById('historialChart').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy(); 
    }
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: titulo,
                borderColor: 'rgb(214, 40, 40)',
                backgroundColor: 'rgba(214, 40, 40)',
                data: datasets,
                }]
        }
    });
}

function agregaGrafico(){
    const element = document.getElementById('historialChart');
    if (element) {
        element.remove(); // Elimina el elemento del DOM
    }
    const canvas = document.createElement('canvas');
    canvas.width = 600; // Establecer ancho del canvas
    canvas.height = 300; // Establecer alto del canvas
    canvas.id = 'historialChart'
    canvas.style="background-color: white;"
    
    // Agregar el canvas al contenedor
    document.getElementById('canvasContainer').appendChild(canvas);
}