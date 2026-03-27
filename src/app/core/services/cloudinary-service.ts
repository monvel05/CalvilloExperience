import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../env/env';

import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  
  private cloudName = environment.cloudinary.cloudName;
  private uploadPreset = environment.cloudinary.uploadPreset;

  constructor(private http: HttpClient) {}

  async uploadImage(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('cloud_name', this.cloudName);

    try {
      // Definimos la URL de la API
      const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

      // Usamos lastValueFrom en lugar de toPromise()
      const response = await lastValueFrom(this.http.post(url, formData));
      
      return response;
    } catch (error) {
      console.error('Error subiendo imagen a Cloudinary:', error);
      throw error;
    }
  }
}