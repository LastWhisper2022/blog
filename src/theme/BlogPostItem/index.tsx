import React, {type ReactNode, useEffect, useState} from 'react';
import clsx from 'clsx';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import BlogPostItemContainer from '@theme/BlogPostItem/Container';
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
import Comment from '@site/src/components/Comment';

const PASSWORD_LEVEL_KEY = 'password_level';

function getTodayPassword() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function getPasswordLevel(): 0 | 1 | 2 {
  if (typeof window === 'undefined') return 0;
  const raw = window.localStorage.getItem(PASSWORD_LEVEL_KEY);
  const n = Number(raw);
  return n === 1 || n === 2 ? n : 0;
}

function getExpectedPassword(level: 0 | 1 | 2) {
  const today = getTodayPassword();
  if (level === 0) return '19970612';
  if (level === 1) return today;
  return `${today}cx`;
}

// apply a bottom margin in list view
function useContainerClassName() {
  const {isBlogPostPage} = useBlogPost();
  return !isBlogPostPage ? 'margin-bottom--xl' : undefined;
}

export default function BlogPostItem({children, className}: Props): ReactNode {
  const {metadata, isBlogPostPage} = useBlogPost();
  const {frontMatter, title, date, permalink, description, readingTime} = metadata;
  const [inputPassword, setInputPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const isLifePost = metadata.tags?.some((tag) => tag.label === '生活');
  // @ts-ignore
  const assetsImage = (metadata as any).assets?.image;
  // @ts-ignore
  let image = assetsImage || frontMatter.image || '/img/default.png';
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
          <div className="tw-relative tw-h-full">
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
                      "md:group-hover:tw-text-gray-300 md:tw-transform md:tw-translate-y-2 md:group-hover:tw-translate-y-0 md:tw-transition-all md:tw-duration-500"
                  )}>
                      {title}
                  </h3>

                  {/* Description */}
                  <p className={clsx(
                      "tw-hidden md:tw-block tw-text-sm tw-text-gray-300 tw-line-clamp-2 tw-max-w-[90%]",
                      "md:tw-opacity-0 md:tw-h-0 md:group-hover:tw-h-auto md:group-hover:tw-opacity-100 md:tw-transform md:tw-translate-y-4 md:group-hover:tw-translate-y-0 md:tw-transition-all md:tw-duration-500 md:tw-delay-75"
                  )}>
                      {description}
                  </p>
                  
                  {/* Arrow Icon */}
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
          </div>
        </Card>
    </Link>
     );
  }

  useEffect(() => {
    if (!isBlogPostPage || !isLifePost) return;
    setIsUnlocked(false);
    setInputPassword('');
    setAuthError('');
  }, [isBlogPostPage, isLifePost, permalink]);

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const level = getPasswordLevel();
    const expected = getExpectedPassword(level);

    if (inputPassword.trim() === expected) {
      const nextLevel: 0 | 1 | 2 = level === 2 ? 0 : ((level + 1) as 0 | 1 | 2);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(PASSWORD_LEVEL_KEY, String(nextLevel));
      }
      setIsUnlocked(true);
      setAuthError('');
      setInputPassword('');
      return;
    }
    const levelsign = {
      0: '',
      1: '!',
      2: '!!',
    }
    setAuthError(`密码错误，请重试${levelsign[level] || ''}`);
  };

  if (isBlogPostPage && isLifePost && !isUnlocked) {
    return (
      <BlogPostItemContainer className={clsx(containerClassName, className)}>
        <div className="tw-max-w-md tw-mx-auto tw-my-20 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-gray-700 tw-p-6 tw-bg-white dark:tw-bg-gray-900">
          <h2 className="tw-text-xl tw-font-semibold tw-mb-2">内容访问验证</h2>
          <p className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-4">
            请输入我的生日：YYYYMMDD
          </p>
          <form onSubmit={handlePasswordSubmit} className="tw-flex tw-flex-col tw-gap-3">
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="请输入密码"
              className="tw-w-full tw-rounded-lg tw-border tw-border-gray-300 dark:tw-border-gray-700 tw-bg-transparent tw-px-3 tw-py-2 tw-text-sm"
            />
            {authError && (
              <div className="tw-text-sm tw-text-red-500">{authError}</div>
            )}
            <button
              type="submit"
              className="tw-rounded-lg tw-bg-gray-900 dark:tw-bg-gray-100 tw-text-white dark:tw-text-gray-900 tw-px-4 tw-py-2 tw-text-sm tw-font-medium"
            >
              验证并访问
            </button>
          </form>
        </div>
      </BlogPostItemContainer>
    );
  }

  return (
    <BlogPostItemContainer className={clsx(containerClassName, className)}>
      {/* 详情页顶部背景图 */}
      <div className="tw-relative tw-w-full tw-h-[300px] md:tw-h-[400px] tw-mb-8 tw-rounded-xl tw-overflow-hidden">
        <div 
          className="tw-absolute tw-inset-0 tw-bg-cover tw-bg-center"
          style={{backgroundImage: `url(${image})`}}
        />
        <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-t tw-from-black/80 tw-via-black/40 tw-to-transparent" />
        
        <div className="tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-p-6 md:tw-p-10 tw-text-white">
          <div className="tw-mb-4 tw-flex tw-flex-wrap tw-gap-2">
            {metadata.tags.map((tag) => (
              <Badge 
                key={tag.permalink} 
                variant="secondary" 
                className="tw-bg-white/20 tw-text-white tw-border-white/10 hover:tw-bg-white/30 tw-backdrop-blur-sm"
              >
                {tag.label}
              </Badge>
            ))}
          </div>
          
          <h1 className="tw-text-3xl md:tw-text-4xl lg:tw-text-5xl tw-font-bold tw-mb-4 tw-leading-tight">
            {title}
          </h1>
          
          <div className="tw-flex tw-items-center tw-gap-4 tw-text-sm md:tw-text-base tw-text-white/80">
            <div className="tw-flex tw-items-center tw-gap-1.5">
              <Calendar className="tw-w-4 tw-h-4" />
              <time dateTime={date}>{formatDate(date)}</time>
            </div>
            {readingTime && (
              <div className="tw-flex tw-items-center tw-gap-1.5">
                <Clock className="tw-w-4 tw-h-4" />
                <span>阅读需 {Math.ceil(readingTime)} 分钟</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <BlogPostItemContent>{children}</BlogPostItemContent>
      <Comment/>
      <BlogPostItemFooter />
    </BlogPostItemContainer>
  );
}
