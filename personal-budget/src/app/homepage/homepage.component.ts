import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  private chartInstance: Chart | undefined; // Store chart instance
  public dataSource: any = {
    datasets: [
        {
            data: [],
            backgroundColor: [
                "#FF5733",  
                "#33FF57",  
                "#3357FF",  
                "#FF33A6",  
                "#FFD700",  
                "#800080",  
                "#00CED1"   
            ]
        }
    ],
    labels: []
};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget')
    .subscribe((res: any) => { 
      console.log(this.dataSource);
      for (var i = 0; i < res.myBudget.length; i++) {
      this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
      this.dataSource.labels[i] = res.myBudget[i].title;
      
    }
    this.createChart();
    });
  }

  createChart() {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: this.dataSource
        });
      } else {
        console.error('2D context is not available for the canvas element');
      }
    } else {
      console.error('Canvas element with id "myChart" not found');
    }
  }
}
