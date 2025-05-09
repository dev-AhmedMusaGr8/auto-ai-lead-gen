
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.24.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  
  try {
    // Get request body
    const { name, userId } = await req.json();
    
    if (!name || !userId) {
      return new Response(
        JSON.stringify({ error: 'Organization name and user ID are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log(`Creating organization "${name}" for user ${userId}`);
    
    // Create a Supabase client with the service role key (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );
    
    // Create the organization in dealerships table
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from('dealerships')
      .insert({
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
      
    if (orgError) {
      console.error('Error creating organization:', orgError);
      return new Response(
        JSON.stringify({ error: orgError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
    
    console.log("Organization created:", orgData);
    
    // Update the user's profile with the dealership_id
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        dealership_id: orgData.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
      
    if (profileError) {
      console.error('Error updating profile:', profileError);
      return new Response(
        JSON.stringify({ error: profileError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
    
    console.log(`Updated profile for user ${userId} with dealership_id ${orgData.id}`);
    
    // Add admin role to user_roles table if not exists
    const { data: existingRole } = await supabaseAdmin
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin');
      
    if (!existingRole || existingRole.length === 0) {
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });
        
      if (roleError) {
        console.error('Error adding admin role:', roleError);
      } else {
        console.log(`Added admin role for user ${userId}`);
      }
    } else {
      console.log(`User ${userId} already has admin role`);
    }
    
    return new Response(
      JSON.stringify({ id: orgData.id }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
