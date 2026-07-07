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

const ITEMS_PER_PAGE = 6;

type BlogListItem = Props['items'][number];

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function getItemTagLabels(item: BlogListItem): string[] {
  const metadataTags =
    item.content?.metadata?.tags
      ?.map((tag) => tag.label)
      .filter(isString) ?? [];

  const frontMatter = item.content?.frontMatter as {tags?: unknown} | undefined;
  const frontMatterTags = Array.isArray(frontMatter?.tags)
    ? frontMatter.tags.filter(isString)
    : [];

  return Array.from(new Set([...metadataTags, ...frontMatterTags]));
}

function BlogListPageContent(props: Props): ReactNode {
  const {metadata, items, sidebar} = props;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const categories = useMemo(() => {
    const tagsMap = new Map<string, number>();
    items.forEach(item => {
      getItemTagLabels(item).forEach((tag) => {
        tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagsMap.entries()).sort((a, b) => b[1] - a[1]).map(e => e[0]);
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return items;
    return items.filter((item) => getItemTagLabels(item).includes(selectedCategory));
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
      <ClientPaginator 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />
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
