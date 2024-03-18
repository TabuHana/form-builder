'use client';

import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon, LaptopMinimalIcon } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHasMounted } from '@/hooks/use-has-mounted';

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const isMounted = useHasMounted();

    if (!isMounted) {
        return null;
    }

    return (
        <Tabs defaultValue={theme}>
            <TabsList>
                <TabsTrigger
                    value='system'
                    onClick={() => setTheme('system')}
                >
                    <LaptopMinimalIcon className='w-4 h-4' />
                </TabsTrigger>
                <TabsTrigger
                    value='light'
                    onClick={() => setTheme('light')}
                >
                    <SunIcon className='w-4 h-4' />
                </TabsTrigger>
                <TabsTrigger
                    value='dark'
                    onClick={() => setTheme('dark')}
                >
                    <MoonIcon className='w-4 h-4' />
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
};
