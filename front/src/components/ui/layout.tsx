import { ReactElement } from "react";
import { Outlet, Link } from "react-router-dom";

function Layout(): ReactElement {
  return (
    <>
      <nav className="p-6">
        <ul className="flex gap-4">
          <li>
            <Link to="/" className="text-blue-500">Upload File</Link>
          </li>
          <li>
            <Link to="/files" className="text-blue-500">View Files</Link>
          </li>
        </ul>
      </nav>
      <main className="p-6 flex flex-col gap-8">
        <Outlet />
      </main>
    </>
  );
}

export { Layout };
