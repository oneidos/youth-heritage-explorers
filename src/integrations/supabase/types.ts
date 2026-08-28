export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string
          guide_id: string
          id: string
          itinerary_id: string
          message: string | null
          status: string
          visit_date: string
          visit_time: string
          visitor_id: string
        }
        Insert: {
          created_at?: string
          guide_id: string
          id?: string
          itinerary_id: string
          message?: string | null
          status?: string
          visit_date: string
          visit_time: string
          visitor_id: string
        }
        Update: {
          created_at?: string
          guide_id?: string
          id?: string
          itinerary_id?: string
          message?: string | null
          status?: string
          visit_date?: string
          visit_time?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fsl_hours: {
        Row: {
          activity_date: string
          booking_id: string | null
          created_at: string
          guide_id: string
          hours: number
          id: string
          note: string | null
        }
        Insert: {
          activity_date?: string
          booking_id?: string | null
          created_at?: string
          guide_id: string
          hours?: number
          id?: string
          note?: string | null
        }
        Update: {
          activity_date?: string
          booking_id?: string | null
          created_at?: string
          guide_id?: string
          hours?: number
          id?: string
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fsl_hours_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fsl_hours_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      itineraries: {
        Row: {
          city: string
          created_at: string
          description: string | null
          duration_minutes: number
          guide_id: string
          id: string
          meeting_point: string
          title: string
        }
        Insert: {
          city: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          guide_id: string
          id?: string
          meeting_point: string
          title: string
        }
        Update: {
          city?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          guide_id?: string
          id?: string
          meeting_point?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "itineraries_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_stops: {
        Row: {
          description: string | null
          id: string
          itinerary_id: string
          position: number
          title: string
        }
        Insert: {
          description?: string | null
          id?: string
          itinerary_id: string
          position?: number
          title: string
        }
        Update: {
          description?: string | null
          id?: string
          itinerary_id?: string
          position?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_stops_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accessible_tours: boolean
          active_role: string
          age: number | null
          availability: string | null
          bio: string | null
          city: string | null
          created_at: string
          display_name: string
          favorite_places: string | null
          fsl_enabled: boolean
          fsl_interested: boolean
          gender: string | null
          guide_onboarded: boolean
          id: string
          interests: string[]
          is_demo: boolean
          languages: string[]
          school: string | null
          updated_at: string
          visitor_onboarded: boolean
        }
        Insert: {
          accessible_tours?: boolean
          active_role?: string
          age?: number | null
          availability?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          display_name?: string
          favorite_places?: string | null
          fsl_enabled?: boolean
          fsl_interested?: boolean
          gender?: string | null
          guide_onboarded?: boolean
          id: string
          interests?: string[]
          is_demo?: boolean
          languages?: string[]
          school?: string | null
          updated_at?: string
          visitor_onboarded?: boolean
        }
        Update: {
          accessible_tours?: boolean
          active_role?: string
          age?: number | null
          availability?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          display_name?: string
          favorite_places?: string | null
          fsl_enabled?: boolean
          fsl_interested?: boolean
          gender?: string | null
          guide_onboarded?: boolean
          id?: string
          interests?: string[]
          is_demo?: boolean
          languages?: string[]
          school?: string | null
          updated_at?: string
          visitor_onboarded?: boolean
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_name: string | null
          booking_id: string | null
          comment: string | null
          created_at: string
          guide_id: string
          id: string
          rating: number
          visitor_id: string
        }
        Insert: {
          author_name?: string | null
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          guide_id: string
          id?: string
          rating: number
          visitor_id: string
        }
        Update: {
          author_name?: string | null
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          guide_id?: string
          id?: string
          rating?: number
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stamps: {
        Row: {
          awarded_at: string
          booking_id: string | null
          city: string
          id: string
          itinerary_title: string | null
          visitor_id: string
        }
        Insert: {
          awarded_at?: string
          booking_id?: string | null
          city: string
          id?: string
          itinerary_title?: string | null
          visitor_id: string
        }
        Update: {
          awarded_at?: string
          booking_id?: string | null
          city?: string
          id?: string
          itinerary_title?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stamps_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stamps_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      visit_photos: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          storage_path: string
          visitor_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          storage_path: string
          visitor_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          storage_path?: string
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visit_photos_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visit_photos_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
