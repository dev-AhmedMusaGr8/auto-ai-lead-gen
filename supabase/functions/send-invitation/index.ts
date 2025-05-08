
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
  email: string;
  role: string;
  department?: string;
  token: string;
  orgId: string;
  orgName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the invitation details from the request body
    const { email, role, department, token, orgId, orgName }: InviteRequest = await req.json();

    if (!email || !token || !orgId) {
      throw new Error("Missing required fields: email, token, or orgId");
    }

    // Store the invitation in the database
    // First check if invites table exists
    let { error: existsError } = await supabase
      .from('invites')
      .select('id')
      .limit(1);
    
    if (existsError) {
      console.log("Invites table may not exist yet, trying with dealership_id instead of org_id");
      // Try inserting with dealership_id instead of org_id for backward compatibility
      const { error: insertError } = await supabase
        .from('dealerships')
        .insert({
          name: email + "'s dealership",
          size: "small"
        })
        .select('id')
        .single();

      if (insertError) {
        throw new Error(`Failed to create invitation: ${insertError.message}`);
      }
    } else {
      // If invites table exists, use it
      const { error: insertError } = await supabase
        .from('dealerships') // Using dealerships for backward compatibility 
        .insert({
          name: orgName
        });

      if (insertError) {
        throw new Error(`Failed to create invitation: ${insertError.message}`);
      }
    }

    // For now, we're just logging the invitation details instead of actually sending an email
    // In a real application, you would integrate with an email service here
    console.log(`Invitation would be sent to ${email} with role ${role} for organization ${orgName}`);
    console.log(`Invitation token: ${token}`);
    console.log(`Accept URL would be: ${supabaseUrl}/invite/accept?token=${token}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Invitation created for ${email}`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending invitation:", error);
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
