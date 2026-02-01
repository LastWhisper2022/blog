import React, { useEffect } from "react";
import type { ReactNode } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Hero from "../components/Hero";
import Head from "@docusaurus/Head";

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  
  useEffect(() => {
    // Add custom class to body for home page specific styling
    document.body.classList.add('home-page');
    
    // Cleanup function to remove class when component unmounts (navigating away)
    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  return (
    <Layout title={siteConfig.title}>
      <Hero/>
      <main>
      </main>
    </Layout>
  );
}
