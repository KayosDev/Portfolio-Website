import '../styles/global.css'
import { AnimatePresence } from 'framer-motion'
import Cursor from '../components/Cursor'
import ScrollIndicator from '../components/ScrollIndicator'

function MyApp({ Component, pageProps, router }) {
  return (
    <>
      <Cursor />
      <ScrollIndicator />
      <AnimatePresence mode="wait" initial={true}>
        <Component key={router.route} {...pageProps} />
      </AnimatePresence>
    </>
  )
}

export default MyApp
