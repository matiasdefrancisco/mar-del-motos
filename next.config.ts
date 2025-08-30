import type {NextConfig} from 'next';
import path from 'path';
import crypto from 'crypto';

const nextConfig: NextConfig = {
  // FIREBASE: Configuración para export estático compatible con Firebase Hosting
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  // Optimizaciones de TypeScript y ESLint
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  // OPTIMIZACIÓN: Habilitar compresión gzip/brotli
  compress: true,

  // OPTIMIZACIÓN: Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
    // OPTIMIZACIÓN: Formatos modernos de imagen
    formats: ['image/webp', 'image/avif'],
    // OPTIMIZACIÓN: Tamaños de imagen optimizados
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // CRÍTICO: Optimizaciones para LCP
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 31536000, // 1 año
  },

  // 🔧 CRÍTICO: Migrar serverComponentsExternalPackages fuera de experimental
  serverExternalPackages: ['firebase-admin'],

  // OPTIMIZACIÓN: Configuración experimental
  experimental: {
    // CRÍTICO: Optimizar CSS
    optimizeCss: true,
    // CRÍTICO: Optimizar paquetes externos
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns',
      'recharts',
      'firebase/firestore',
      'firebase/auth',
      'firebase/storage'
    ],
    // CRÍTICO: Habilitar lazy loading de componentes
    esmExternals: true,
    // CRÍTICO: Preload de recursos críticos
    optimizeServerReact: true,
  },

  // NOTA: Turbo se configura via experimental.turbo en Next.js 15

  // OPTIMIZACIÓN: Configuración de webpack
  webpack: (config, { isServer, webpack }) => {
    // Configurar alias para path mapping
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    
    // OPTIMIZACIÓN: Ignorar módulos problemáticos solo en servidor
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@opentelemetry/exporter-jaeger': 'commonjs @opentelemetry/exporter-jaeger',
        'handlebars': 'commonjs handlebars'
      });
    }

    // OPTIMIZACIÓN: Configuración de chunks más agresiva
    if (!isServer && config.optimization) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 70000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|next|@next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test(module: any) {
              return module.size() > 160000 &&
                /node_modules[/\\]/.test(module.identifier());
            },
            name(module: any) {
              return `lib-${crypto.createHash('sha1')
                .update(module.identifier())
                .digest('hex')
                .substring(0, 8)}`;
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
          shared: {
            name(module: any, chunks: any) {
              return `shared-${crypto.createHash('sha1')
                .update(chunks.reduce((acc: string, chunk: any) => acc + chunk.name, ''))
                .digest('hex')
                .substring(0, 8)}`;
            },
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      };

      // Aumentar el timeout del webpack
      config.watchOptions = {
        ...config.watchOptions,
        aggregateTimeout: 1000,
        poll: 1000,
      };
    }

    // OPTIMIZACIÓN: Bundle Analyzer en desarrollo
    if (process.env.ANALYZE === 'true') {
      const BundleAnalyzerPlugin = require('@next/bundle-analyzer')();
      config.plugins.push(new BundleAnalyzerPlugin());
    }

    // OPTIMIZACIÓN: Compression plugin para assets
    if (!isServer) {
      config.plugins.push(
        new webpack.DefinePlugin({
          __DEVELOPMENT__: JSON.stringify(!isServer && process.env.NODE_ENV === 'development'),
          __PRODUCTION__: JSON.stringify(!isServer && process.env.NODE_ENV === 'production'),
        })
      );
    }

    return config;
  },

  // 🚨 NOTA: headers, redirects y rewrites no funcionan con output: 'export'
  // Se configuran en Firebase Hosting via firebase.json
  // Headers de seguridad se manejan en el servidor de hosting

  // OPTIMIZACIÓN: Variables de entorno para build
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },

  // OPTIMIZACIÓN: Configuración de PoweredByHeader
  poweredByHeader: false,

  // OPTIMIZACIÓN: Configuración de reactStrictMode
  reactStrictMode: true,

  // OPTIMIZACIÓN: SWC viene habilitado por defecto en Next.js 15
};

export default nextConfig;
