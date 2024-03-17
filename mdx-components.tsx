import type { MDXComponents } from 'mdx/types'
import "./app/prism-vsc-dark-plus.css";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  }
}