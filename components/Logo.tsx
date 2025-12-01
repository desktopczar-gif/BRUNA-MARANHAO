import React from 'react';

// Using a reliable placeholder if the user image isn't available, 
// but styling it to match the uploaded image concept.
export const Logo = ({ className = "h-16 w-16" }: { className?: string }) => {
  // We use the uploaded image from the context if possible, otherwise we render the styled text logo
  const userProvidedImage = "https://raw.githubusercontent.com/google-gemini/gemini-api-cookbook/main/images/logo_placeholder.png"; 
  // Note: Since I cannot host the user's specific image, I will create a CSS/SVG composition that mimics the "BM" logo style.
  
  return (
    <div className={`relative flex items-center justify-center rounded-full border-2 border-brand-700 p-1 ${className}`}>
        <div className="flex h-full w-full items-center justify-center rounded-full bg-brand-700 text-white font-serif tracking-tighter">
             <span className="text-2xl font-light italic mr-1">B</span>
             <span className="text-2xl font-normal ml-[-5px] mt-2">M</span>
        </div>
    </div>
  );
};