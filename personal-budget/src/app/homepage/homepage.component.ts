import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { DataService } from '../data.service';
import * as d3 from 'd3';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  public svg: any;
  public dataSource: any;

  constructor(private http: HttpClient, public dataservice: DataService) {}

  ngOnInit(): void {
    setTimeout(() =>{
      this.dataSource = this.dataservice.dataSource;
      console.log(this.dataSource);
      this.createChart();
      this.createD3Chart();
    },50);

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

  createD3Chart() {
    const width = 600;
    const height = 300;
    const radius = Math.min(width, height) / 2;
  
    // Clear previous SVG content
    d3.select('svg').selectAll('*').remove();
  
    // Set up SVG
    this.svg = d3.select('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
  
    // Set up color scale
    const color = d3.scaleOrdinal()
      .domain(this.dataSource.labels)
      .range(this.dataSource.datasets[0].backgroundColor);
  
    // Create an arc generator for the donut chart
    const arc = d3.arc()
      .innerRadius(radius * 0.5)  // Set inner radius for the donut hole
      .outerRadius(radius);
  
    // Create an arc generator for the lines and labels, a bit larger than the main arc
    const outerArc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 1.1);  // Position labels slightly outside the chart
  
    // Create a pie generator
    const pie = d3.pie()
      .value((d: any) => d.value)
      .sort(null);
  
    // Prepare data for D3 pie chart
    const pieData = pie(this.dataSource.datasets[0].data.map((d: any, i: number) => ({
      label: this.dataSource.labels[i], value: d
    })));
  
    // Append the donut chart arcs
    this.svg.selectAll('path')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', (d: any) => color(d.data.label))
      .attr('stroke', '#ffffff')
      .style('stroke-width', '2px');
  
    // Add leader lines from pie slices to labels
    this.svg.selectAll('polyline')
      .data(pieData)
      .enter()
      .append('polyline')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('points', (d: any) => {
        const posA = arc.centroid(d);       // Position at the arc
        const posB = outerArc.centroid(d);  // Position for the outer arc
        const posC = outerArc.centroid(d);  // Position where the label will be placed
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        posC[0] = radius * 1.2 * (midAngle < Math.PI ? 1 : -1); // Adjust x based on the angle
        return [posA, posB, posC];  // Line goes from slice to outer arc to label position
      });
  
    // Append text labels to the outside of the chart
    this.svg.selectAll('text')
      .data(pieData)
      .enter()
      .append('text')
      .text((d: any) => d.data.label)
      .attr('transform', (d: any) => {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 1.2 * (midAngle < Math.PI ? 1 : -1);  // Position label based on side
        return 'translate(' + pos + ')';
      })
      .style('text-anchor', (d: any) => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? 'start' : 'end';  // Align labels to the left or right
      })
      .style('font-size', '12px');
  }
}
