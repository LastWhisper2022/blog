import React, {type ReactNode, useState, useMemo} from 'react';
import clsx from 'clsx';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/BlogListPage';
import BlogPostItems from '@theme/BlogPostItems';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';

function BlogListPageMetadata(props: Props): ReactNode {
  const {metadata} = props;
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

import ClientPaginator from './ClientPaginator';
import { Badge } from "@site/src/components/ui/badge";

function BlogListPageContent(props: Props): ReactNode {
  const {metadata, items, sidebar} = props;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6; // Adjust as needed, usually 10 matches docusaurus config

  // Reset page when category changes
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const categories = useMemo(() => {
    const tagsMap = new Map<string, number>();
    items.forEach(item => {
      // Strategy 1: Metadata tags (objects with label)
      const tags = item.content?.metadata?.tags;
      if (tags && Array.isArray(tags) && tags.length > 0) {
        tags.forEach(tag => {
           if (tag && tag.label) {
             tagsMap.set(tag.label, (tagsMap.get(tag.label) || 0) + 1);
           }
        });
      } else {
         // Strategy 2: FrontMatter tags (strings)
         // @ts-ignore
         const fmTags = item.content?.frontMatter?.tags;
         if (fmTags && Array.isArray(fmTags)) {
            fmTags.forEach(tag => {
                if (typeof tag === 'string') {
                    tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1);
                }
            });
         }
      }
    });
    return Array.from(tagsMap.entries()).sort((a, b) => b[1] - a[1]).map(e => e[0]);
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return items;
    return items.filter(item => {
      const tags = item.content?.metadata?.tags;
      const hasMetadataTag = tags?.some(tag => tag.label === selectedCategory);
      if (hasMetadataTag) return true;

      // @ts-ignore
      const fmTags = item.content?.frontMatter?.tags;
      if (fmTags && Array.isArray(fmTags)) {
          return fmTags.includes(selectedCategory);
      }
      return false;
    });
  }, [items, selectedCategory]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  return (
    <BlogLayout sidebar={sidebar}>
      {/* Category Filters */}
      <div className="tw-mb-8 tw-flex tw-flex-wrap tw-gap-2">
            <Badge
                variant={!selectedCategory ? "default" : "secondary"}
                className="tw-cursor-pointer tw-px-4 tw-py-1.5 tw-text-sm"
                onClick={() => handleCategoryChange(null)}
            >
                全部
            </Badge>
            {categories.map(category => (
                <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    className="tw-cursor-pointer tw-px-4 tw-py-1.5 tw-text-sm"
                    onClick={() => handleCategoryChange(category)}
                >
                    {category}
                </Badge>
            ))}
      </div>

      <BlogPostItems items={paginatedItems} />
      
      {/* Custom Paginator for filtered results OR default view if we want consistent UI */}
      <ClientPaginator 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />
      
      {/* Hide default paginator since we handle it manually now, or only show it if no category selected AND we are not paginating locally? 
          Actually, since we slice 'items' locally, we should probably hide the default paginator to avoid confusion, 
          OR keep using default paginator for 'All' view if we didn't slice it.
          But to have consistent UI, it's better to use our ClientPaginator for everything on this page.
      */}
      {/* {!selectedCategory && <BlogListPaginator metadata={metadata} />} */}
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): ReactNode {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}>
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
