const withMDX = require('@next/mdx')()
const removeImports = require("next-remove-imports")();

/** @type {import('next').NextConfig} */
const nextConfig = removeImports({
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
  experimental: {
    esmExternals: 'loose'
  }
});

module.exports = withMDX(nextConfig)