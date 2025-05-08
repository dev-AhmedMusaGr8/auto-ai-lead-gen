
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

// Set up CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface InviteRequest {
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the token from the request body
    const { token }: InviteRequest = await req.json();

    if (!token) {
      throw new Error("Missing required field: token");
    }

    // Query the invites table for the token
    const { data, error } = await supabase
      .from("invites")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (error || !data) {
      throw new Error("Invalid or expired invitation token");
    }

    // Return the invitation data
    return new Response(
      JSON.stringify({
        email: data.email,
        org_id: data.org_id,
        role: data.role,
        department: data.department,
        invite_id: data.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error validating invitation:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
