'use client';

import type { ReactNode } from 'react';

import { CustomCursor } from '@/components/lux/CustomCursor';

type RootTemplateProps = {
  children: ReactNode;
};

export default function RootTemplate({ children }: RootTemplateProps) {
  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
}
