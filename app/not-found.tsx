import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-24 pb-12 text-center">
      <p className="text-6xl font-extrabold text-gray-200 mb-4">404</p>
      <h1 className="text-xl font-bold text-gray-900 mb-2">页面不存在</h1>
      <p className="text-sm text-gray-400 mb-8">
        你访问的页面可能已被移除或地址有误。
      </p>
      <Link
        href="/"
        className="text-sm text-gray-500 hover:text-gray-900 transition-colors underline underline-offset-2"
      >
        返回首页
      </Link>
    </div>
  );
}
