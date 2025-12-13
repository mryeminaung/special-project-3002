import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import {
	Image,
	ImageBackground,
	KeyboardAvoidingView,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";

export default function LoginScreen() {
	return (
		<ImageBackground
			source={require("@/assets/images/main-bg.jpg")}
			className="flex-1"
			resizeMode="cover">
			<KeyboardAvoidingView
				className="flex-1"
				behavior={"padding"}
				keyboardVerticalOffset={-50}>
				<View className="flex-1 items-center justify-center px-4">
					<LinearGradient
						colors={["#300050", "#FFFFFF", "#FFFFFF"]}
						start={{ x: 0, y: 0 }}
						end={{ x: 0, y: 1 }}
						style={{ borderRadius: 15 }}
						className="p-1 pt-1.5 w-full">
						<View className="w-full px-5 bg-white rounded-xl py-5">
							<Image
								source={require("@/assets/images/logo_bg_rm.png")}
								className="h-32 w-full mb-2"
								resizeMode="cover"
							/>
							<View className="mb-5">
								<Text className="font-semibold">Email</Text>
								<TextInput
									className="border border-gray-400 px-3 py-3.5 rounded-lg mt-2"
									placeholder="example@miit.edu.mm"
								/>
							</View>
							<View className="mb-5">
								<Text className="font-semibold">Password</Text>
								<TextInput
									textContentType="password"
									className="border border-gray-400 px-3 py-3.5 rounded-lg mt-2"
									placeholder="********"
									secureTextEntry={true}
								/>
							</View>
							<View className="flex-row justify-between items-center mb-5">
								<View>
									<Text className="text-[13px]">Remember Me</Text>
								</View>
								<Link href={"/(auth)/login"}>
									<Text className="text-[13px]">Forget your password?</Text>
								</Link>
							</View>
							<Pressable className="bg-[#300050]/90 py-3.5 rounded-lg">
								<Text className="text-white text-center font-semibold">
									Login
								</Text>
							</Pressable>
						</View>
					</LinearGradient>
				</View>
			</KeyboardAvoidingView>
		</ImageBackground>
	);
}
