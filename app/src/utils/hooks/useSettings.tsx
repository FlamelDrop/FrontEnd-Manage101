import { useContext } from 'react';
import SettingsContext from 'src/components/settings-context';

export default function useSettings(): any {
  const context = useContext(SettingsContext);
  return context;
}
