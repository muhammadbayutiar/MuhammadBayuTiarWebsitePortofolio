/**
 * Reliable scroll to section with retry logic and dynamic navbar height detection
 * Handles hydration timing issues and ensures mobile consistency
 * 
 * Implementation:
 * - Retries DOM lookup using requestAnimationFrame
 * - Dynamically detects navbar height from actual nav element
 * - Uses window.scrollTo for cross-browser reliability
 * - No setTimeout hacks - uses RAF frame queuing for proper timing
 */

interface ScrollOptions {
  maxRetries?: number;
  behavior?: ScrollBehavior;
}

/**
 * Get the actual navbar height by measuring the nav element
 */
function getNavbarHeight(): number {
  const nav = document.querySelector('nav');
  if (nav) {
    return nav.getBoundingClientRect().height || 80;
  }
  return 80; // Fallback to default if nav not found
}

/**
 * Scroll to a section with retry logic to handle hydration issues
 */
export function scrollToSection(
  id: string,
  options: ScrollOptions = {}
): void {
  const { maxRetries = 3, behavior = 'smooth' } = options;
  let retryCount = 0;

  const attemptScroll = (): void => {
    const element = document.getElementById(id);

    if (!element) {
      retryCount++;
      if (retryCount < maxRetries) {
        // Retry using requestAnimationFrame for next frame
        requestAnimationFrame(attemptScroll);
      } else {
        console.warn(`[Scroll] Section not found after ${maxRetries} retries: ${id}`);
      }
      return;
    }

    // Element found - calculate position with dynamic navbar height
    const navbarHeight = getNavbarHeight();
    const elementRect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const elementTop = elementRect.top + scrollTop;
    const targetScroll = Math.max(0, elementTop - navbarHeight);

    // Perform the scroll
    window.scrollTo({
      top: targetScroll,
      behavior: behavior as ScrollBehavior,
    });
  };

  // Start attempt on next frame to ensure DOM is ready
  requestAnimationFrame(attemptScroll);
}

