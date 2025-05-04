
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1'

// Set up CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface InvitationRequest {
  email: string;
  role: string;
  dealershipId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get the request body
    const { email, role, dealershipId }: InvitationRequest = await req.json();
    
    console.log(`Processing invitation request for ${email} with role ${role} at dealership ${dealershipId}`);
    
    if (!email || !role || !dealershipId) {
      throw new Error('Missing required fields: email, role, or dealershipId');
    }
    
    // Fetch dealership information
    const { data: dealershipData, error: dealershipError } = await supabase
      .from('dealerships')
      .select('name')
      .eq('id', dealershipId)
      .single();
      
    if (dealershipError) {
      throw new Error(`Failed to fetch dealership: ${dealershipError.message}`);
    }
    
    // Generate a signup URL with pre-filled parameters
    const signupUrl = new URL(`${req.headers.get('origin') || 'https://example.com'}/signin`);
    signupUrl.searchParams.set('email', email);
    signupUrl.searchParams.set('role', role);
    signupUrl.searchParams.set('dealership', dealershipId);
    
    // TODO: In a production environment, integrate with a proper email service like Resend, SendGrid, etc.
    // For now, we'll just log the invitation details
    console.log(`
      Would send email to: ${email}
      Subject: Invitation to join ${dealershipData.name} on AutoCRMAI
      Body: You've been invited to join ${dealershipData.name} as a ${role.replace('_', ' ')}. 
            Click here to accept: ${signupUrl.toString()}
    `);
    
    // In a real implementation, we'd store the invitation in the database
    // For demo purposes, let's just return success
    
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
  } catch (error) {
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
