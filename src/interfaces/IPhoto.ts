export interface IPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  cloudinary_public_id: string;
  location: {
    lat: number;
    lng: number;
  };
  date: string;
  category: string;
  gear: string | null;
  settings_used: string | null;
}