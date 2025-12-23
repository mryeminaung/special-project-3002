import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View className='flex-1 items-center justify-center bg-white p-4'>
      <Text className='text-2xl font-bold text-primary-800 mb-4 text-center'>
        Welcome to Special Projects!
      </Text>

      <Link href='/(auth)/login' asChild>
        <View className='bg-primary-800 px-6 py-3 rounded-full active:bg-primary-700'>
          <Text className='text-white font-semibold text-lg'>Go to Login</Text>
        </View>
      </Link>
    </View>
  );
}
