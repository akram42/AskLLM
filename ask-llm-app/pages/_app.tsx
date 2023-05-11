import { ChakraProvider } from '@chakra-ui/react'
import { AppProvider } from '../contexts/AppContext'
import { AppProps } from 'next/app'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </ChakraProvider>
  );
}

export default MyApp;