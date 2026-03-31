import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 

import { addIcons } from 'ionicons'; 
import { 
  gridOutline, peopleOutline, storefrontOutline, mapOutline, 
  barChartOutline, settingsOutline, people, airplane, storefront, cash,
  documentTextOutline, imagesOutline, restaurantOutline, bedOutline,
  busOutline, cameraOutline, logOutOutline
} from 'ionicons/icons';

import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { Chart, registerables } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

Chart.register(...registerables);

@Component({
  selector: 'app-administrador-inicio',
  templateUrl: './administrador-inicio.page.html',
  styleUrls: ['./administrador-inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdministradorInicioPage implements OnInit {

  vistaActual: string = 'dashboard';
  filtro: string = 'mes';
  listaNegocios: any[] = [];
  charts: any[] = [];

  stats: any = {
    usuarios: 0, turistas: 0, negocios: 0, ganancias: 0,
    membresias: { basica: 0, premium: 0, vip: 0 }, 
    generos: { mujeres: 0, hombres: 0, prefieroNoDecirlo: 0 } 
  };

  // Inyección moderna
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private navCtrl = inject(NavController);

  constructor() {
    addIcons({
      gridOutline, peopleOutline, storefrontOutline, mapOutline, barChartOutline, 
      settingsOutline, people, airplane, storefront, cash, documentTextOutline, 
      imagesOutline, restaurantOutline, bedOutline, busOutline, cameraOutline, logOutOutline
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cambiarVista(vista: string) {
    if (vista === 'muro-social') {
      this.router.navigate(['/muro-social']);
    } else {
      this.vistaActual = vista;
      if (vista === 'dashboard' || vista === 'usuarios') {
        setTimeout(() => this.crearGraficas(), 150); // Damos tiempo al DOM para renderizar el canvas
      }
    }
  }

  logout() {
    this.authService.logout();
  }

  getIconoCategoria(categoria: string): string {
    if (!categoria) return 'storefront-outline';
    const cat = categoria.toLowerCase();
    if (cat.includes('cenaduria') || cat.includes('restaurante')) return 'restaurant-outline';
    if (cat.includes('hospedaje') || cat.includes('hotel') || cat.includes('cabaña')) return 'bed-outline';
    if (cat.includes('transporte') || cat.includes('taxi')) return 'bus-outline';
    if (cat.includes('atractivo') || cat.includes('parque')) return 'camera-outline';
    return 'storefront-outline'; 
  }

  getClaseMembresia(membresia: string): string {
    if (!membresia) return 'badge-ninguna';
    const mem = membresia.toLowerCase();
    if (mem.includes('vip')) return 'badge-vip';
    if (mem.includes('premium')) return 'badge-premium';
    if (mem.includes('basica') || mem.includes('básica')) return 'badge-basica';
    return 'badge-ninguna';
  }

  cambiarFiltro() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.dashboardService.getUsuarios().subscribe(res => this.stats.usuarios = res?.total || 0);
    this.dashboardService.getTuristas().subscribe(res => this.stats.turistas = res?.total || 0);
    this.dashboardService.getNegocios().subscribe(res => this.stats.negocios = res?.total || 0);
    this.dashboardService.getGanancias().subscribe(res => this.stats.ganancias = res?.total || 0);

    this.dashboardService.getMembresias().subscribe(res => {
      const data = { basica: 0, premium: 0, vip: 0 };
      if (res && Array.isArray(res)) {
        res.forEach((m: any) => {
          if (m.tipo_membresia === 'Basica') data.basica = m.total;
          if (m.tipo_membresia === 'Premium') data.premium = m.total;
          if (m.tipo_membresia === 'VIP') data.vip = m.total;
        });
      }
      this.stats.membresias = data;
      setTimeout(() => { if (this.vistaActual === 'dashboard') this.crearGraficas(); }, 150);
    });

    this.dashboardService.getGeneros().subscribe(res => {
      const data = { hombres: 0, mujeres: 0, prefieroNoDecirlo: 0 };
      if (res && Array.isArray(res)) {
        res.forEach((g: any) => {
          if (g.genero === 'Hombre') data.hombres = g.total;
          if (g.genero === 'Mujer') data.mujeres = g.total;
          if (g.genero === 'Prefiero no decirlo') data.prefieroNoDecirlo = g.total;
        });
      }
      this.stats.generos = data;
    });

    this.dashboardService.getListaNegocios().subscribe(res => this.listaNegocios = res);
  }

  crearGraficas() {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];

    const canvasLinea = document.getElementById('graficaLinea') as HTMLCanvasElement;
    if (canvasLinea) {
      this.dashboardService.getGananciasMensuales().subscribe(res => {
        const labels = res.map((r: any) => `Mes ${r.mes}`);
        const data = res.map((r: any) => r.total);

        const chartLinea = new Chart(canvasLinea, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Ganancias',
              data,
              borderColor: '#f472b6', 
              backgroundColor: 'rgba(244, 114, 182, 0.2)',
              fill: true,
              tension: 0.4
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
        this.charts.push(chartLinea);
      });
    }

    const canvasDona = document.getElementById('graficaDona') as HTMLCanvasElement;
    if (canvasDona) {
      const chartDona = new Chart(canvasDona, {
        type: 'doughnut',
        data: {
          labels: ['Básica', 'Premium', 'VIP'],
          datasets: [{
            data: [this.stats.membresias.basica, this.stats.membresias.premium, this.stats.membresias.vip],
            backgroundColor: ['#a7f3d0', '#fbcfe8', '#fcd34d']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
      this.charts.push(chartDona);
    }

    const canvasTop = document.getElementById('graficaTop') as HTMLCanvasElement;
    if (canvasTop) {
      const top = [
        { nombre: 'Mirador Santa Cruz', visitas: 11 },
        { nombre: 'Hotel Gloria Calvillo', visitas: 9 },
        { nombre: 'Manglar Parque Acuático', visitas: 8 }
      ];

      const chartTop = new Chart(canvasTop, {
        type: 'bar',
        data: {
          labels: top.map(l => l.nombre),
          datasets: [{
            label: 'Visitas',
            data: top.map(l => l.visitas),
            backgroundColor: '#a7f3d0'
          }]
        },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
      });
      this.charts.push(chartTop);
    }

    const canvasGeneros = document.getElementById('graficaGeneros') as HTMLCanvasElement;
    if (canvasGeneros) {
      const chartGeneros = new Chart(canvasGeneros, {
        type: 'doughnut',
        data: {
          labels: ['Mujeres', 'Hombres', 'Prefiero no decirlo'],
          datasets: [{
            data: [this.stats.generos.mujeres, this.stats.generos.hombres, this.stats.generos.prefieroNoDecirlo], 
            backgroundColor: ['#fbcfe8', '#bfdbfe', '#e2e8f0'],
            borderWidth: 0
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%' }
      });
      this.charts.push(chartGeneros);
    }
  }

  // Funciones de exportación corregidas y dentro de la clase
  exportarPDF() {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(244, 114, 182);
    doc.text('Calvillo Experience - Reporte General', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de generación: ${fecha} | Filtro: ${this.filtro.toUpperCase()}`, 14, 28);

    doc.setDrawColor(251, 207, 232);
    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text('Resumen de Rendimiento', 14, 42);
    
    autoTable(doc, {
      startY: 46,
      head: [['Métrica', 'Total']],
      body: [
        ['Usuarios Registrados', this.stats.usuarios],
        ['Turistas', this.stats.turistas],
        ['Negocios Activos', this.stats.negocios],
        ['Ganancias Acumuladas', `$${this.stats.ganancias} MXN`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [244, 114, 182] } 
    });

    doc.text('Demografía de Usuarios', 14, (doc as any).lastAutoTable.finalY + 12);
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 16,
      head: [['Género', 'Cantidad de Usuarios']],
      body: [
        ['Mujeres', this.stats.generos.mujeres],
        ['Hombres', this.stats.generos.hombres],
        ['Prefiero no decirlo', this.stats.generos.prefieroNoDecirlo]
      ],
      theme: 'grid',
      headStyles: { fillColor: [167, 243, 208], textColor: [51, 65, 85] } 
    });

    doc.text('Directorio de Negocios', 14, (doc as any).lastAutoTable.finalY + 12);
    
    const datosNegocios = this.listaNegocios.map(n => [
      n.nombre, 
      n.categoria ? n.categoria.charAt(0).toUpperCase() + n.categoria.slice(1) : 'General', 
      n.membresia === 'Sin Membresia' ? 'Sin Membresía' : n.membresia
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 16,
      head: [['Nombre del Negocio', 'Categoría', 'Membresía']],
      body: datosNegocios.length > 0 ? datosNegocios : [['Sin datos', '-', '-']],
      theme: 'striped',
      headStyles: { fillColor: [51, 65, 85] } 
    });

    doc.save(`Reporte_Calvillo_${this.filtro}.pdf`);
  }

  exportarExcel() {
    import('xlsx').then(XLSX => {
      const wb = XLSX.utils.book_new();

      const dataResumen = [
        { Metrica: 'Usuarios Totales', Total: this.stats.usuarios },
        { Metrica: 'Turistas', Total: this.stats.turistas },
        { Metrica: 'Negocios', Total: this.stats.negocios },
        { Metrica: 'Ganancias Totales', Total: `$${this.stats.ganancias}` }
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dataResumen), 'Resumen');

      const dataGeneros = [
        { Genero: 'Mujeres', Cantidad: this.stats.generos.mujeres },
        { Genero: 'Hombres', Cantidad: this.stats.generos.hombres },
        { Genero: 'Prefiero no decirlo', Cantidad: this.stats.generos.prefieroNoDecirlo }
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dataGeneros), 'Demografía');

      const dataNegocios = this.listaNegocios.map(n => ({
        Nombre: n.nombre,
        Categoria: n.categoria ? n.categoria.charAt(0).toUpperCase() + n.categoria.slice(1) : 'General',
        Membresia: n.membresia === 'Sin Membresia' ? 'Sin Membresía' : n.membresia
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dataNegocios.length > 0 ? dataNegocios : [{Nombre: 'Sin datos'}]), 'Directorio');

      XLSX.writeFile(wb, `Reporte_Calvillo_${this.filtro}.xlsx`);
    });
  }
}