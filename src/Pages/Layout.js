import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.css"

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Principal</Link>
          </li>
          <li>
            <Link to="/evaluate">Realizar avaliação</Link>
          </li>
          <li>
            <Link to="/view">Visualizar avaliações</Link>
          </li>
          <li>
            <Link to="/export">Exportar avaliações</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;