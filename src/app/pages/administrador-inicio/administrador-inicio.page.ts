import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons } from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { gridOutline, peopleOutline, storefrontOutline, mapOutline, barChartOutline, settingsOutline, people, airplane, storefront, cash, documentTextOutline, imagesOutline, restaurantOutline, bedOutline, busOutline, cameraOutline } from 'ionicons/icons';

@Component({
  selector: 'app-administrador-inicio',
  templateUrl: './administrador-inicio.page.html',
  styleUrls: ['./administrador-inicio.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons]
})
export class AdministradorInicioPage implements OnInit {

  vistaActual: string = 'dashboard';

  cambiarVista(vista: string) {
    this.vistaActual = vista;
  }

  stats: any = {
    usuarios: 0,
    turistas: 0,
    negocios: 0,
    ganancias: 0,
    membresias: {
      basica: 0,
      premium: 0,
      vip: 0,
      }, 
    generos: { mujeres: 0, hombres: 0, prefieroNoDecirlo: 0 } 
  };

  charts: any[] = [];
  filtro: string = 'mes';
  listaNegocios: any[] = [];

  constructor(
    private authService: AuthService, 
    private dashboardService: DashboardService,
    private router: Router
  ) {
    addIcons({
      'grid-outline': gridOutline,
      'people-outline': peopleOutline,
      'storefront-outline': storefrontOutline,
      'map-outline': mapOutline,
      'bar-chart-outline': barChartOutline,
      'settings-outline': settingsOutline,
      'people': people,
      'airplane': airplane,
      'storefront': storefront,
      'cash': cash,
      'document-text-outline': documentTextOutline,
      'images-outline': imagesOutline,
      'restaurant-outline': restaurantOutline,
      'bed-outline': bedOutline,
      'bus-outline': busOutline,
      'camera-outline': cameraOutline
    });
  }
  ngOnInit() {
    
  }

cerrarSesion() {
  this.authService.logout();
}

exportarPDF() {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

    // 1. Encabezado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(244, 114, 182); // Rosa del dashboard
    doc.text('Calvillo Experience - Reporte General', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de generación: ${fecha} | Filtro: ${this.filtro.toUpperCase()}`, 14, 28);

    doc.setDrawColor(251, 207, 232);
    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32);

    // 2. Tabla de Resumen (KPIs)
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
      headStyles: { fillColor: [244, 114, 182] } // Encabezado rosa
    });

    // 3. Tabla de Demografía (Géneros)
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
      headStyles: { fillColor: [167, 243, 208], textColor: [51, 65, 85] } // Encabezado menta
    });

    // 4. Tabla del Directorio de Negocios
    doc.text('Directorio de Negocios', 14, (doc as any).lastAutoTable.finalY + 12);
    
    const datosNegocios = this.listaNegocios.map(n => [
      n.nombre, 
      n.categoria.charAt(0).toUpperCase() + n.categoria.slice(1), 
      n.membresia === 'Sin Membresia' ? 'Sin Membresía' : n.membresia
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 16,
      head: [['Nombre del Negocio', 'Categoría', 'Membresía']],
      body: datosNegocios.length > 0 ? datosNegocios : [['Sin datos', '-', '-']],
      theme: 'striped',
      headStyles: { fillColor: [51, 65, 85] } // Encabezado oscuro
    });

    // Generar archivo
    doc.save(`Reporte_Calvillo_${this.filtro}.pdf`);
  }

  exportarExcel() {
    import('xlsx').then(XLSX => {
      const wb = XLSX.utils.book_new();

      // Hoja 1: Resumen General
      const dataResumen = [
        { Metrica: 'Usuarios Totales', Total: this.stats.usuarios },
        { Metrica: 'Turistas', Total: this.stats.turistas },
        { Metrica: 'Negocios', Total: this.stats.negocios },
        { Metrica: 'Ganancias Totales', Total: `$${this.stats.ganancias}` }
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dataResumen), 'Resumen');

      // Hoja 2: Demografía
      const dataGeneros = [
        { Genero: 'Mujeres', Cantidad: this.stats.generos.mujeres },
        { Genero: 'Hombres', Cantidad: this.stats.generos.hombres },
        { Genero: 'Prefiero no decirlo', Cantidad: this.stats.generos.prefieroNoDecirlo }
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dataGeneros), 'Demografía');

      // Hoja 3: Directorio de Negocios
      const dataNegocios = this.listaNegocios.map(n => ({
        Nombre: n.nombre,
        Categoria: n.categoria.charAt(0).toUpperCase() + n.categoria.slice(1),
        Membresia: n.membresia === 'Sin Membresia' ? 'Sin Membresía' : n.membresia
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dataNegocios.length > 0 ? dataNegocios : [{Nombre: 'Sin datos'}]), 'Directorio');

      // Generar archivo
      XLSX.writeFile(wb, `Reporte_Calvillo_${this.filtro}.xlsx`);
    });
}
}