import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextProps {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'p'
    | 'blockquote'
    | 'lead'
    | 'large'
    | 'small'
    | 'muted'
    | 'code';
  children: React.ReactNode;
  className?: string;
}

const textVariants = {
  h1: 'scroll-m-20 text-4xl font-bold tracking-tight',
  h2: 'scroll-m-20 border-none pb-2 text-3xl font-semibold tracking-tight first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  p: 'leading-7 [&:not(:first-child)]:mt-6',
  blockquote: 'mt-6 border-l-2 pl-6 italic',
  lead: 'text-xl text-muted-foreground',
  large: 'text-lg font-semibold',
  small: 'text-sm font-medium leading-none',
  muted: 'text-sm text-muted-foreground',
  code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
};

export const Text: React.FC<TextProps> = ({
  variant = 'p',
  children,
  className,
  ...props
}) => {
  const Component = getSemanticTag(variant);

  return (
    <Component className={cn(textVariants[variant], className)} {...props}>
      {children}
    </Component>
  );
};

const getSemanticTag = (variant: TextProps['variant']) => {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'h4':
      return 'h4';
    case 'blockquote':
      return 'blockquote';
    case 'code':
      return 'code';
    case 'small':
      return 'small';
    case 'p':
    case 'lead':
    case 'large':
    case 'muted':
    default:
      return 'p';
  }
};
