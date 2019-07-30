import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { Chart } from 'chart.js';
import { ProductDataService } from '../services/product-data.service';
import { IData } from '../dashboard/idata';
import { Router } from '@angular/router';
import { element, $ } from 'protractor';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  windowScrolled: boolean;

  users: Object;
  dataList: IData[];
  dataAsJSON: Object;
  dataKey: string;
  dataLength: number;
  dataKeys = [];

  charts = ['Line', 'Bar', 'Pie', 'Radar', 'Polar', 'Doughnut'];
  ratings = [];

  plotData: boolean = false;

  Charts = [];

  LineChart = [];
  BarChart = [];
  PieChart = [];
  RadarChart = [];
  PolarAreaChart = [];
  DoughnutChart = [];

  lineIndex = 1;
  barIndex = 2;
  pieIndex = 3;
  radarIndex = 4;
  polarIndex = 5;
  doughnutIndex = 6;

  chartPreferences = [];

  chartColors = [];
  chartBorders = [];

  labels = [];
  chartData = [];

  user;

  public graph;

  constructor(private dataService: ProductDataService, private router: Router, private zone: NgZone) { }

  ngOnInit() {
    if(this.dataService.getCurrentUser() == null) {
      this.router.navigate(['logout']);
    } else {
      this.dataService.getAllRatings();
    }
  }

  generatePlotlyGraph() {
    this.graph = {
      data: [
          { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
          { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
      ],
      layout: {width: 320, height: 240, title: 'A Fancy Plot'}
    };
  }

  generatePlotlyLinePlot() {
    const trace1 = {
      x: this.labels,
      y: this.chartData,
      type: 'scatter'
    };
    this.graph = {
      data: trace1,
      layout: {width: 640, height: 480, title: 'A Line Plot'}
    }
  }

  updateRatings() {
    let ratingElement = document.getElementById('rating' + this.lineIndex);
    let rating = ratingElement.getAttribute('ng-reflect-rate');
    if(isNaN(Number(rating))){
      rating = '0';
    }
    this.ratings.push(Number(rating));

    ratingElement = document.getElementById('rating' + this.barIndex);
    rating = ratingElement.getAttribute('ng-reflect-rate');
    if(isNaN(Number(rating))){
      rating = '0';
    }
    this.ratings.push(Number(rating));

    ratingElement = document.getElementById('rating' + this.pieIndex);
    rating = ratingElement.getAttribute('ng-reflect-rate');
    if(isNaN(Number(rating))){
      rating = '0';
    }
    this.ratings.push(Number(rating));

    ratingElement = document.getElementById('rating' + this.radarIndex);
    rating = ratingElement.getAttribute('ng-reflect-rate');
    if(isNaN(Number(rating))){
      rating = '0';
    }
    this.ratings.push(Number(rating));

    ratingElement = document.getElementById('rating' + this.polarIndex);
    rating = ratingElement.getAttribute('ng-reflect-rate');
    if(isNaN(Number(rating))){
      rating = '0';
    }
    this.ratings.push(Number(rating));

    ratingElement = document.getElementById('rating' + this.doughnutIndex);
    rating = ratingElement.getAttribute('ng-reflect-rate');
    if(isNaN(Number(rating))){
      rating = '0';
    }
    this.ratings.push(Number(rating));

    let ratingsJSONString = '{"user": "' + this.dataService.getCurrentUser() + '", ';
    let index = 0;
    while(index < this.charts.length) {
      if(index != this.charts.length - 1) {
        ratingsJSONString += '"' + this.charts[index] + '":' + this.ratings[index] + ', ';
      } else {
        ratingsJSONString += '"' + this.charts[index] + '":' + this.ratings[index] + '}';
      }
      index++;
    }
    this.uploadRatings(ratingsJSONString);
  }

  uploadRatings(jsonString){
      const ratingsData: string = JSON.parse(jsonString);
      this.dataService.addUserPreferences(ratingsData);
  }

  assignPreferences(ratingItem) {
    let preferences = [];
    let bar = ratingItem.Bar; let doughnut = ratingItem.Doughnut; let line = ratingItem.Line;
    let pie = ratingItem.Pie; let polar = ratingItem.Polar; let radar = ratingItem.Radar;
    if(bar == 0){
      bar = this.dataService.predictPreference(0);
      console.log(bar);
    } else if (doughnut == 0) {
      doughnut = this.dataService.predictPreference(1);
      console.log(doughnut);
    } else if (line == 0) {
      line = this.dataService.predictPreference(2);
      console.log(line);
    } else if (pie == 0) {
      pie = this.dataService.predictPreference(3);
      console.log(pie);
    } else if (polar == 0) {
      polar = this.dataService.predictPreference(4);
      console.log(polar);
    } else if (radar == 0) {
      radar = this.dataService.predictPreference(5);
      console.log(radar);
    }

    preferences = [['Bar', bar], ['Doughnut', doughnut], ['Line', line],
    ['Pie', pie], ['Polar', polar], ['Radar', radar]];
    return preferences;
  }

  checkUserMatch(user, ratingItem) {
    if (user === ratingItem.user) {
      return true;
    } else {
      return false;
    }
  }

  clearGraphs() {
    this.LineChart = [];
    this.BarChart = [];
    this.PieChart = [];
    this.RadarChart = [];
    this.PolarAreaChart = [];
    this.DoughnutChart = [];
  }

  updateDashboard() {
    this.clearGraphs();

    this.user = this.dataService.getCurrentUser();
    console.log(this.user);

    this.dataService.getRatingDataFromFirebase().snapshotChanges().forEach(ratingsSnapshots => {
      ratingsSnapshots.forEach(ratingsSnapshot => {
        let ratingItem = ratingsSnapshot.payload.toJSON();

        if (this.checkUserMatch(this.user, ratingItem)) {
          console.log(ratingItem);
          this.chartPreferences = this.assignPreferences(ratingItem);
          this.chartPreferences.sort(function(a, b) {
            return b[1] - a[1];
          });
          console.log(this.chartPreferences);
        }
      });
    });
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
    console.log('Generating Graphs');
    console.log(this.chartPreferences);

    if(this.chartPreferences.length == 0) {
      this.generateLineChart('chart' + (1));
      this.generateBarChart('chart' + (2));
      this.generatePieChart('chart' + (3));
      this.generateRadarGraph('chart' + (4));
      this.generatePolarAreaChart('chart' + (5));
      this.generateDoughnutChart('chart' + (6));
    }

    let index = 0;
    while (index < this.chartPreferences.length) {
      switch(this.chartPreferences[index][0]) {
        case 'Line':
          this.generateLineChart('chart' + (index + 1));
          this.lineIndex = index + 1;
          break;
        case 'Bar':
          this.generateBarChart('chart' + (index + 1));
          this.barIndex = index + 1;
          break;
        case 'Pie':
          this.generatePieChart('chart' + (index + 1));
          this.pieIndex = index + 1;
          break;
        case 'Radar':
          this.generateRadarGraph('chart' + (index + 1));
          this.radarIndex = index + 1;
          break;
        case 'Polar':
          this.generatePolarAreaChart('chart' + (index + 1));
          this.polarIndex = index + 1;
          break;
        case 'Doughnut':
            this.generateDoughnutChart('chart' + (index + 1));
            this.doughnutIndex = index + 1;
            break;
      }

      index++;
    }
    this.dataService.showAllRatings();
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

  generateBarChart(chartName){
    // Bar chart:
    this.BarChart = new Chart(chartName, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: '',
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

  generateLineChart(chartName){
    this.LineChart = new Chart(chartName, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          label: '',
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
            reponsive: true,
            maintainAspectRatio: false,
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

  combineDataAndLabelsToArray(){
    let data = [];
    for(let i = 0; i < this.chartData.length; i++) {
      data.push({ "month": this.labels[i], "sold": this.chartData[i]});
    }
    return data;
  }

  generatePieChart(chartName){
    // pie chart:
    this.PieChart = new Chart(chartName, {
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [{
          label: "",
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

  generateRadarGraph(chartName) {
    this.RadarChart = new Chart(chartName, {
      type: 'radar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: '',
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

  generatePolarAreaChart(chartName) {
    this.PolarAreaChart = new Chart(chartName, {
        type: 'polarArea',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "",
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

  generateDoughnutChart(chartName) {
    this.DoughnutChart = new Chart(chartName, {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "",
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

  addListeners(){
    let stars = document.querySelectorAll('.star');
    [].forEach.call(stars, function(star, index){
      star.addEventListener('click', (function(idx){
        console.log('adding rating on', index);
        document.querySelector('.stars').setAttribute('data-rating',  idx + 1);
        console.log('Rating is now', idx+1);
        this.setRating();
      }).bind(window,index) );
    });
  }

  setRating(){
    const stars = document.querySelectorAll('.star');
    const rating = parseInt( document.querySelector('.stars').getAttribute('data-rating'));
    [].forEach.call(stars, function(star, index){
      if(rating > index){
        star.classList.add('rated');
        console.log('added rated on', index );
      }else{
        star.classList.remove('rated');
        console.log('removed rated on', index );
      }
    });
  }

  scrollToTop() {
    (function smoothscroll() {
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(smoothscroll);
            window.scrollTo(0, currentScroll - (currentScroll / 8));
        }
    })();
  }

  @HostListener("window:scroll", [])
    onWindowScroll() {
        if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
            this.windowScrolled = true;
        } 
       else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
            this.windowScrolled = false;
        }
    }

}
