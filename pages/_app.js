import { ChakraProvider } from "@chakra-ui/react";
export { reportWebVitals } from 'next-axiom';
import theme from "../theme";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
