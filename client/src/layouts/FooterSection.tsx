const FooterSection = () => {
  return (
    <footer className="w-full bg-[#641515] text-white py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm">
        {/* Left side */}
        <p className="mb-2 sm:mb-0">
          © {new Date().getFullYear()} Tareque Mahmud. All rights reserved.
        </p>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <p>
            Developed by <span className="font-semibold">Tareque Mahmud</span>
          </p>
          <a
            href="https://github.com/TarequeMahmud"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
