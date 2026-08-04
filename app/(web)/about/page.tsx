import About from "@/modules/about/ui/About"
import AwardHero from "@/modules/about/ui/AwardHero"
import Cards from "@/modules/about/ui/Cards"
import Clients from "@/modules/about/ui/Clients"
import Header from "@/modules/about/ui/Header"

const AboutPage = () => {
  return (
    <div className='overflow-hidden bg-black'>
      <Header />
      <About />
      {/* <Clients /> */}
      <AwardHero />
      {/* <Cards /> */}
    </div>
  )
}

export default AboutPage