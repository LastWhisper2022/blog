import React, {type ReactNode, type CSSProperties} from 'react';
import type {Props} from '@theme/BlogPostItem/Container';

export default function BlogPostItemContainer({
  children,
  className,
  style,
}: Props & {style?: CSSProperties}): ReactNode {
  return <article className={className} style={style}>{children}</article>;
}
