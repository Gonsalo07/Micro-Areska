import { FeaturedProducts } from './components/featured-products'
import { Hero } from './components/hero'
import { Newsletter } from './components/newsletter'

export function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Newsletter />
    </>
  )
}
