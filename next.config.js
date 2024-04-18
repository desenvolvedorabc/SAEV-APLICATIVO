module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "PUT, POST, PATCH, DELETE, GET",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Origin, X-Requested-With, Content-Type, Accept, Authorization",
          },
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ],
      },
      {
        source: "/", // Pode ser ajustado para corresponder à rota específica
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://app.powerbi.com/ https://lookerstudio.google.com/",
          },
        ],
      },
    ];
  },

  reactStrictMode: true,
  future: {
    webpack5: true,
  },
  // distDir: '.next',

  webpack: (config, {}) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     use: ["@svgr/webpack"],
  //   });

  //   return config;
  // },

  images: {
    domains: [
      process.env.NEXT_PUBLIC_DOMAIN_URL || "localhost",
      "abemcomum-saev-backend-staging-049bcf13.apps.going2.com.br",
      "abemcomum-saev-backend-dev-abe-d2610e51.apps.going2.com.br",
    ],
  },
};
