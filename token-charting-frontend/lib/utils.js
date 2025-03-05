// Simple polyfill for clsx and tailwind-merge
function clsx(...inputs) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ');
}

function twMerge(...inputs) {
  return clsx(...inputs);
}

function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

module.exports = { cn, clsx, twMerge };