import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Excluir archivos de AI que causan problemas en el build
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    // Ignorar módulos problemáticos de OpenTelemetry y Handlebars
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        '@opentelemetry/exporter-jaeger': 'commonjs @opentelemetry/exporter-jaeger',
        'handlebars': 'commonjs handlebars'
      });
    }
    
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
