// src/types/glam.ts

/**
 * Interfaz para un ítem/record GLAM
 */
export interface GLAMRecord {
  id: number | string;
  author?: string;
  children?: any[];
  collection_id?: number | string;
  collection_title?: string;
  collections?: number[];
  collections_titles?: string;
  commit_message?: string | null;
  date?: string;
  description?: string;
  groups?: any[];
  is_archived?: boolean;
  last_commit_message?: string | null;
  last_version_number?: number;
  media_items?: number[];
  messages?: any[];
  metadata_fields?: Record<string, any>;
  metadata_fields_order?: string[];
  ocr_data?: any | null;
  ontology_versions?: number[];
  owner_user_id?: number | null;
  parent?: any | null;
  parents?: any[];
  published?: boolean;
  resource_class?: number;
  resource_class_id?: number;
  sites?: number[];
  template?: number;
  template_id?: number;
  thumbnail?: string; // URL de la miniatura
  thumbnail_attachment?: any | null;
  thumbnail_attachment_id?: number | null;
  thumbnail_media?: any | null;
  thumbnail_media_id?: number | null;
  title: string;
  type?: any | null;
  versions?: number[];
  imageUrl?: string; // Podríamos mapear thumbnail aquí
  creator?: string | string[]; // Mapear desde author
  imageUrlFull?: string; // Para almacenar la URL completa de la imagen
  type_label?: string
  institution_label?: string
  collection_label?: string
  format_label?: string
  language_label?: string
  subject_labels?: string[]
  [key: string]: any
}

/**
 * Interfaz para una colección GLAM
 */
export interface GLAMCollection {
  id: number | string;
  name: string;
  title: string;
  description?: string;
  institution?: string;
  itemCount?: number;
  records?: GLAMRecord[];
  type?: string;
  date?: string;
  metadata?: Record<string, any>;
  type_label?: string
  institution_label?: string
  [key: string]: any
  
  // Campos según la estructura real de la API GLAM
  author: string | null;
  children: number[]; // Array de IDs de los ítems en la colección
  commit_message: string | null;
  groups: any[];
  is_archived: boolean;
  last_commit_message: string | null;
  last_version_number: number;
  messages: any[];
  metadata_fields: Record<string, any>;
  metadata_fields_order: string[];
  ontology_versions: number[];
  owner_user_id: number | null;
  parent: any | null;
  parent_id: number | null;
  parents: any[];
  published: boolean;
  resource_class: number | null;
  resource_class_id: number | null;
  sites: number[];
  template: number;
  template_id: number;
  thumbnail: string;
  thumbnail_attachment: any | null;
  thumbnail_attachment_id: number | null;
  thumbnail_media: any | null;
  thumbnail_media_id: number | null;
  versions: number[];
}

/**
 * Interfaz para la respuesta paginada de la API
 */
export interface GLAMApiResponse<T> {
  items: T[];
  total?: number;
  page?: number;
  pageSize?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  labels_info?: Record<string,any>
}

/**
 * Opciones de búsqueda/filtros
 */
export interface GLAMSearchOptions {
  query?: string
  type?: string
  institution?: string
  collection?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
  filters?: GLAMFilter[]
  withLabels?: boolean
}

/**
 * Filtro para la API GLAM
 */
export interface GLAMFilter {
  field: string
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'like'
  value: string | number | boolean
  label?: string
}

/**
 * Estados de carga
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'