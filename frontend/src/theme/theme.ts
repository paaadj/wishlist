import { extendTheme } from "@chakra-ui/react";
import tableStyles from "./tableStyles";

// const config = {
//   initialColorMode: "dark",
//   useSystemColorMode: false,
// };

const theme = extendTheme({
  tableStyles
});

export default theme;