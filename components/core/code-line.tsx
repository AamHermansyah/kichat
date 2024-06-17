import React from 'react';
import { Inconsolata } from 'next/font/google'
import clsx from 'clsx';

interface CodeLineProps {
  children: React.ReactNode;
}

const firaCode = Inconsolata({ subsets: ['latin'], weight: ['700'] });

function CodeLine({ children }: CodeLineProps) {
  return (
    <code className={clsx(
      'inline-block text-sm px-2 py-1 font-semibold rounded-md bg-gray-100',
      firaCode.className
    )}>
      {children}
    </code>
  )
}

export default CodeLine