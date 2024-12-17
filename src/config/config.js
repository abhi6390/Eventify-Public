const conf = {
  appwrite: {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    projectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    
  },
  supabase: {
    supabaseUrl: String(import.meta.env.VITE_SUPABASE_URL),
    supabaseAnonKey: String(import.meta.env.VITE_SUPABASE_ANON_KEY),
  },
};
  
export default conf;