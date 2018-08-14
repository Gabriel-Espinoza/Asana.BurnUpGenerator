var chartController = {
  chartData: [],
  minDate: null,
  maxDate: null,
  init: function(res) {

    chartController.chartData= [];
    chartController.minDate= null;
    chartController.maxDate= null;

    // Transforms Asana format to something usable
    for (let i = 0; i < res.data.length; i++) {
      if (res.data[i].tags.length > 0) {
        for (let j = 0; j < res.data[i].tags.length; j++) {
          let effort = parseInt(res.data[i].tags[j].name);
          if (!isNaN(effort)) {
            let current = {
              effort: effort,
              completed: res.data[i].completed,
              created_at: new Date(res.data[i].created_at),
              completed_at: new Date(res.data[i].completed_at)
            };

            if (
              chartController.minDate === null ||
              chartController.minDate > current.created_at
            )
              chartController.minDate = current.created_at;
            if (
              chartController.maxDate === null ||
              chartController.maxDate < current.created_at
            )
              chartController.maxDate = current.created_at;

            chartController.chartData.push(current);

            break;
          }
        }
      }
    }
  },
  getLabels: function() {
    let auxDate = chartController.minDate;
    let labels = [];
    while (auxDate <= chartController.maxDate) {
      let current = new Date(
        auxDate.getFullYear(),
        auxDate.getMonth(),
        auxDate.getDate()
      );
      labels.push(current.toLocaleDateString());
      auxDate = Date.addDays(auxDate, 1);
    }

    return labels;
  },
  getWorkInProgress: function() {
    let auxDate = chartController.minDate;
    let serie = [];
    while (auxDate <= chartController.maxDate) {
      let current = new Date(
        auxDate.getFullYear(),
        auxDate.getMonth(),
        auxDate.getDate()
      );
      let obj = { t: current, y: 0 };
      for (let i = 0; i < chartController.chartData.length; i++) {
        if (chartController.chartData[i].created_at <= auxDate)
          obj.y += chartController.chartData[i].effort;
      }
      serie.push(obj);

      auxDate = Date.addDays(auxDate, 1);
    }

    return serie;
  },
  getWorkDone: function() {
    let auxDate = chartController.minDate;
    let serie = [];
    while (auxDate <= chartController.maxDate) {
      let current = new Date(
        auxDate.getFullYear(),
        auxDate.getMonth(),
        auxDate.getDate()
      );
      let obj = { t: current, y: 0 };
      for (let i = 0; i < chartController.chartData.length; i++) {
        if (
          chartController.chartData[i].completed === true &&
          chartController.chartData[i].completed_at <= auxDate
        )
          obj.y += chartController.chartData[i].effort;
      }
      serie.push(obj);

      auxDate = Date.addDays(auxDate, 1);
    }

    return serie;
  },

  drawBurnUp: function() {

    $("#canvasContainer").html("");
    $("#canvasContainer").append("<canvas class='my-4 w-100' id='myChart'></canvas>");
    

    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: chartController.getLabels(),
        datasets: [
          {
            label: "Trabajo Comprometido",
            data: chartController.getWorkInProgress(),
            lineTension: 0,
            backgroundColor: "#B71C1C40",
            borderColor: "#B71C1C",
            // borderWidth: 4,
            pointBackgroundColor: "#B71C1C"
          },
          {
            label: "Trabajo Realizado",
            data: chartController.getWorkDone(),
            lineTension: 0,
            backgroundColor: "#2196F340",
            borderColor: "#2196F3",
            // borderWidth: 4,
            pointBackgroundColor: "#007bff"
          }
        ]
      },
      options: {
        tooltips:{
          mode: 'label'
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: false
              }
            }
          ]
        },
        legend: {
          display: true
        }
      }
    });
  }
};
