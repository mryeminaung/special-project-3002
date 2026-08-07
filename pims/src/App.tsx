import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { routes } from "./routes";

let router = createBrowserRouter(routes);

export default function App() {
	return <RouterProvider router={router} />;
}
