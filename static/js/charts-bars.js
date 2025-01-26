// Configuración inicial del gráfico
const barConfig = {
  type: 'bar',
  data: {
    labels: ['Ecuatoriana', 'Italiana', 'Saludable', 'Piqueos', 'Asiática'],
    datasets: [
      {
        backgroundColor: ['#0694a2', '#1c64f2', '#7e3af2', '#3ab0ff', '#9b4d96'], // Colores fijos
        borderWidth: 1,
        data: [0, 0, 0, 0, 0],  // Datos iniciales vacíos
        label: '', // Eliminar la etiqueta del dataset
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Desactivar la visualización de la leyenda
      },
    },
    scales: {
      y: {
        ticks: {
          beginAtZero: true, // Comienza desde cero
          stepSize: 1,       // Solo números enteros
        },
      },
    },
  }
};

const barsCtx = document.getElementById('bars');

// Crear una instancia del gráfico
let myBar = new Chart(barsCtx, barConfig);

// Función para procesar las preferencias de comida
const countFoodPreferences = (data) => {
  const labels = ['Ecuatoriana', 'Italiana', 'Saludable', 'Piqueos', 'Asiática'];
  const counts = [0, 0, 0, 0, 0];
  
  // Iterar sobre cada registro y contar las preferencias
  Object.values(data).forEach(record => {
    const preferencias = record.preferencias;  // Obtenemos el valor de preferencias
    const index = labels.indexOf(preferencias.replace("Comida ", "")); // Filtramos el "Comida" y encontramos el índice
    if (index !== -1) {
      counts[index]++;
    }
  });
  
  return { labels, counts };
};

// Función para actualizar el gráfico con nuevos datos
const update = () => {
  fetch('/api/v1/landing')
    .then(response => response.json())
    .then(data => {
      // Procesar los datos
      const { labels, counts } = countFoodPreferences(data);
      
      // Actualizar los datos del gráfico
      myBar.data.labels = labels;
      myBar.data.datasets[0].data = counts;
      myBar.update();
    })
    .catch(error => console.error('Error:', error));
};

// Llamar a la función update para cargar los datos
update();
