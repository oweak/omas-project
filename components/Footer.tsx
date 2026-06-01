export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-20">
      <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-gray-400">
        <span>&copy; {new Date().getFullYear()} omas</span>
        <span>
          Powered by{" "}
          <a
            href="https://notion.so"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            Notion
          </a>
        </span>
      </div>
    </footer>
  );
}
