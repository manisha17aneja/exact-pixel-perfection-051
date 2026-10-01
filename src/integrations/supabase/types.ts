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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string
          customer: string
          id: string
          lane: string
          material: string
          pickup: string
          status: string
          weight: string
        }
        Insert: {
          created_at?: string
          customer: string
          id?: string
          lane?: string
          material?: string
          pickup?: string
          status?: string
          weight?: string
        }
        Update: {
          created_at?: string
          customer?: string
          id?: string
          lane?: string
          material?: string
          pickup?: string
          status?: string
          weight?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          role: string
        }
        Insert: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          name: string
          phone?: string
          role?: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          role?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          city: string
          contact: string
          created_at: string
          id: string
          name: string
          outstanding: number
          revenue: number
          shipments: number
          status: string
        }
        Insert: {
          city?: string
          contact?: string
          created_at?: string
          id?: string
          name: string
          outstanding?: number
          revenue?: number
          shipments?: number
          status?: string
        }
        Update: {
          city?: string
          contact?: string
          created_at?: string
          id?: string
          name?: string
          outstanding?: number
          revenue?: number
          shipments?: number
          status?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          id: string
          status: string
          trip: string
          vendor: string
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          date?: string
          id?: string
          status?: string
          trip?: string
          vendor?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          id?: string
          status?: string
          trip?: string
          vendor?: string
        }
        Relationships: []
      }
      followups: {
        Row: {
          created_at: string
          due: string
          id: string
          owner: string
          status: string
          subject: string
          with_name: string
        }
        Insert: {
          created_at?: string
          due?: string
          id?: string
          owner?: string
          status?: string
          subject: string
          with_name?: string
        }
        Update: {
          created_at?: string
          due?: string
          id?: string
          owner?: string
          status?: string
          subject?: string
          with_name?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          customer: string
          due: string
          id: string
          issued: string
          shipment: string
          status: string
        }
        Insert: {
          amount?: number
          created_at?: string
          customer: string
          due?: string
          id?: string
          issued?: string
          shipment?: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer?: string
          due?: string
          id?: string
          issued?: string
          shipment?: string
          status?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string
          created_at: string
          id: string
          name: string
          owner: string
          route: string
          source: string
          status: string
          value: number
        }
        Insert: {
          company?: string
          created_at?: string
          id?: string
          name: string
          owner?: string
          route?: string
          source?: string
          status?: string
          value?: number
        }
        Update: {
          company?: string
          created_at?: string
          id?: string
          name?: string
          owner?: string
          route?: string
          source?: string
          status?: string
          value?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email?: string
          id: string
          name?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      quotations: {
        Row: {
          amount: number
          created_at: string
          customer: string
          id: string
          lane: string
          status: string
          valid: string
          vehicle: string
        }
        Insert: {
          amount?: number
          created_at?: string
          customer: string
          id?: string
          lane?: string
          status?: string
          valid?: string
          vehicle?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer?: string
          id?: string
          lane?: string
          status?: string
          valid?: string
          vehicle?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          created_at: string
          customer: string
          dest: string
          driver: string
          eta: string
          id: string
          origin: string
          progress: number
          status: string
          vehicle: string
          weight: string
        }
        Insert: {
          created_at?: string
          customer: string
          dest?: string
          driver?: string
          eta?: string
          id?: string
          origin?: string
          progress?: number
          status?: string
          vehicle?: string
          weight?: string
        }
        Update: {
          created_at?: string
          customer?: string
          dest?: string
          driver?: string
          eta?: string
          id?: string
          origin?: string
          progress?: number
          status?: string
          vehicle?: string
          weight?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          created_at: string
          driver: string
          fuel: number
          id: string
          km: number
          route: string
          start: string
          status: string
          vehicle: string
        }
        Insert: {
          created_at?: string
          driver?: string
          fuel?: number
          id?: string
          km?: number
          route: string
          start?: string
          status?: string
          vehicle?: string
        }
        Update: {
          created_at?: string
          driver?: string
          fuel?: number
          id?: string
          km?: number
          route?: string
          start?: string
          status?: string
          vehicle?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          capacity: string
          created_at: string
          driver: string
          location: string
          reg: string
          service: string
          status: string
          type: string
        }
        Insert: {
          capacity?: string
          created_at?: string
          driver?: string
          location?: string
          reg: string
          service?: string
          status?: string
          type?: string
        }
        Update: {
          capacity?: string
          created_at?: string
          driver?: string
          location?: string
          reg?: string
          service?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gen_code: { Args: { prefix: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "dispatcher" | "accountant"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "dispatcher", "accountant"],
    },
  },
} as const
