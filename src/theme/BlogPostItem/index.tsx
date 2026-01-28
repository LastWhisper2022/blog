import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import BlogPostItemContainer from '@theme/BlogPostItem/Container';
import BlogPostItemHeader from '@theme/BlogPostItem/Header';
import BlogPostItemContent from '@theme/BlogPostItem/Content';
import BlogPostItemFooter from '@theme/BlogPostItem/Footer';
import type {Props} from '@theme/BlogPostItem';
import {
  Card,
} from "@site/src/components/ui/card"
import { Badge } from "@site/src/components/ui/badge"
import Link from '@docusaurus/Link';
import { useDateTimeFormat } from '@docusaurus/theme-common/internal';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

// apply a bottom margin in list view
function useContainerClassName() {
  const {isBlogPostPage} = useBlogPost();
  return !isBlogPostPage ? 'margin-bottom--xl' : undefined;
}

export default function BlogPostItem({children, className}: Props): ReactNode {
  const {metadata, isBlogPostPage} = useBlogPost();
  const {frontMatter, title, date, permalink, description, readingTime} = metadata;
  // @ts-ignore
  const image = frontMatter.image || '/img/default.png';

  const containerClassName = useContainerClassName();

  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const formatDate = (blogDate: string) =>
    dateTimeFormat.format(new Date(blogDate));

  if (!isBlogPostPage) {
     return (
        <Link to={permalink} className="tw-block tw-no-underline hover:tw-no-underline tw-mb-6">
        <Card className={clsx(
            "tw-group tw-relative tw-overflow-hidden tw-border-0 tw-rounded-xl tw-shadow-md hover:tw-shadow-xl tw-transition-all tw-duration-500",
            "tw-h-[160px] md:tw-h-[240px]", // Reduced height for mobile (160px), standard for desktop (240px)
            className
        )}>
            {/* Background Image */}
            <div 
                className="tw-absolute tw-inset-0 tw-bg-cover tw-bg-center md:tw-transition-transform md:tw-duration-700 md:tw-ease-out md:group-hover:tw-scale-105"
                style={{backgroundImage: `url(${image})`}}
            />
            
            {/* Gradient Overlay */}
            <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-t tw-from-black/90 tw-via-black/50 tw-to-transparent tw-opacity-80 md:group-hover:tw-opacity-90 tw-transition-opacity tw-duration-500" />

            {/* Content Container */}
            <div className="tw-absolute tw-inset-0 tw-p-4 md:tw-p-6 tw-flex tw-flex-col tw-justify-end tw-text-white">
                
                {/* Top Meta (Date & Reading Time) */}
                {/* Mobile: Always visible, simple layout. Desktop: Animated slide down */}
                <div className={clsx(
                    "tw-absolute tw-top-4 tw-left-4 md:tw-top-6 md:tw-left-6 tw-flex tw-items-center tw-gap-2 md:tw-gap-3 tw-text-xs tw-font-medium tw-text-white/80",
                    "md:tw-opacity-0 md:-tw-translate-y-4 md:group-hover:tw-translate-y-0 md:group-hover:tw-opacity-100 md:tw-transition-all md:tw-duration-500 md:tw-delay-100"
                )}>
                     <div className="tw-flex tw-items-center tw-gap-1.5 tw-bg-black/30 tw-backdrop-blur-md tw-px-2 tw-py-0.5 md:tw-px-2.5 md:tw-py-1 tw-rounded-full">
                        <Calendar className="tw-w-3 tw-h-3 md:tw-w-3.5 md:tw-h-3.5" />
                        <time dateTime={date}>{formatDate(date)}</time>
                     </div>
                     {readingTime && (
                        <div className="tw-hidden md:tw-flex tw-items-center tw-gap-1.5 tw-bg-black/30 tw-backdrop-blur-md tw-px-2.5 tw-py-1 tw-rounded-full">
                            <Clock className="tw-w-3.5 tw-h-3.5" />
                            <span>阅读需 {Math.ceil(readingTime)} 分钟</span>
                        </div>
                     )}
                </div>

                {/* Tags */}
                {/* Mobile: Hidden to save space. Desktop: Animated */}
                <div className={clsx(
                    "tw-hidden md:tw-flex tw-gap-2 tw-mb-3",
                    "md:tw-transform md:tw-translate-y-4 md:group-hover:tw-translate-y-0 md:tw-transition-transform md:tw-duration-500"
                )}>
                    {metadata.tags.slice(0, 3).map((tag) => (
                        <Badge 
                            key={tag.permalink} 
                            variant="secondary" 
                            className="tw-bg-white/20 tw-text-white tw-border-white/10 hover:tw-bg-white/30 tw-backdrop-blur-sm"
                        >
                            {tag.label}
                        </Badge>
                    ))}
                </div>

                {/* Title */}
                <h3 className={clsx(
                    "tw-text-lg md:tw-text-2xl tw-font-bold tw-leading-tight tw-mb-1 md:tw-mb-2 tw-text-white",
                    "md:group-hover:tw-text-primary-foreground md:tw-transform md:tw-translate-y-2 md:group-hover:tw-translate-y-0 md:tw-transition-all md:tw-duration-500"
                )}>
                    {title}
                </h3>

                {/* Description */}
                {/* Mobile: Hidden. Desktop: Animated fade in */}
                <p className={clsx(
                    "tw-hidden md:tw-block tw-text-sm tw-text-gray-300 tw-line-clamp-2 tw-max-w-[90%]",
                    "md:tw-opacity-0 md:tw-h-0 md:group-hover:tw-h-auto md:group-hover:tw-opacity-100 md:tw-transform md:tw-translate-y-4 md:group-hover:tw-translate-y-0 md:tw-transition-all md:tw-duration-500 md:tw-delay-75"
                )}>
                    {description}
                </p>
                
                {/* Arrow Icon - Minimalist Text Button */}
                {/* Mobile: Always visible at bottom right. Desktop: Animated slide in */}
                <div className={clsx(
                    "tw-absolute tw-bottom-4 tw-right-4 md:tw-bottom-6 md:tw-right-6",
                    "md:tw-opacity-0 md:-tw-translate-x-4 md:group-hover:tw-translate-x-0 md:group-hover:tw-opacity-100 md:tw-transition-all md:tw-duration-500 md:tw-delay-200"
                )}>
                    <div className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-medium tw-text-white/90 group-hover:tw-text-white">
                        <span className="tw-hidden md:tw-inline-block">开始阅读</span>
                        <ArrowRight className="tw-w-5 tw-h-5 tw-transition-transform group-hover:tw-translate-x-1" />
                    </div>
                </div>
            </div>
        </Card>
    </Link>
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
