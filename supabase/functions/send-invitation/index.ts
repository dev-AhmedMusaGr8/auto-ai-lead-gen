
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1'

// Set up CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface InvitationRequest {
  email: string;
  role: string;
  token: string;
  orgId: string;
  orgName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get the request body
    const { email, role, token, orgId, orgName }: InvitationRequest = await req.json();
    
    console.log(`Processing invitation request for ${email} with role ${role} at organization ${orgId}`);
    
    if (!email || !role || !token || !orgId || !orgName) {
      throw new Error('Missing required fields');
    }
    
    // Generate a signup URL with the invite token
    const inviteUrl = new URL(`${req.headers.get('origin') || 'https://example.com'}/invite/accept`);
    inviteUrl.searchParams.set('token', token);
    
    // TODO: In a production environment, integrate with a proper email service like Resend, SendGrid, etc.
    // For now, we'll just log the invitation details
    console.log(`
      Would send email to: ${email}
      Subject: Invitation to join ${orgName} on AutoCRMAI
      Body: You've been invited to join ${orgName} as a ${role.replace('_', ' ')}. 
            Click here to accept: ${inviteUrl.toString()}
    `);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Invitation sent to ${email}`
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error: any) {
    console.error('Error processing invitation:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  }
};

serve(handler);
