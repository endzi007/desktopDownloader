import { createMuiTheme } from '@material-ui/core/styles';
import { amber, blue, cyan } from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette:{
        type: "light",
        primary: {
            main: "#0097a7"
        }, 
        secondary: {
            main: "#66bb6a"
        }
    },
  typography: {
      fontFamily: "Raleway, Georgia, Times, Times New Roman, serif"
  },

});

export default theme;
