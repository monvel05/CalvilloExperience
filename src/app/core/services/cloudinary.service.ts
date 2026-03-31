import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../env/env';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  
  private cloudName = environment.cloudinary.cloudName;
  private uploadPreset = environment.cloudinary.uploadPreset;
  
  // Inyección moderna
  private http = inject(HttpClient);

  async uploadImage(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('cloud_name', this.cloudName);

    try {
      const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
      const response = await lastValueFrom(this.http.post(url, formData));
      return response;
    } catch (error) {
      console.error('Error subiendo imagen a Cloudinary:', error);
      throw error;
    }
  }
}