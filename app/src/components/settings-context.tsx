import React, { createContext, useState, useEffect } from 'react';
import _ from 'lodash';
import { THEMES } from 'src/theme';
import { storeSettings } from 'src/utils/settings';

const SettingsContext = createContext(null);

const defaultSettings = {
  direction: 'ltr',
  responsiveFontSizes: true,
  theme: THEMES.LIGHT,
};

interface ISettingsProvider {
  children: any;
  settings?: any;
}
export function SettingsProvider(props: ISettingsProvider) {
  const { settings, children } = props;
  const [currentSettings, setCurrentSettings] = useState(settings || defaultSettings);

  // const handleSaveSettings = (updatedSettings = {}) => {
  //   // const mergedSettings = _.merge({}, currentSettings, updatedSettings);

  //   setCurrentSettings(mergedSettings);
  //   storeSettings(mergedSettings);
  // };

  useEffect(() => {
    document.dir = currentSettings.direction;
  }, [currentSettings]);

  return (
    // <SettingsContext.Provider
    //   value={
    //     {
    //       settings: currentSettings,
    //       saveSettings: handleSaveSettings,
    //     } as any
    //   }
    // >
      {children}
    // </SettingsContext.Provider>
  );
}

export const SettingsConsumer = SettingsContext.Consumer;

export default SettingsContext;
