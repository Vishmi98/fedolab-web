import About from "@/modules/about/ui/About"
import AwardHero from "@/modules/about/ui/AwardHero"
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