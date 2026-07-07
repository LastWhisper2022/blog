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
import { ArrowRight, Calendar, Clock, Delete, KeyRound, RotateCcw } from 'lucide-react';
import Comment from '@site/src/components/Comment';

type BlogPostFrontMatter = {
  image?: string;
};

type BlogPostMetadataWithAssets = {
  assets?: {
    image?: string;
  };
};

const TIME_PASSWORD_GROUPS = [
  {label: '年轮', size: 4},
  {label: '月相', size: 2},
  {label: '日影', size: 2},
  {label: '时针', size: 2},
  {label: '分针', size: 2},
];
const LOCK_KEYPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const ENABLE_LIFE_POST_LOCK = false;

function getCurrentTimePassword() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${y}${m}${d}${h}${min}`;
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
  const [expectedPassword, setExpectedPassword] = useState(() => getCurrentTimePassword());

  const isLifePost = ENABLE_LIFE_POST_LOCK && metadata.tags?.some((tag) => tag.label === '生活');
  const assetsImage = (metadata as BlogPostMetadataWithAssets).assets?.image;
  const image = assetsImage || (frontMatter as BlogPostFrontMatter).image || '/img/default.png';
  const containerClassName = useContainerClassName();
  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const formatDate = (blogDate: string) =>
    dateTimeFormat.format(new Date(blogDate));

  const normalizedInputPassword = inputPassword.trim();
  const hasPasswordInput = normalizedInputPassword.length > 0;
  const isPasswordInputValid =
    hasPasswordInput && expectedPassword.startsWith(normalizedInputPassword);
  const isPasswordComplete = normalizedInputPassword.length === 12;
  const inputSlots = Array.from({length: 12}, (_, index) => ({
    digit: normalizedInputPassword[index] ?? '',
    isFilled: index < normalizedInputPassword.length,
    isMatched:
      index < normalizedInputPassword.length &&
      normalizedInputPassword[index] === expectedPassword[index],
  }));
  const correctDigitCount = inputSlots.filter((slot) => slot.isMatched).length;

  useEffect(() => {
    if (!isBlogPostPage || !isLifePost) return;
    setIsUnlocked(false);
    setInputPassword('');
    setAuthError('');
  }, [isBlogPostPage, isLifePost, permalink]);

  useEffect(() => {
    if (!isBlogPostPage || !isLifePost || isUnlocked) return;

    const updateExpectedPassword = () => {
      setExpectedPassword(getCurrentTimePassword());
    };

    updateExpectedPassword();
    const timer = window.setInterval(updateExpectedPassword, 1000);
    return () => window.clearInterval(timer);
  }, [isBlogPostPage, isLifePost, isUnlocked]);

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

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const expected = getCurrentTimePassword();
    setExpectedPassword(expected);

    if (normalizedInputPassword === expected) {
      setIsUnlocked(true);
      setAuthError('');
      setInputPassword('');
      return;
    }
    setAuthError('这一分钟没有对齐，再校准一次');
  };

  const handleKeypadInput = (digit: string) => {
    setInputPassword((value) => `${value}${digit}`.slice(0, 12));
    setAuthError('');
  };

  const handleDeleteInput = () => {
    setInputPassword((value) => value.slice(0, -1));
    setAuthError('');
  };

  const handleResetInput = () => {
    setInputPassword('');
    setAuthError('');
  };

  if (isBlogPostPage && isLifePost && !isUnlocked) {
    return (
      <BlogPostItemContainer className={clsx(containerClassName, className)}>
        <div className="tw-mx-auto tw-my-20 tw-max-w-xl">
          <div className="tw-relative tw-overflow-hidden tw-rounded-2xl tw-border tw-border-gray-800 tw-bg-[#101312] tw-p-4 tw-shadow-2xl tw-shadow-black/30 md:tw-p-6">
            <div className="tw-pointer-events-none tw-absolute tw-inset-0 tw-bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.14),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_38%)]" />
            <div className="tw-relative tw-rounded-xl tw-border tw-border-white/10 tw-bg-black/30 tw-p-4 md:tw-p-5">
              <div className="tw-mb-5 tw-flex tw-items-center tw-justify-between tw-gap-4">
                <div className="tw-flex tw-items-center tw-gap-3">
                  <div className="tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-lg tw-border tw-border-green-400/30 tw-bg-green-400/10 tw-text-green-300">
                    <KeyRound className="tw-h-5 tw-w-5" />
                  </div>
                  <div>
                    <div className="tw-text-[10px] tw-font-semibold tw-uppercase tw-tracking-[0.24em] tw-text-green-300/80">
                      此刻校准
                    </div>
                    <h2 className="tw-m-0 tw-text-xl tw-font-semibold tw-leading-tight tw-text-white md:tw-text-2xl">
                      把此刻写成一串坐标
                    </h2>
                  </div>
                </div>
                <div className="tw-flex tw-items-center tw-gap-2 tw-rounded-full tw-border tw-border-white/10 tw-bg-white/[0.04] tw-px-3 tw-py-1.5 tw-font-mono tw-text-xs tw-text-gray-300">
                  <span
                    className={clsx(
                      "tw-h-2 tw-w-2 tw-rounded-full",
                      !hasPasswordInput && "tw-bg-gray-500",
                      hasPasswordInput && isPasswordInputValid && "tw-bg-green-400 tw-shadow-[0_0_14px_rgba(74,222,128,0.9)]",
                      hasPasswordInput && !isPasswordInputValid && "tw-bg-red-400 tw-shadow-[0_0_14px_rgba(248,113,113,0.9)]",
                    )}
                  />
                  {correctDigitCount}/12
                </div>
              </div>

              <div className="tw-mb-4 tw-grid tw-grid-cols-5 tw-gap-2">
                {TIME_PASSWORD_GROUPS.map((group) => (
                  <div
                    key={group.label}
                    className="tw-rounded-lg tw-border tw-border-white/10 tw-bg-white/[0.04] tw-px-2 tw-py-3 tw-text-center"
                  >
                    <div className="tw-text-[10px] tw-font-semibold tw-tracking-[0.18em] tw-text-gray-500">
                      {group.label}
                    </div>
                    <div className="tw-mt-1 tw-font-mono tw-text-sm tw-text-gray-300">
                      {'0'.repeat(group.size).replace(/0/g, '•')}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handlePasswordSubmit} className="tw-flex tw-flex-col tw-gap-4">
                <div className="tw-grid tw-grid-cols-12 tw-gap-1.5">
                  {inputSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={clsx(
                        "tw-flex tw-aspect-square tw-items-center tw-justify-center tw-rounded-md tw-border tw-font-mono tw-text-sm tw-transition-colors md:tw-text-base",
                        !slot.isFilled && "tw-border-white/10 tw-bg-black/30 tw-text-gray-700",
                        slot.isFilled && slot.isMatched && "tw-border-green-400/80 tw-bg-green-400/15 tw-text-green-300 tw-shadow-[0_0_18px_rgba(74,222,128,0.12)]",
                        slot.isFilled && !slot.isMatched && "tw-border-red-400/80 tw-bg-red-400/15 tw-text-red-300 tw-shadow-[0_0_18px_rgba(248,113,113,0.12)]",
                      )}
                    >
                      {slot.digit || ''}
                    </div>
                  ))}
                </div>

                <div className="tw-flex tw-min-h-5 tw-items-center tw-justify-between tw-gap-3 tw-text-xs tw-text-gray-400">
                  <span>
                    {hasPasswordInput
                      ? isPasswordInputValid
                        ? '坐标仍在这一刻'
                        : '有一位偏离了此刻'
                      : '年、月、日、时、分，连成十二位'}
                  </span>
                  <span className="tw-font-mono">{normalizedInputPassword.length}/12</span>
                </div>

                <div className="tw-grid tw-grid-cols-3 tw-gap-2">
                  {LOCK_KEYPAD.map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeypadInput(digit)}
                      disabled={isPasswordComplete}
                      className="tw-flex tw-h-12 tw-items-center tw-justify-center tw-rounded-lg tw-border tw-border-white/10 tw-bg-white/[0.06] tw-font-mono tw-text-lg tw-text-white tw-transition-colors hover:tw-border-green-400/40 hover:tw-bg-green-400/10 disabled:tw-cursor-not-allowed disabled:tw-opacity-40"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleResetInput}
                    className="tw-flex tw-h-12 tw-items-center tw-justify-center tw-rounded-lg tw-border tw-border-white/10 tw-bg-white/[0.04] tw-text-gray-300 tw-transition-colors hover:tw-border-white/20 hover:tw-bg-white/10"
                    aria-label="清空"
                  >
                    <RotateCcw className="tw-h-4 tw-w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadInput('0')}
                    disabled={isPasswordComplete}
                    className="tw-flex tw-h-12 tw-items-center tw-justify-center tw-rounded-lg tw-border tw-border-white/10 tw-bg-white/[0.06] tw-font-mono tw-text-lg tw-text-white tw-transition-colors hover:tw-border-green-400/40 hover:tw-bg-green-400/10 disabled:tw-cursor-not-allowed disabled:tw-opacity-40"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteInput}
                    className="tw-flex tw-h-12 tw-items-center tw-justify-center tw-rounded-lg tw-border tw-border-white/10 tw-bg-white/[0.04] tw-text-gray-300 tw-transition-colors hover:tw-border-white/20 hover:tw-bg-white/10"
                    aria-label="删除"
                  >
                    <Delete className="tw-h-4 tw-w-4" />
                  </button>
                </div>

                {authError && (
                  <div className="tw-text-sm tw-text-red-500">{authError}</div>
                )}
                <button
                  type="submit"
                  disabled={!isPasswordComplete}
                  className="tw-flex tw-items-center tw-justify-center tw-gap-2 tw-rounded-xl tw-bg-green-400 tw-px-4 tw-py-3 tw-text-sm tw-font-semibold tw-text-gray-950 tw-transition-colors hover:tw-bg-green-300 disabled:tw-cursor-not-allowed disabled:tw-bg-white/10 disabled:tw-text-gray-500"
                >
                  <KeyRound className="tw-h-4 tw-w-4" />
                  对齐此刻
                </button>
              </form>
            </div>
          </div>
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
