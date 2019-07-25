import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ProductDataService } from '../services/product-data.service';
import { IData } from '../dashboard/idata';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  users: Object;
  dataList: IData[];
  dataAsJSON: Object;
  dataKey: string;
  dataLength: number;
  dataKeys = [];

  plotData: boolean = false;

  Charts = [];

  LineChart = [];
  BarChart = [];
  PieChart = [];
  RadarChart = [];
  PolarAreaChart = [];
  DoughnutChart = [];

  chartColors = [];
  chartBorders = [];

  labels = [];
  chartData = [];

  constructor(private dataService: ProductDataService, private router: Router) { }

  ngOnInit() {
    this.getDataList();
  }

  updateDashboard() {
    location.reload();
  }

  goBackToFileUpload() {
    this.dataService.removeData(this.dataKey);
    this.router.navigate(['file-upload']);
  }

  getDataList() {
    this.dataLength = 0;
    this.dataService.getDataFromFirebase().snapshotChanges().forEach(dataSnapshots => {
      this.dataList = [];
      dataSnapshots.forEach(dataSnapshot => {
        let dataItem = dataSnapshot.payload.val();
        this.dataAsJSON = dataSnapshot.payload.toJSON();
        // console.log(this.dataAsJSON);

        this.dataLength = Object.keys(this.dataAsJSON).length;
        console.log(this.dataLength);

        this.dataKeys = Object.keys(this.dataAsJSON[0]);
        console.log(this.dataKeys);

        this.updateLocalData();

        dataItem['$key'] = dataSnapshot.key;
        this.dataKey = dataSnapshot.key;
        this.dataList.push(dataItem as IData);
      });
    });
  }

  updateLocalData() {
    console.log(this.dataAsJSON);
    let index = 0;
    while(index < this.dataLength){
      if(this.dataAsJSON[index] != null) {
        let jsonObj = this.dataAsJSON[index];
        const labelsString = jsonObj[Object.keys(jsonObj)[0]];
        const dataString = jsonObj[Object.keys(jsonObj)[1]];

        if(!isNaN(labelsString)) {
          this.labels.push(Number(labelsString));
          this.plotData = false;
        } else {
          this.labels.push(labelsString);
          this.plotData = true;
        }

        if(!isNaN(dataString)) {
          this.chartData.push(Number(dataString));
          this.plotData = true;
        } else{
          this.chartData.push(dataString);
          this.plotData = false;
        }
      }
      index++;
    }
    this.checkData();
    this.generateColors(this.dataLength);
    this.generateGraphs();
  }

  checkData() {
    if (!this.plotData) {
      const copyLabels = this.labels;
      this.labels = this.chartData;
      this.chartData = copyLabels;
    }
  }

  generateGraphs() {
    try {
      this.generateLineChart();
    } catch(err) {
      alert('Unable to Generate Line Chart from Provided Dataset');
    }

    try {
      this.generateBarChart();
    } catch(err) {
      alert('Unable to Generate Bar Chart from Provided Dataset');
    }

    try {
      this.generatePieChart();
    } catch(err) {
      alert('Unable to Generate Pie Chart from Provided Dataset');
    }

    try {
      this.generateRadarGraph();
    } catch(err) {
      alert('Unable to Generate Radar Chart from Provided Dataset');
    }

    try {
      this.generatePolarAreaChart();
    } catch(err) {
      alert('Unable to Generate Polar Area Chart from Provided Dataset');
    }

    try {
      this.generateDoughnutChart();
    } catch(err) {
      alert('Unable to Generate Doughnut Chart from Provided Dataset');
    }
  }

  generateColors(numColors: number) {
    let index = 0;
    while(index < numColors){
      let newColor = 'rgba(' + this.randomInt(50, 200) + ', ' + this.randomInt(50, 200) + ', ' +
      this.randomInt(50, 200) + ', ' + this.randomInt(0.5, 1) + ')';
      this.chartColors[index] = newColor;
      this.chartBorders[index] = newColor;
      index = index + 1;
    }
  }

  generateColor() {
    return 'rgba(' + this.randomInt(50, 200) + ', ' + this.randomInt(50, 200) + ', ' +
    this.randomInt(50, 200) + ', ' + this.randomInt(0.5, 1) + ')';
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateBarChart(){
    // Bar chart:
    this.BarChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Number of Items Sold in Months',
          data: this.chartData,
          backgroundColor: this.chartColors,
    borderColor: this.chartBorders,
        borderWidth: 1
      }]
    },
    options: {
    title: {
        text: "Bar Chart",
        display: true
    },

    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
    }
    });
    this.Charts.push(this.BarChart);
  }

  generateLineChart(){
    this.LineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Number of Items Sold in Months',
          data: this.chartData,
          fill: false,
          lineTension: 0.2,
          borderColor:'red',
          borderWidth: 1
        }]
      },
      options: {
        title: {
            text: 'Line Chart',
            display: true
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
       }
      });
    this.Charts.push(this.LineChart);
  }

  generatePieChart(){
    // pie chart:
    this.PieChart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [{
          label: "Products Sold Each Month",
          backgroundColor: this.chartColors,
          data: this.chartData
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Pie Chart'
        }
      }
    });
  }

  generateRadarGraph() {
    this.RadarChart = new Chart('radar-chart', {
      type: 'radar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Products Sold Each Month',
            fill: true,
            backgroundColor: this.generateColor(),
            borderColor: this.generateColor(),
            pointBorderColor: "#fff",
            pointBackgroundColor: this.generateColor(),
            data: this.chartData
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Radar Chart'
        }
      }
  });
  }

  generatePolarAreaChart() {
    this.PolarAreaChart = new Chart('polar-chart', {
        type: 'polarArea',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "Products Sold Each Month",
            backgroundColor: this.chartColors,
            data: this.chartData
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Polar Area Chart'
        }
      }
    });
  }

  generateDoughnutChart() {
    this.DoughnutChart = new Chart('doughnut-chart', {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "Products Sold Each Month",
            backgroundColor: this.chartColors,
            data: this.chartData
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Doughnut Chart'
        }
      }
    });
  }

}
