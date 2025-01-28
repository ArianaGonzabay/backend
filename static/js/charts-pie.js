/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */
const pieConfig = {
  type: 'doughnut',
  data: {
    datasets: [
      {
        data: [33, 33, 33],
        backgroundColor: ['#0694a2', '#1c64f2', '#7e3af2'],
        label: 'Ejemplo',
      },
    ],
    labels: ['Cargando...', 'Cargando...', 'Cargando...'],
  },
  options: {
    responsive: true,
    cutoutPercentage: 80,
    legend: {
      display: false,
    },
  },
};

const pieCtx = document.getElementById('pie');
if (!pieCtx) {
  console.error('Error: No se encontró un elemento con id="pie" en el DOM.');
} else {
  window.myPie = new Chart(pieCtx, pieConfig);
}

const countCommentsByHour = (data) => {
  const labels = ["0 a.m. - 8 a.m.", "8 a.m. - 16 p.m.", "16 p.m. - 0 a.m."];
  const counts = [0, 0, 0];

  Object.values(data).forEach((record) => {
    const savedTime = record.saved;
    if (!savedTime) {
      console.warn('Advertencia: Se encontró un registro sin campo "saved".', record);
      return;
    }

    try {
      // Normalizar el formato AM/PM
      let formattedTime = savedTime
        .replace('a. m.', 'AM')
        .replace('p. m.', 'PM')
        .replace('a.m.', 'AM')
        .replace('p.m.', 'PM');

      // Separar la fecha y la hora
      const [datePart, timePart] = formattedTime.split(', ');
      
      // Separar los componentes de la hora
      const [time, period] = timePart.split(' ');
      const [hours, minutes, seconds] = time.split(':');
      
      // Convertir a formato de 24 horas
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) {
        hour += 12;
      } else if (period === 'AM' && hour === 12) {
        hour = 0;
      }

      // Incrementar el contador correspondiente
      if (hour >= 0 && hour < 8) {
        counts[0]++;
      } else if (hour >= 8 && hour < 16) {
        counts[1]++;
      } else {
        counts[2]++;
      }
    } catch (error) {
      console.error('Error procesando la fecha:', savedTime, error);
      console.error('Detalles del error:', error.message);
    }
  });

  return { labels, counts };
};

const updateChart = () => {
  fetch('/api/v1/landing')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error en la respuesta de la API: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const { labels, counts } = countCommentsByHour(data);
      if (!window.myPie) {
        console.error('Error: El gráfico no se ha inicializado correctamente.');
        return;
      }
      window.myPie.data.labels = labels;
      window.myPie.data.datasets[0].data = counts;
      window.myPie.update();
    })
    .catch((error) => {
      console.error('Error al actualizar los datos del gráfico:', error);
    });
};

if (pieCtx) {
  updateChart();
}