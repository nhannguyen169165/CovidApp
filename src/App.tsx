import "./App.css";
import Layout from "./app/layout/Layout";
import routes from "./route-config";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          caseSensitive={route.exact}
          element={
            <div key={route.path}>
              <Layout>
                <route.Component />
              </Layout>
            </div>
          }
        ></Route>
      ))}
    </Routes>
  );
}

export default App;
