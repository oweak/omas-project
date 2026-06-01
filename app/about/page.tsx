import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-12 pb-12">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">关于</h1>
      <div className="prose max-w-none">
        <p>
          Hi，我是一名开发者，专注于前端工程与用户体验。
        </p>
        <p>
          这个网站用来记录学习笔记、展示项目。如果你对我的工作感兴趣，欢迎联系。
        </p>
        <h2>技术栈</h2>
        <ul>
          <li>React / Next.js / TypeScript</li>
          <li>Tailwind CSS / Node.js</li>
          <li>Notion API</li>
        </ul>
        <h2>联系</h2>
        <ul>
          <li>
            GitHub:{" "}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              @yourusername
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
