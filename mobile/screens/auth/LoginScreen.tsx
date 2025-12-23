import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <ImageBackground
      source={require('@/assets/images/bg.png')}
      className='flex-1'
      resizeMode='cover'
    >
      <KeyboardAvoidingView
        className='flex-1'
        behavior={'padding'}
        keyboardVerticalOffset={-50}
      >
        <View className='flex-1 items-center justify-center px-4'>
          <LinearGradient
            colors={['#FFFFFF4D', '#FFFFFFAF', '#FFFFFF4D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ borderRadius: 25 }}
            className='p-1.5 w-full'
          >
            <View className='w-full px-5 bg-white rounded-3xl py-5'>
              <Image
                source={require('@/assets/images/wordmark.png')}
                className='h-32 w-full mb-2'
                resizeMode='cover'
              />

              <View className='mb-5'>
                <Text className='font-semibold'>Email</Text>
                <TextInput
                  className='border border-gray-400 px-3 py-3.5 rounded-full mt-2'
                  placeholder='example@miit.edu.mm'
                />
              </View>

              <View className='mb-5'>
                <Text className='font-semibold'>Password</Text>
                <TextInput
                  textContentType='password'
                  className='border border-gray-400 px-3 py-3.5 rounded-full mt-2'
                  placeholder='********'
                  secureTextEntry={true}
                />
              </View>

              <View className='flex-row justify-between items-center mb-5'>
                <Pressable
                  onPress={() => setRememberMe(!rememberMe)}
                  className='flex-row items-center'
                >
                  <Ionicons
                    name={rememberMe ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={rememberMe ? '#472e9c' : '#9ca3af'}
                  />
                  <Text className='text-[13px] ml-2 text-gray-700'>
                    Remember Me
                  </Text>
                </Pressable>

                <Link href={'/(auth)/login'}>
                  <Text className='text-[13px] text-primary-900 font-medium'>
                    Forgot your password?
                  </Text>
                </Link>
              </View>

              <Pressable
                className='bg-primary-900 flex-row items-center justify-center py-3.5 px-6 rounded-full active:opacity-80'
                accessibilityRole='button'
                accessibilityLabel='Login'
              >
                <Ionicons name='log-in-outline' size={20} color='white' />
                <Text className='text-white text-lg font-semibold ml-2'>
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
