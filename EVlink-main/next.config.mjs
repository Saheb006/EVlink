/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://tflaglcrdchgsjytcopa.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbGFnbGNyZGNoZ3NqeXRjb3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDQ5NTAsImV4cCI6MjA3NTMyMDk1MH0.6UcS4AB0Oc0UwTuLfqUXkVQkpnqe2TUyASZ_ZohxTuc',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
