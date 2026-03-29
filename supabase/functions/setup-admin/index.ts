import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Create admin user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: "artemm5354@gmail.com",
      password: "Admintest123",
      email_confirm: true,
      user_metadata: { display_name: "Test" },
    });

    if (authError) {
      // User might already exist
      if (authError.message.includes("already")) {
        // Find existing user
        const { data: { users } } = await supabase.auth.admin.listUsers();
        const existing = users?.find((u: any) => u.email === "artemm5354@gmail.com");
        if (existing) {
          // Assign admin role
          const { error: roleErr } = await supabase.from("user_roles").upsert(
            { user_id: existing.id, role: "admin" },
            { onConflict: "user_id,role" }
          );
          return new Response(JSON.stringify({ success: true, message: "Existing user assigned admin role", roleErr }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
      throw authError;
    }

    // Assign admin role
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: authData.user.id,
      role: "admin",
    });

    return new Response(JSON.stringify({ success: true, userId: authData.user.id, roleError }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
