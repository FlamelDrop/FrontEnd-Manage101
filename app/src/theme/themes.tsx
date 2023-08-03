import { softShadows, strongShadows } from './shadows';
import { colors } from '@material-ui/core';
import typography from './typography';

export const THEMES = {
  LIGHT: 'LIGHT',
  ONE_DARK: 'ONE_DARK',
  UNICORN: 'UNICORN',
};

export const baseConfig = {
  direction: 'ltr',
  typography,
  overrides: {
    MuiLinearProgress: {
      root: {
        borderRadius: 3,
        overflow: 'hidden',
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 32,
      },
    },
    MuiChip: {
      root: {
        backgroundColor: 'rgba(0,0,0,0.075)',
      },
    },
    MuiPaper: {
      root: {
        padding : '40px 30px'
      },
    },
    MuiInputLabel:{
      formControl:{
        fontSize :'21px',
        lineHeight: '13px'
      }
    },
    MuiFormLabel:{
      root:{
        marginBottom: 20,
        fontWeight: 700,
        fontSize :'21px',
        lineHeight: '21px',
        display: 'block',
        width: '100%'
      },
      asterisk:{
        color: 'red'
      }
    },
    MuiFormControl: {
      marginNormal: {
        marginTop: 0
      }
    },
    PrivateNotchedOutline:{
      root:{
        fontSize :'21px',
        lineHeight: '21px'
      }
    },
    MTableToolbar:{
        padding: 0,
        display: 'none'
    },
    MuiTableCell:{
      root : {
        padding : '15px 8px'
      }
    },
    MuiTableBody :{
      root:{
        '& > tr:nth-child(even) td':{
          backgroundColor: 'rgba(0,0,0,0.03)',
        }
      }
    },
    MuiButton:{
      root:{
        fontSize :'16px',
      }
    },
    MuiTableSortLabel:{
      root:{
        '& .MuiTableSortLabel-icon':{
          margin: 0,
          fontSize: 15
        }
      }
    },
    MuiTable:{
      root:{
        '& thead tr th:first-child':{
          '& .MuiCheckbox-colorSecondary.Mui-checked':{
            color: '#fff !important',
          },
        },
      }
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 767,
        md: 1024,
        lg: 1280,
        xl: 1920,
      },
    },  
  },
};

export const themeConfigs = [
  {
    name: THEMES.LIGHT,
    overrides: {
      MuiInputBase: {
        input: {
          '&::placeholder': {
            opacity: 1,
            color: colors.blueGrey[600],
          },
        },
      },
      MuiTableCell: {
        head: {
          backgroundColor: '#ff6f00 !important',
          color: '#FFF',
          fontWeight: 'bold',
          fontSize: '16px',
          lineHeight: '18px'
        }
      },
      MuiTab:{
        root: {
          padding: '20px 10px',
          fontWeight: 'bold',
          fontSize: '16px',
          lineHeight: '16px',
        },
        wrapped: {
          fontSize: 'inherit'
        }
      },
    },
    palette: {
      type: 'light',
      action: {
        active: colors.blueGrey[600],
      },
      background: {
        default: colors.common.white,
        dark: '#f4f6f8',
        paper: colors.common.white,
      },
      primary: {
        main: '#ff6f00', //colors.indigo[600],
      },
      // secondary: {
      //   main: '#7b878b', //'#5850EC',
      // },
      text: {
        primary: colors.blueGrey[900],
        secondary: colors.blueGrey[600],
      },
    },
    shadows: softShadows,
  },
  {
    name: THEMES.ONE_DARK,
    palette: {
      type: 'dark',
      action: {
        active: 'rgba(255, 255, 255, 0.54)',
        hover: 'rgba(255, 255, 255, 0.04)',
        selected: 'rgba(255, 255, 255, 0.08)',
        disabled: 'rgba(255, 255, 255, 0.26)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)',
        focus: 'rgba(255, 255, 255, 0.12)',
      },
      background: {
        default: '#282C34',
        dark: '#1c2025',
        paper: '#282C34',
      },
      primary: {
        main: '#8a85ff',
      },
      secondary: {
        main: '#8a85ff',
      },
      text: {
        primary: '#e6e5e8',
        secondary: '#adb0bb',
      },
    },
    shadows: strongShadows,
  },
  {
    name: THEMES.UNICORN,
    palette: {
      type: 'dark',
      action: {
        active: 'rgba(255, 255, 255, 0.54)',
        hover: 'rgba(255, 255, 255, 0.04)',
        selected: 'rgba(255, 255, 255, 0.08)',
        disabled: 'rgba(255, 255, 255, 0.26)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)',
        focus: 'rgba(255, 255, 255, 0.12)',
      },
      background: {
        default: '#2a2d3d',
        dark: '#222431',
        paper: '#2a2d3d',
      },
      primary: {
        main: '#a67dff',
      },
      secondary: {
        main: '#a67dff',
      },
      text: {
        primary: '#f6f5f8',
        secondary: '#9699a4',
      },
    },
    shadows: strongShadows,
  },
];
