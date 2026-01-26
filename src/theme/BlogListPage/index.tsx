import React, {type ReactNode, useState, useMemo} from 'react';
import clsx from 'clsx';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
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

function BlogListPageContent(props: Props): ReactNode {
  const {metadata, items, sidebar} = props;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  return (
    <BlogLayout sidebar={sidebar}>
      {/* Category Filters */}
      <div className="tw-mb-8 tw-flex tw-flex-wrap tw-gap-2">
            <button
                className={clsx(
                    'tw-px-4 tw-py-2 tw-rounded-full tw-text-sm tw-font-medium tw-transition-colors tw-border-none tw-cursor-pointer',
                    !selectedCategory 
                        ? 'tw-bg-ink-600 tw-text-white' 
                        : 'tw-bg-gray-100 dark:tw-bg-gray-800 tw-text-gray-600 dark:tw-text-gray-300 hover:tw-bg-gray-200 dark:hover:tw-bg-gray-700'
                )}
                // Inline styles as fallback if Tailwind fails
                style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: !selectedCategory ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-200)',
                    color: !selectedCategory ? '#fff' : 'var(--ifm-font-color-base)',
                    marginRight: '8px',
                    marginBottom: '8px'
                }}
                onClick={() => setSelectedCategory(null)}
            >
                全部
            </button>
            {categories.map(category => (
                <button
                    key={category}
                    className={clsx(
                        'tw-px-4 tw-py-2 tw-rounded-full tw-text-sm tw-font-medium tw-transition-colors tw-border-none tw-cursor-pointer',
                        selectedCategory === category
                            ? 'tw-bg-ink-600 tw-text-white'
                            : 'tw-bg-gray-100 dark:tw-bg-gray-800 tw-text-gray-600 dark:tw-text-gray-300 hover:tw-bg-gray-200 dark:hover:tw-bg-gray-700'
                    )}
                     // Inline styles as fallback if Tailwind fails
                    style={{
                        padding: '8px 16px',
                        borderRadius: '9999px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: selectedCategory === category ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-200)',
                        color: selectedCategory === category ? '#fff' : 'var(--ifm-font-color-base)',
                        marginRight: '8px',
                        marginBottom: '8px'
                    }}
                    onClick={() => setSelectedCategory(category)}
                >
                    {category}
                </button>
            ))}
      </div>

      <BlogPostItems items={filteredItems} />
      {!selectedCategory && <BlogListPaginator metadata={metadata} />}
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
