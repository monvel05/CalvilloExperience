export interface Lugar {
  title: string;           
  id: string;              
  resultType?: string;     
  address?: {
    label: string;         
    city?: string;
    district?: string;
  };
  position: {           
    lat: number;
    lng: number;
  };
  distance?: number;       
}