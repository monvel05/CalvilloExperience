import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { AuthService } from 'src/app/core/services/auth.service';

// IMPORTANTE: Importamos el módulo y servicio bilingüe
import { TranslateModule, TranslateService } from '@ngx-translate/core'; 
import { catchError, forkJoin, of } from 'rxjs';

import { addIcons } from 'ionicons'; 
import { 
  gridOutline, peopleOutline, storefrontOutline, mapOutline, 
  barChartOutline, settingsOutline, people, airplane, 
  storefront, cash, documentTextOutline, imagesOutline, 
  restaurantOutline, bedOutline, busOutline, cameraOutline, logOutOutline
} from 'ionicons/icons';

import { DashboardService } from '../../core/services/dashboard.service';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

Chart.register(...registerables);

@Component({
  selector: 'app-administrador-inicio',
  templateUrl: './administrador-inicio.page.html',
  styleUrls: ['./administrador-inicio.page.scss'],
  standalone: true,
  // Agregamos TranslateModule a los imports
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule] 
})
export class AdministradorInicioPage implements OnInit {
  private authService = inject(AuthService);
  private translate = inject(TranslateService); // Inyectamos el servicio bilingüe

  vistaActual: string = 'dashboard';

  stats: any = {
    usuarios: 0, turistas: 0, negocios: 0, ganancias: 0,
    membresias: { basica: 0, premium: 0, vip: 0 }, 
    generos: { mujeres: 0, hombres: 0, prefieroNoDecirlo: 0 } 
  };

