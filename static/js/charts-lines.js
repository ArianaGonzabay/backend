// Lista de días de la semana
const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Tipos de comida y colores asociados
const foodTypes = {
  'Ecuatoriana': '#0694a2',
  'Italiana': '#1c64f2',
  'Saludable': '#7e3af2',
  'Asiática': '#f97316',
  'Piqueos': '#ef4444',
};

// Configuración del gráfico de líneas
const lineConfig = {
  type: 'line',
  data: {
    labels: daysOfWeek,
    datasets: Object.keys(foodTypes).map(food => ({
      label: food,
      backgroundColor: foodTypes[food],
      borderColor: foodTypes[food],
      data: new Array(7).fill(0),
      fill: false,
      tension: 0.4,
    })),
  },
  options: {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
          callback: value => Math.floor(value),
        },
      },
    },
  },
};

// Crear instancia del gráfico
const lineCtx = document.getElementById('line');
let myLineChart;
if (lineCtx) {
  myLineChart = new Chart(lineCtx, lineConfig);
}

// Función para contar preferencias de comida por día de la semana
const countFoodPreferencesByDay = (data) => {
  let counts = {};
  Object.keys(foodTypes).forEach(food => {
    counts[food] = new Array(7).fill(0);
  });

  Object.values(data).forEach(record => {
    const { saved, preferencias } = record;
    if (!saved || !preferencias) return;

    let cleanedPreference = preferencias.trim().replace(/^Comida\s+/i, "").toLowerCase();
    let preferenceKey = Object.keys(foodTypes).find(key => key.toLowerCase() === cleanedPreference);

    if (!preferenceKey) return;

    let [day, month, year] = saved.split(', ')[0].split('/').map(num => parseInt(num, 10));
    let dayIndex = new Date(year, month - 1, day).getDay();

    counts[preferenceKey][dayIndex]++;
  });

  return counts;
};

// Función para actualizar el gráfico de líneas
const updateLineChart = () => {
  fetch('/api/v1/landing')
    .then(response => response.json())
    .then(data => {
      const submitCounts = countFoodPreferencesByDay(data);
      if (!myLineChart) return;

      myLineChart.data.datasets.forEach(dataset => {
        dataset.data = submitCounts[dataset.label] || new Array(7).fill(0);
      });

      myLineChart.update();
    })
    .catch(() => {});
};

// Llamar a la función de actualización
updateLineChart();
