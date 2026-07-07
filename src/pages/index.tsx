import React from "react";
import type { ReactNode } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { HtmlClassNameProvider } from "@docusaurus/theme-common";
import Layout from "@theme/Layout";
import Hero from "../components/Hero";

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <HtmlClassNameProvider className="home-page">
      <Layout title={siteConfig.title}>
        <Hero/>
      </Layout>
    </HtmlClassNameProvider>
  );
}
