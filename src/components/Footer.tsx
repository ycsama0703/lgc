const MEMBERS = ["Yang Jinrui", "Peng Junwen", "Liu Yuncong", "Wang Liyuan"];

export function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-12 py-6 px-4 text-center space-y-1">
      <p className="text-gray-400 text-sm font-semibold">QF5208 · L&amp;G Group</p>
      <p className="text-gray-600 text-xs">{MEMBERS.join(" · ")}</p>
      <p className="text-gray-600 text-xs">
        Contact:{" "}
        <a
          href="mailto:yuncongliu@u.nus.edu"
          className="text-indigo-500 hover:text-indigo-300 underline"
        >
          yuncongliu@u.nus.edu
        </a>
      </p>
    </footer>
  );
}
