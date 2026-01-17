'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { IconMoon, IconSun, IconCamera } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

import { useTheme } from '@/hooks/use-theme';
import { useHeaderInitializer } from '@/hooks/use-header-initializer';
import { useAuthUserStore } from '@/stores/useAuthUserStore';

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
};

export default function SettingsPage() {
  useHeaderInitializer('MIIT | Settings', 'Settings');

  const { theme, toggleTheme } = useTheme();
  const authUser = useAuthUserStore((s) => s.authUser);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProfileForm>({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser) return;

    setForm({
      name: authUser.name ?? '',
      email: authUser.email ?? '',
      phone: authUser.phone ?? '',
      avatar: authUser.avatar ?? '',
    });

    setAvatarPreview(authUser.avatar ?? null);
  }, [authUser]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);

    toast.info('Avatar selected');
  }

  function handleSaveProfile() {
    // TODO: backend
    toast.success('Profile updated');
  }

  return (
    <div className='mx-auto max-w-7xl space-y-8 px-4 py-6'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>Settings</h1>
        <p className='text-sm text-muted-foreground'>
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-4'>
              <Avatar className='size-20'>
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt={form.name} />
                ) : (
                  <AvatarFallback>{form.name?.charAt(0) || 'U'}</AvatarFallback>
                )}
              </Avatar>

              <div>
                <p className='text-sm font-medium'>Profile photo</p>
                <p className='text-xs text-muted-foreground'>
                  Visible to other users
                </p>
              </div>
            </div>

            <div className='flex gap-2'>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                hidden
                onChange={handleAvatarChange}
              />
              <Button
                variant='outline'
                size='sm'
                onClick={() => fileInputRef.current?.click()}
                className='gap-2'
              >
                <IconCamera size={16} />
                Change
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setAvatarPreview(null)}
              >
                Remove
              </Button>
            </div>
          </div>

          <Separator />

          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <FieldContent>
                <Input value={form.name} disabled />
                <FieldDescription>
                  Your full name (cannot be changed)
                </FieldDescription>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input value={form.email} disabled />
                <FieldDescription>Primary email address</FieldDescription>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Phone</FieldLabel>
              <FieldContent>
                <Input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                />
                <FieldDescription>
                  Used for contact and recovery
                </FieldDescription>
              </FieldContent>
            </Field>

            <div className='flex justify-end'>
              <Button
                onClick={handleSaveProfile}
                className='bg-primary-700 hover:bg-primary-800 dark:bg-primary-700 dark:hover:bg-primary-800 dark:text-white'
              >
                Save changes
              </Button>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>

        <CardContent>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm font-medium'>Theme</p>
              <p className='text-sm text-muted-foreground'>
                Light or dark mode
              </p>
            </div>

            <div className='flex items-center gap-3'>
              <Button variant='outline' onClick={toggleTheme} className='gap-2'>
                {theme === 'dark' ? (
                  <>
                    <IconSun size={16} />
                    Light mode
                  </>
                ) : (
                  <>
                    <IconMoon size={16} />
                    Dark mode
                  </>
                )}
              </Button>

              <span className='text-sm text-muted-foreground'>
                Current: <strong>{theme}</strong>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
