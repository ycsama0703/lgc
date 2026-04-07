const MEMBERS = ["Yang Jinrui", "Peng Junwen", "Liu Yuncong", "Wang Liyuan"];

export function Footer() {
  return (
    <div className="border-t border-gray-800 mt-8 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <div>
        <p className="text-gray-500 text-xs font-medium">QF5208 · L&amp;G Group</p>
        <p className="text-gray-700 text-xs mt-0.5">{MEMBERS.join(" · ")}</p>
      </div>
      <a
        href="mailto:yuncongliu@u.nus.edu"
        className="text-gray-600 hover:text-indigo-400 text-xs transition-colors"
      >
        yuncongliu@u.nus.edu
      </a>
    </div>
  );
}
