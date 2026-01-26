import type { ReactNode } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Hero from "../components/Hero";

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title}>
      <Hero/>
      <main>
      </main>
    </Layout>
  );
}
