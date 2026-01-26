import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  )
}

export default MyApp