  charts: any[] = [];
  filtro: string = 'mes';
  listaNegocios: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {
    addIcons({
      'grid-outline': gridOutline, 'people-outline': peopleOutline, 'storefront-outline': storefrontOutline,
      'map-outline': mapOutline, 'bar-chart-outline': barChartOutline, 'settings-outline': settingsOutline,
      'people': people, 'airplane': airplane, 'storefront': storefront, 'cash': cash,
      'document-text-outline': documentTextOutline, 'images-outline': imagesOutline,
      'restaurant-outline': restaurantOutline, 'bed-outline': bedOutline, 'bus-outline': busOutline,
      'camera-outline': cameraOutline, 'log-out-outline': logOutOutline
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cambiarVista(vista: string) {
    if (vista === 'muro-social') {
      this.router.navigate(['/muro-social']);
    } else if (vista === 'configuracion') {
      this.router.navigate(['/perfil']);
    } else {
      this.vistaActual = vista;
      if (vista === 'dashboard' || vista === 'usuarios') {
        setTimeout(() => this.crearGraficas(), 100);
      }
    }
  }

  getIconoCategoria(categoria: string): string {
    const cat = categoria.toLowerCase();
    if (cat.includes('cenaduria') || cat.includes('restaurant')) return 'restaurant-outline';
    if (cat.includes('hospedaje') || cat.includes('hotel')) return 'bed-outline';
    if (cat.includes('transporte') || cat.includes('transport')) return 'bus-outline';
    if (cat.includes('atractivo') || cat.includes('attraction')) return 'camera-outline';
    return 'storefront-outline'; 
  }

  getClaseMembresia(membresia: string): string {
    const mem = membresia.toLowerCase();
    if (mem.includes('vip')) return 'badge-vip';
    if (mem.includes('premium')) return 'badge-premium';
    if (mem.includes('basica') || mem.includes('básica') || mem.includes('basic')) return 'badge-basica';
    return 'badge-ninguna';
  }

  cambiarFiltro() {
    this.cargarDatos();
  }

  cargarDatos() {
    const peticionSegura = (peticion: any) => peticion.pipe(
      catchError(err => {
        console.error('Fallo una petición:', err);
        return of(null); 
      })
    );

    forkJoin({
      usuarios: peticionSegura(this.dashboardService.getUsuarios(this.filtro)),
      turistas: peticionSegura(this.dashboardService.getTuristas(this.filtro)),
      negocios: peticionSegura(this.dashboardService.getNegocios(this.filtro)),
      ganancias: peticionSegura(this.dashboardService.getGanancias(this.filtro)),
      membresias: peticionSegura(this.dashboardService.getMembresias(this.filtro)),
      generos: peticionSegura(this.dashboardService.getGeneros(this.filtro)),
      lista: peticionSegura(this.dashboardService.getListaNegocios(this.filtro))
    }).subscribe({
      next: (res: any) => {
        this.stats.usuarios = res.usuarios?.total || 0;
        this.stats.turistas = res.turistas?.total || 0;
        this.stats.negocios = res.negocios?.total || 0;
        this.stats.ganancias = res.ganancias?.total || 0;

        const dataMembresias = { basica: 0, premium: 0, vip: 0 };
        if (res.membresias && Array.isArray(res.membresias)) {
          res.membresias.forEach((m: any) => {
            if (m.tipo_membresia === 'Basica') dataMembresias.basica = m.total;
            if (m.tipo_membresia === 'Premium') dataMembresias.premium = m.total;
            if (m.tipo_membresia === 'VIP') dataMembresias.vip = m.total;
          });
        }
        this.stats.membresias = dataMembresias;

        const dataGeneros = { hombres: 0, mujeres: 0, prefieroNoDecirlo: 0 };
        if (res.generos && Array.isArray(res.generos)) {
          res.generos.forEach((g: any) => {
            if (g.genero === 'Hombre') dataGeneros.hombres = g.total;
            if (g.genero === 'Mujer') dataGeneros.mujeres = g.total;
            if (g.genero === 'Prefiero no decirlo') dataGeneros.prefieroNoDecirlo = g.total;
          });
        }
        this.stats.generos = dataGeneros;
        this.listaNegocios = res.lista || [];

        setTimeout(() => {
          if (this.vistaActual === 'dashboard' || this.vistaActual === 'usuarios') {
            this.crearGraficas();
          }
        }, 100);
      }
    });
  }

  crearGraficas() {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];

    const canvasLinea = document.getElementById('graficaLinea') as HTMLCanvasElement;
    if (canvasLinea) {
      this.dashboardService.getGananciasMensuales(this.filtro).subscribe(res => {
        // Traducción dinámica de la etiqueta "Mes"
        const labels = res.map((r: any) => `${this.translate.instant('ADMIN.MONTH')} ${r.mes}`);
        const data = res.map((r: any) => r.total);

        const chartLinea = new Chart(canvasLinea, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: this.translate.instant('ADMIN.EARNINGS'),
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
          labels: [
            this.translate.instant('ADMIN.MEMBERSHIP.BASIC'), 
            this.translate.instant('ADMIN.MEMBERSHIP.PREMIUM'), 
            this.translate.instant('ADMIN.MEMBERSHIP.VIP')
          ],
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
            label: this.translate.instant('ADMIN.VISITS'),
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
          labels: [
            this.translate.instant('ADMIN.GENDERS.WOMEN'), 
            this.translate.instant('ADMIN.GENDERS.MEN'), 
            this.translate.instant('ADMIN.GENDERS.PREFER_NOT_SAY')
          ],
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

  exportarPDF() {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString(this.translate.currentLang === 'en' ? 'en-US' : 'es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(244, 114, 182);
    doc.text(`Calvillo Experience - ${this.translate.instant('ADMIN.REPORT_TITLE')}`, 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(`${this.translate.instant('ADMIN.GENERATION_DATE')}: ${fecha} | ${this.translate.instant('ADMIN.FILTER')}: ${this.filtro.toUpperCase()}`, 14, 28);

    doc.setDrawColor(251, 207, 232);
    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text(this.translate.instant('ADMIN.PERFORMANCE_SUMMARY'), 14, 42);
    
    autoTable(doc, {
      startY: 46,
      head: [[this.translate.instant('ADMIN.METRIC'), this.translate.instant('ADMIN.TOTAL')]],
      body: [
        [this.translate.instant('ADMIN.REGISTERED_USERS'), this.stats.usuarios],
        [this.translate.instant('ADMIN.TOURISTS'), this.stats.turistas],
        [this.translate.instant('ADMIN.ACTIVE_BUSINESSES'), this.stats.negocios],
        [this.translate.instant('ADMIN.ACCUMULATED_EARNINGS'), `$${this.stats.ganancias}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [244, 114, 182] }
    });

    doc.text(this.translate.instant('ADMIN.USER_DEMOGRAPHICS'), 14, (doc as any).lastAutoTable.finalY + 12);
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 16,
      head: [[this.translate.instant('ADMIN.GENDER'), this.translate.instant('ADMIN.USER_AMOUNT')]],
      body: [
        [this.translate.instant('ADMIN.GENDERS.WOMEN'), this.stats.generos.mujeres],
        [this.translate.instant('ADMIN.GENDERS.MEN'), this.stats.generos.hombres],
        [this.translate.instant('ADMIN.GENDERS.PREFER_NOT_SAY'), this.stats.generos.prefieroNoDecirlo]
      ],
      theme: 'grid',
      headStyles: { fillColor: [167, 243, 208], textColor: [51, 65, 85] }
    });

    doc.text(this.translate.instant('ADMIN.BUSINESS_DIRECTORY'), 14, (doc as any).lastAutoTable.finalY + 12);
    
    const datosNegocios = this.listaNegocios.map(n => [
      n.nombre, 
      n.categoria.charAt(0).toUpperCase() + n.categoria.slice(1), 
      n.membresia === 'Sin Membresia' ? this.translate.instant('ADMIN.NO_MEMBERSHIP') : n.membresia
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 16,
      head: [[this.translate.instant('ADMIN.BUSINESS_NAME'), this.translate.instant('ADMIN.CATEGORY'), this.translate.instant('ADMIN.MEMBERSHIP_TITLE')]],
      body: datosNegocios.length > 0 ? datosNegocios : [[this.translate.instant('ADMIN.NO_DATA'), '-', '-']],
      theme: 'striped',
      headStyles: { fillColor: [51, 65, 85] }
    });

    doc.save(`Report_${this.filtro}.pdf`);
  }

  exportarExcel() {
    import('xlsx').then(XLSX => {
      const wb = XLSX.utils.book_new();

      const dataResumen = [
        { Metrica: this.translate.instant('ADMIN.TOTAL_USERS'), Total: this.stats.usuarios },
        { Metrica: this.translate.instant('ADMIN.TOURISTS'), Total: this.stats.turistas },
        { Metrica: this.translate.instant('ADMIN.BUSINESSES'), Total: this.stats.negocios },
        { Metrica: this.translate.instant('ADMIN.TOTAL_EARNINGS'), Total: `$${this.stats.ganancias}` }
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dataResumen), this.translate.instant('ADMIN.SUMMARY'));

      const dataGeneros = [
        { Genero: this.translate.instant('ADMIN.GENDERS.WOMEN'), Cantidad: this.stats.generos.mujeres },
        { Genero: this.translate.instant('ADMIN.GENDERS.MEN'), Cantidad: this.stats.generos.hombres },
        { Genero: this.translate.instant('ADMIN.GENDERS.PREFER_NOT_SAY'), Cantidad: this.stats.generos.prefieroNoDecirlo }
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dataGeneros), this.translate.instant('ADMIN.DEMOGRAPHICS'));

      const dataNegocios = this.listaNegocios.map(n => ({
        Nombre: n.nombre,
        Categoria: n.categoria.charAt(0).toUpperCase() + n.categoria.slice(1),
        Membresia: n.membresia === 'Sin Membresia' ? this.translate.instant('ADMIN.NO_MEMBERSHIP') : n.membresia
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dataNegocios.length > 0 ? dataNegocios : [{Nombre: this.translate.instant('ADMIN.NO_DATA')}]), this.translate.instant('ADMIN.DIRECTORY'));

      XLSX.writeFile(wb, `Report_${this.filtro}.xlsx`);
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}