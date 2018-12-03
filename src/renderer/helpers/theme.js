import { createMuiTheme } from '@material-ui/core/styles';
import { amber, blue, cyan } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
        main: "#32FFB4"
    },
    secondary: {
        main: "#18ffff"
    },
    grey: {
        main: "#18ffff"
    },
    headers: {
        main: "#fff",
    }
  },
  overrides:{
      MuiSvgIcon:{
          root:{
              backgroundColor: cyan
          },
      },
      MuiStepIcon:{
          root:{
            color: cyan,
            active:{
                color: cyan
            }
          },
          active: {
            color: cyan, 
            fill: cyan
          },
          completed: {
              color: cyan,
              fill: cyan
          }
      }
  },
  typography: {
      fontFamily: "Raleway, Georgia, Times, Times New Roman, serif"
  },

});

export default theme;
