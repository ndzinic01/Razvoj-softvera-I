import { Component, OnInit } from '@angular/core';
import { AdminDashboardService, DashboardStats } from '../../../services/admin-dashboard.service';
import { ChartConfiguration, ChartType, LineController, CategoryScale, LinearScale, Title, Tooltip,PointElement, Legend } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;

  // Chart variables
  salesChartLabels: string[] = [];
  salesChartData: ChartConfiguration<'line'>['data'] = {
    labels: this.salesChartLabels,
    datasets: [
      {
        data: [],
        label: 'Dnevna prodaja',
        fill: true,
        tension: 0.4,
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46,125,50,0.2)',
        pointBackgroundColor: '#2e7d32',
      }
    ]
  };

  salesChartType: ChartType = 'line';

  salesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      x: {type: 'category'},
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(private dashboardService: AdminDashboardService) {
  }

  ngOnInit(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (data: DashboardStats) => {
        this.stats = data;

        // Prikazivanje samo zbirne prodaje za danas
        if (data.dailySalesData && data.dailySalesData.length > 0) {
          const todaySale = data.dailySalesData.find(item => item.date === new Date().toISOString().split('T')[0]);  // Filtriraj samo današnji datum
          if (todaySale) {
            this.stats.todaySales = todaySale.amount;  // Prikazujemo samo danasnju prodaju
          }
        }

        const filteredSalesData = data.dailySalesData.filter(item => item.amount > 0);

        // Ako ima podataka za dnevnu prodaju
        if (filteredSalesData.length > 0) {
          this.salesChartData = {
            labels: filteredSalesData.map(item => item.date),
            datasets: [
              {
                data: filteredSalesData.map(item => item.amount),
                label: 'Daily sale',
                fill: true,
                tension: 0.4,
                borderColor: '#2e7d32',
                backgroundColor: (context) => {
                  const ctx = context.chart.ctx;
                  const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
                  gradient.addColorStop(0, 'rgba(46, 125, 50, 0.4)');
                  gradient.addColorStop(1, 'rgba(46, 125, 50, 0)');
                  return gradient;
                },
                pointBackgroundColor: '#2e7d32',
              }
            ]
          };
        }
      },
      error: err => console.error('Greška pri dohvatu statistike:', err)
    });
  }

}
