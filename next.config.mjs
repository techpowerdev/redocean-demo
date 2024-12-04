/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "profile.line-scdn.net",
      },
      {
        hostname: "img.freepik.com",
      },
      {
        hostname: "img.lazcdn.com",
      },
      {
        hostname: "cdn.nocnoc.com",
      },
      {
        hostname: "3001-101-108-150-129.ngrok-free.app",
      },
    ],
  },
  // async redirects() {
  //   return [
  //     // Basic redirect
  //     {
  //       source: "/campaign",
  //       destination: "/",
  //       permanent: true,
  //     },
  //     // Wildcard path matching
  //     {
  //       source: "/campaign/:id",
  //       destination: "/",
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
