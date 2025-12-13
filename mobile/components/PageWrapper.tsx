import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PageWrapper({ children }: any) {
	return <SafeAreaView className="flex-1 px-3">{children}</SafeAreaView>;
}
