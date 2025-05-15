import '../styles/global.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Cursor from '../components/Cursor'
import ScrollIndicator from '../components/ScrollIndicator'

function MyApp({ Component, pageProps, router }) {
  return (
    <>
      <Cursor />
      <ScrollIndicator />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
