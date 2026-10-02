import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ThemePreset = "cyber" | "graphite" | "light";
export type FontPreset = "jakarta" | "technical" | "editorial";
export type DensityPreset = "compact" | "comfortable" | "spacious";

type AppearanceState = {
  theme: ThemePreset;
  font: FontPreset;
  density: DensityPreset;
  setTheme: (value: ThemePreset) => void;
  setFont: (value: FontPreset) => void;
  setDensity: (value: DensityPreset) => void;
};

const STORAGE_KEY = "haulwise-appearance-v1";
const DEFAULTS = { theme: "cyber", font: "jakarta", density: "comfortable" } as const;
const AppearanceContext = createContext<AppearanceState | null>(null);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemePreset>(DEFAULTS.theme);
  const [font, setFont] = useState<FontPreset>(DEFAULTS.font);
  const [density, setDensity] = useState<DensityPreset>(DEFAULTS.density);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<typeof DEFAULTS>;
      if (saved.theme) setTheme(saved.theme);
      if (saved.font) setFont(saved.font);
      if (saved.density) setDensity(saved.density);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.font = font;
    root.dataset.density = density;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, font, density }));
  }, [theme, font, density]);

  const value = useMemo(() => ({ theme, font, density, setTheme, setFont, setDensity }), [theme, font, density]);
  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const value = useContext(AppearanceContext);
  if (!value) throw new Error("useAppearance must be used inside AppearanceProvider");
  return value;
}