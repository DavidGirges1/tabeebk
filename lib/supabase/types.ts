export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      doctors: {
        Row: {
          address_ar: string | null;
          created_at: string;
          doctor_name_ar: string;
          governorate_id: number;
          id: number;
          notes_ar: string | null;
          phones: string | null;
          specialty_ar: string | null;
        };
        Insert: {
          address_ar?: string | null;
          created_at?: string;
          doctor_name_ar: string;
          governorate_id: number;
          id?: number;
          notes_ar?: string | null;
          phones?: string | null;
          specialty_ar?: string | null;
        };
        Update: {
          address_ar?: string | null;
          created_at?: string;
          doctor_name_ar?: string;
          governorate_id?: number;
          id?: number;
          notes_ar?: string | null;
          phones?: string | null;
          specialty_ar?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "doctors_governorate_id_fkey";
            columns: ["governorate_id"];
            isOneToOne: false;
            referencedRelation: "governorates";
            referencedColumns: ["id"];
          },
        ];
      };
      governorates: {
        Row: {
          id: number;
          name_ar: string;
          region: string | null;
        };
        Insert: {
          id?: number;
          name_ar: string;
          region?: string | null;
        };
        Update: {
          id?: number;
          name_ar?: string;
          region?: string | null;
        };
        Relationships: [];
      };
      providers: {
        Row: {
          address_ar: string | null;
          created_at: string;
          governorate_id: number;
          id: number;
          name_ar: string;
          notes_ar: string | null;
          phones: string | null;
          provider_type: Database["public"]["Enums"]["provider_type_enum"];
          specialty_ar: string | null;
        };
        Insert: {
          address_ar?: string | null;
          created_at?: string;
          governorate_id: number;
          id?: number;
          name_ar: string;
          notes_ar?: string | null;
          phones?: string | null;
          provider_type: Database["public"]["Enums"]["provider_type_enum"];
          specialty_ar?: string | null;
        };
        Update: {
          address_ar?: string | null;
          created_at?: string;
          governorate_id?: number;
          id?: number;
          name_ar?: string;
          notes_ar?: string | null;
          phones?: string | null;
          provider_type?: Database["public"]["Enums"]["provider_type_enum"];
          specialty_ar?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "providers_governorate_id_fkey";
            columns: ["governorate_id"];
            isOneToOne: false;
            referencedRelation: "governorates";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      provider_type_enum:
        | "hospital"
        | "eye_center"
        | "radiology"
        | "lab"
        | "pharmacy"
        | "physical_therapy"
        | "clinic";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type ProviderTypeEnum = Database["public"]["Enums"]["provider_type_enum"];

export type Governorate = Tables<"governorates">;
export type Provider = Tables<"providers">;
export type Doctor = Tables<"doctors">;

export type ProviderWithGovernorate = Provider & {
  governorates?: Governorate | null;
};

export type DoctorWithGovernorate = Doctor & {
  governorates?: Governorate | null;
};
