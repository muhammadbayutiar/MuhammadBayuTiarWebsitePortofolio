/**
 * Smooth scroll to a section with proper offset calculation
 * Accounts for fixed navbar height and handles mobile/desktop correctly
 */
export function scrollToSection(id: string, navbarHeight: number = 80): void {
  const element = document.getElementById(id);
  
  if (!element) {
    console.warn(`Section not found: ${id}`);
    return;
  }

  // Calculate position accounting for navbar
  const yOffset = -navbarHeight;
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const targetPosition = elementPosition + yOffset;

  // Use window.scrollTo instead of scrollIntoView for reliability on mobile
  window.scrollTo({
    top: Math.max(0, targetPosition),
    behavior: 'smooth',
  });
}
