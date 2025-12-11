import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";
import { useLocation, useNavigation } from "react-router";

NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

export default function ProgressIndicator() {
	const location = useLocation();
	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";

	useEffect(() => {
		NProgress.start();
		// NProgress.set(0.1);
		NProgress.done();
	}, [location.pathname, isLoading]);

	return null;
}
