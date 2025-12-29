'use client';

import { useEffect } from 'react';

export function CustomCursor() {
  useEffect(() => {
    const cursor = document.createElement('div');
    const follower = document.createElement('div');

    cursor.id = 'lux-cursor';
    follower.id = 'lux-cursor-follower';

    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.background = '#fbbf24';
    cursor.style.borderRadius = '50%';
    cursor.style.position = 'fixed';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.transition = 'transform 0.1s ease';
    cursor.style.mixBlendMode = 'difference';

    follower.style.width = '40px';
    follower.style.height = '40px';
    follower.style.border = '2px solid #fbbf24';
    follower.style.borderRadius = '50%';
    follower.style.position = 'fixed';
    follower.style.pointerEvents = 'none';
    follower.style.zIndex = '9998';
    follower.style.transition = 'transform 0.2s ease-out';

    const previousCursor = document.body.style.cursor;

    document.body.style.cursor = 'none';

    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      follower.style.left = `${e.clientX - 10}px`;
      follower.style.top = `${e.clientY - 10}px`;
    };

    const interactiveSelector =
      'a, button, [data-lux-hover], .cursor-pointer, .hover-scale';
    const handleMouseEnter = () => {
      cursor.style.transform = 'scale(4)';
      cursor.style.opacity = '0.2';
      follower.style.transform = 'scale(1.5)';
      follower.style.borderColor = '#ffffff';
    };
    const handleMouseLeave = () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.opacity = '1';
      follower.style.transform = 'scale(1)';
      follower.style.borderColor = '#fbbf24';
    };

    document.addEventListener('mousemove', handleMouseMove);

    const attachHoverListeners = () => {
      document
        .querySelectorAll<HTMLElement>(interactiveSelector)
        .forEach((el) => {
          el.addEventListener('mouseenter', handleMouseEnter);
          el.addEventListener('mouseleave', handleMouseLeave);
        });
    };

    attachHoverListeners();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document
        .querySelectorAll<HTMLElement>(interactiveSelector)
        .forEach((el) => {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        });
      document.body.style.cursor = previousCursor;
      cursor.remove();
      follower.remove();
    };
  }, []);

  return null;
}
