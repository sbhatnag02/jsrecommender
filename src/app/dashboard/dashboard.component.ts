import { Component, OnInit } from '@angular/core';
import {TestImageDataService} from '../test-jsonhttp-data';
import { Chart } from 'chart.js';
import firebase from 'firebase';
import { ProductDataService } from '../services/product-data.service';
import { DataObj } from '../file-upload/data-obj';
import { IData } from '../dashboard/idata';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  users: Object;
  dataList: IData[];

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

  labels = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  chartData = [9, 7, 3, 5, 2, 10, 15, 16, 19, 3, 1, 9];

  constructor(private dataService: ProductDataService) { }

  ngOnInit() {

    // this.data.getUsers().subscribe(data => {
    //     this.users = data;
    //     console.log(this.users);
    //   }
    // );

    this.generateLineChart();
    this.generateBarChart();
    this.generatePieChart();
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
  }

  getDataList() {
    this.dataService.getDataFromFirebase().snapshotChanges().forEach(dataSnapshots => {
      this.dataList = [];
      dataSnapshots.forEach(dataSnapshot => {
        let dataItem = dataSnapshot.payload.val();
        console.log(dataItem[1]);
        dataItem['$key'] = dataSnapshot.key;
        this.dataList.push(dataItem as IData);
      });
    });
  }

}
