// import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import App from "./App";
import ThemeProvider from "./components/providers/theme-provider";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</QueryClientProvider>,
);
