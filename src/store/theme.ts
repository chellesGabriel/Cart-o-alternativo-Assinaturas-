import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type StoreThemeProps = {
  isDark: boolean;
  toggleTheme: () => void;
};

export const useStoreTheme = create<StoreThemeProps>()(
  persist(
    set => ({
      isDark: false,
      toggleTheme: () => set(state => ({ isDark: !state.isDark }))
    }),
    { name: 'theme' }
  )
);
