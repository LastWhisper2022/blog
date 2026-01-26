import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import BlogPostItemContainer from '@theme/BlogPostItem/Container';
import BlogPostItemHeader from '@theme/BlogPostItem/Header';
import BlogPostItemContent from '@theme/BlogPostItem/Content';
import BlogPostItemFooter from '@theme/BlogPostItem/Footer';
import type {Props} from '@theme/BlogPostItem';

// apply a bottom margin in list view
function useContainerClassName() {
  const {isBlogPostPage} = useBlogPost();
  return !isBlogPostPage ? 'margin-bottom--xl' : undefined;
}

export default function BlogPostItem({children, className}: Props): ReactNode {
  const {metadata, isBlogPostPage} = useBlogPost();
  const {frontMatter} = metadata;
  // @ts-ignore
  const image = frontMatter.image || '/img/demo.jpeg';

  const containerClassName = useContainerClassName();

  if (!isBlogPostPage) {
     return (
        <BlogPostItemContainer 
            className={clsx(
                containerClassName, 
                className, 
                'tw-relative tw-overflow-hidden tw-rounded-xl tw-shadow-md hover:tw-shadow-xl tw-transition-all tw-duration-300 tw-group'
            )}
        >
             {/* Background Image */}
             <div 
                className="tw-absolute tw-inset-0 tw-bg-cover tw-bg-center tw-transition-transform tw-duration-500 group-hover:tw-scale-105"
                style={{backgroundImage: `url(${image})`}}
             />
             
             {/* Overlay */}
             <div className="tw-absolute tw-inset-0 tw-bg-white/90 dark:tw-bg-[#1b1b1d]/90 tw-backdrop-blur-sm" />

             {/* Content Wrapper */}
             <div className="tw-relative tw-z-10 tw-p-6">
                <BlogPostItemHeader />
                <BlogPostItemContent>{children}</BlogPostItemContent>
                <BlogPostItemFooter />
             </div>
        </BlogPostItemContainer>
     );
  }

  return (
    <BlogPostItemContainer className={clsx(containerClassName, className)}>
      <BlogPostItemHeader />
      <BlogPostItemContent>{children}</BlogPostItemContent>
      <BlogPostItemFooter />
    </BlogPostItemContainer>
  );
}
