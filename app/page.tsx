import Link from "next/link"
import Image from "next/image"
import { PanelsTopLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toogle"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header />
      <Main />
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-14 flex items-center justify-between mx-auto px-4">
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-85 transition-opacity duration-300"
        >
          <PanelsTopLeft className="h-6 w-6" />
          <span className="font-bold">Data Visualization</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="https://ui.shadcn.com/">Learn More</Link>
          </Button>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}

function Main() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center">
      <Hero />
      <DemoImage />
      <Features />
    </main>
  )
}

function Hero() {
  return (
    <section className="w-full px-4 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="container mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          Visualize data seamlessly with APIs
        </h1>
        <p className="max-w-[52rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          An intuitive and responsive interface for Next.js, designed for
          visualizing data in real-time using APIs, with a sleek
          retractable sidebar built on top of shadcn/ui.
        </p>
        <div className="space-x-4 my-5">
          <Button size="lg" asChild>
            <Link href="/dashboard">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="https://ui.shadcn.com/">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function DemoImage() {
  return (
    <section className="container md:py-6 lg:py-12 px-4">
      <div className="mx-auto max-w-5xl space-y-12 text-center">
        <div className="relative mx-auto aspect-video w-full overflow-hidden rounded-xl border bg-background shadow-xl">
          <Image
            src="/assets/demo-1.jpg"
            alt="Dashboard Preview"
            layout="fill"
            objectFit="cover"
            className="dark:hidden"
          />
          <Image
            src="/assets/demo-1.jpg"
            alt="Dashboard Preview (Dark)"
            layout="fill"
            objectFit="cover"
            className="hidden dark:block"
          />
        </div>
      </div>
    </section>
  )
}

function Features() {
  const featureItems = [
    {
      title: "Real-time Data",
      description: "Visualize data in real-time using APIs",
    },
    {
      title: "Responsive Design",
      description: "Seamless experience on both desktop and mobile",
    },
    {
      title: "Customizable",
      description: "Built on top of shadcn/ui for easy customization",
    },
    {
      title: "Dark Mode",
      description: "Toggle between light and dark themes",
    },
    {
      title: "Retractable Sidebar",
      description: "Efficient navigation with a collapsible sidebar",
    },
    {
      title: "Next.js Integration",
      description: "Leverages the power of Next.js framework",
    },
  ]

  return (
    <section className="container space-y-6 py-8 md:py-12 lg:py-24 px-4">
      <div className="mx-auto flex max-w-3xl flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Features
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          This project combines powerful features to enhance your data visualization experience.
        </p>
      </div>
      <div className="mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl">
        {featureItems.map((item) => (
          <div key={item.title} className="relative overflow-hidden rounded-lg border bg-background p-4">
            <div className="flex h-full flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col mx-auto items-center justify-between gap-4 md:h-24 md:flex-row px-4">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <Link
              href="https://github.com/rammm2005"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              MarmutMerahJambu
            </Link>
            . The source code is available on{" "}
            <Link
              href="https://github.com/rammm2005/Data-Visualitation-Challenge"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}