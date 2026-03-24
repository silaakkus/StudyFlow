import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Buraya hata veren paketleri ekliyoruz */
  transpilePackages: ['lucide-react'],
  
  // Eğer Turbopack kaynaklı başka görsel hatalar alırsan 
  // aşağıdakini de ekleyebiliriz ama şimdilik sadece üstteki yeterli.
};

export default nextConfig;
