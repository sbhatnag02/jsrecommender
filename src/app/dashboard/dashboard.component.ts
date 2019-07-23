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

  Charts = [];

  LineChart = [];
  BarChart = [];
  PieChart = [];
  chartColors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(149, 255, 0, 0.2)',
    'rgba(255, 229, 0, 0.2)',
    'rgba(0, 149, 255, 0.2)',
    'rgba(255, 247, 0, 0.2)',
    'rgba(255, 72, 0, 0.2)',
    'rgba(127, 0, 255, 0.2)'
  ];
  chartBorders = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(149, 255, 0, 1)',
    'rgba(255, 229, 0, 1)',
    'rgba(0, 149, 255, 1)',
    'rgba(255, 247, 0, 1)',
    'rgba(255, 72, 0, 1)',
    'rgba(127, 0, 255, 1)'
  ];

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
        label: 'Number of Items Sold in Months',
        data: this.chartData,
        backgroundColor: this.chartColors,
        borderColor: this.chartBorders,
        borderWidth: 1
    }]
    },
    options: {
    title: {
        text:'Pie Chart',
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
    this.Charts.push(this.PieChart);
  }

  getDataList() {
    this.dataLength = 0;
    this.dataService.getDataFromFirebase().snapshotChanges().forEach(dataSnapshots => {
      this.dataList = [];
      dataSnapshots.forEach(dataSnapshot => {
        let dataItem = dataSnapshot.payload.val();
        this.dataAsJSON = dataSnapshot.payload.toJSON();
        console.log(this.dataAsJSON);

        this.dataLength = Object.keys(this.dataAsJSON).length;
        console.log(this.dataLength);

        console.log(this.dataAsJSON[7].Month);
        console.log(this.dataAsJSON[7].Sold);
        console.log(this.dataAsJSON[15] == null);

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
        this.labels.push(this.dataAsJSON[index].Month);
        this.chartData.push(this.dataAsJSON[index].Sold);
      }
      console.log(index);
      index++;
    }
    console.log(this.labels[0]);
    this.generateColors(this.dataLength);
    this.generateLineChart();
    this.generateBarChart();
    this.generatePieChart();
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

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
