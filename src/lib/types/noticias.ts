export interface NoticiaItem {
  titulo: string;
  resumen: string;
  url: string;
  relevancia_eventos: string;
  formato_actividad: string;
  tipo_speaker: string;
  audiencia: string;
}

export interface DigestData {
  semana: string;
  noticias: NoticiaItem[];
}
