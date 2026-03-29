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

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No auth" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller } } = await supabase.auth.getUser(token);
    if (!caller) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: callerRole } = await supabase.from("user_roles").select("role").eq("user_id", caller.id).eq("role", "admin").single();
    if (!callerRole) {
      return new Response(JSON.stringify({ error: "Not admin" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { action, email, user_id } = await req.json();

    if (action === "list_admins") {
      const { data: roles } = await supabase.from("user_roles").select("user_id, role").eq("role", "admin");
      if (!roles) return new Response(JSON.stringify({ admins: [] }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

      const adminDetails = [];
      for (const r of roles) {
        const { data: profile } = await supabase.from("profiles").select("display_name, user_id").eq("user_id", r.user_id).single();
        const { data: { users } } = await supabase.auth.admin.listUsers();
        const authUser = users?.find((u: any) => u.id === r.user_id);
        adminDetails.push({
          user_id: r.user_id,
          display_name: profile?.display_name || "Без імені",
          email: authUser?.email || "—",
        });
      }
      return new Response(JSON.stringify({ admins: adminDetails }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "grant_admin") {
      if (!email) return new Response(JSON.stringify({ error: "Email required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

      const { data: { users } } = await supabase.auth.admin.listUsers();
      const targetUser = users?.find((u: any) => u.email === email);
      if (!targetUser) {
        return new Response(JSON.stringify({ error: "Користувача не знайдено" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { error } = await supabase.from("user_roles").insert({ user_id: targetUser.id, role: "admin" });
      if (error && error.code === "23505") {
        return new Response(JSON.stringify({ error: "Вже є адміністратором" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "revoke_admin") {
      if (!user_id) return new Response(JSON.stringify({ error: "user_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (user_id === caller.id) {
        return new Response(JSON.stringify({ error: "Не можна зняти права з себе" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      await supabase.from("user_roles").delete().eq("user_id", user_id).eq("role", "admin");
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
