import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-4 bg-gray-800 text-white text-center">
      Maintained by{' '}
      <a
        href="https://github.com/wantclue"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 transition-colors"
      >
        WantClue
      </a>
    </footer>
  );
};

export default Footer;