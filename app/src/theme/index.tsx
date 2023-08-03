/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import { createTheme, responsiveFontSizes } from '@material-ui/core';
// import { createTheme } from '@material-ui/core/styles'
import { baseConfig, themeConfigs } from './themes';
export { THEMES } from './themes';

export function createThemeCore(settings = {} as any) {
  let themeConfig = themeConfigs.find((theme) => theme.name === settings.theme);

  if (!themeConfig) {
    console.warn(new Error(`The theme ${settings.theme} is not valid`));
    [themeConfig] = themeConfigs;
  }

  let theme = createTheme(_.merge({} as any, baseConfig, themeConfig, { direction: settings.direction }));

  if (settings.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
}
