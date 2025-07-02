export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      feedback: {
        Row: {
          created_at: string
          description: string
          id: string
          status: Database["public"]["Enums"]["feedback_status"] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          status?: Database["public"]["Enums"]["feedback_status"] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          status?: Database["public"]["Enums"]["feedback_status"] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      nfc_codes: {
        Row: {
          assigned_at: string | null
          assigned_to: string | null
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_hidden: boolean | null
          redirect_url: string | null
          review_type: string | null
          title: string | null
          type: string
          url: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_to?: string | null
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_hidden?: boolean | null
          redirect_url?: string | null
          review_type?: string | null
          title?: string | null
          type?: string
          url?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_to?: string | null
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_hidden?: boolean | null
          redirect_url?: string | null
          review_type?: string | null
          title?: string | null
          type?: string
          url?: string | null
        }
        Relationships: []
      }
      nfc_profiles: {
        Row: {
          background_color: string | null
          bio: string | null
          button_color: string | null
          button_text_color: string | null
          code_id: string
          company: string | null
          created_at: string
          email: string | null
          facebook_url: string | null
          full_name: string | null
          id: string
          instagram_url: string | null
          job_title: string | null
          linkedin_url: string | null
          logo_url: string | null
          phone: string | null
          text_color: string | null
          tiktok_url: string | null
          twitter_url: string | null
          updated_at: string
          user_id: string
          website: string | null
          youtube_embed_url: string | null
          youtube_url: string | null
        }
        Insert: {
          background_color?: string | null
          bio?: string | null
          button_color?: string | null
          button_text_color?: string | null
          code_id: string
          company?: string | null
          created_at?: string
          email?: string | null
          facebook_url?: string | null
          full_name?: string | null
          id?: string
          instagram_url?: string | null
          job_title?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          phone?: string | null
          text_color?: string | null
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
          youtube_embed_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          background_color?: string | null
          bio?: string | null
          button_color?: string | null
          button_text_color?: string | null
          code_id?: string
          company?: string | null
          created_at?: string
          email?: string | null
          facebook_url?: string | null
          full_name?: string | null
          id?: string
          instagram_url?: string | null
          job_title?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          phone?: string | null
          text_color?: string | null
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
          youtube_embed_url?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nfc_profiles_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "nfc_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_button_clicks: {
        Row: {
          button_id: string
          created_at: string
          id: string
          profile_id: string
        }
        Insert: {
          button_id: string
          created_at?: string
          id?: string
          profile_id: string
        }
        Update: {
          button_id?: string
          created_at?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_button_clicks_button_id_fkey"
            columns: ["button_id"]
            isOneToOne: false
            referencedRelation: "profile_buttons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_button_clicks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "nfc_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_buttons: {
        Row: {
          action_type: string
          action_value: string
          created_at: string
          id: string
          label: string
          profile_id: string | null
          sort_order: number
        }
        Insert: {
          action_type: string
          action_value: string
          created_at?: string
          id?: string
          label: string
          profile_id?: string | null
          sort_order?: number
        }
        Update: {
          action_type?: string
          action_value?: string
          created_at?: string
          id?: string
          label?: string
          profile_id?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "profile_buttons_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "nfc_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_visits: {
        Row: {
          created_at: string
          id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_visits_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "nfc_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          email: string | null
          id: string
        }
        Insert: {
          email?: string | null
          id: string
        }
        Update: {
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          name: string
          type: Database["public"]["Enums"]["secret_type"] | null
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type?: Database["public"]["Enums"]["secret_type"] | null
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["secret_type"] | null
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_nfc_codes: {
        Args: { count: number; admin_id: string; code_type?: string }
        Returns: {
          assigned_at: string | null
          assigned_to: string | null
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_hidden: boolean | null
          redirect_url: string | null
          review_type: string | null
          title: string | null
          type: string
          url: string | null
        }[]
      }
      generate_unique_code: {
        Args: { code_length?: number }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "user"
      feedback_status: "new" | "in_consideration" | "in_production" | "done"
      secret_type: "api_key" | "connection_string" | "token"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      feedback_status: ["new", "in_consideration", "in_production", "done"],
      secret_type: ["api_key", "connection_string", "token"],
    },
  },
} as const
