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

  }

  updateDashboard() {
    this.getDataList();
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

        console.log(this.dataAsJSON[7].Month);
        console.log(this.dataAsJSON[7].Sold);

        this.updateLocalData();

        dataItem['$key'] = dataSnapshot.key;
        this.dataKey = dataSnapshot.key;
        this.dataList.push(dataItem as IData);
      });
    });
  }

  updateLocalData() {
    let index = 0;
    while(index < this.dataLength){
      if(this.dataAsJSON[index] != null) {
        const labelsString = this.dataAsJSON[index].Month;
        const dataString = this.dataAsJSON[index].Sold;
        if(!isNaN(labelsString)) {
          this.labels.push(Number(labelsString));
        } else {
          this.labels.push(this.dataAsJSON[index].Month);
        }
        if(!isNaN(dataString)) {
          this.chartData.push(Number(dataString));
          console.log(Number(dataString));
        } else{
          this.chartData.push(this.dataAsJSON[index].Sold);
        }
      }
      console.log(JSON.stringify(this.dataAsJSON[index]));
      index++;
    }
    console.log(this.labels[0]);
    this.generateColors(this.dataLength);
    this.generateGraphs();
  }

  generateGraphs() {
    this.generateLineChart();
    this.generateBarChart();
    this.generatePieChart();
    this.generateRadarGraph();
    this.generatePolarAreaChart();
    this.generateDoughnutChart();
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
