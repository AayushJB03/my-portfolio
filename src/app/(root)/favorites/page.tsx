import { F1Favorites } from "@/components/favorites/f1-favorites"
// import { MovieFavorites } from "@/components/favorites/movie-favorites" // ponytail: re-enable with the section below once TMDB is configured
import { HeaderTitle } from "@/components/profile/header-title"
import { Separator } from "@/components/profile/separator"
import { BackButton } from "@/components/site/back-button"
import { ContainerWrapper } from "@/components/site/container"
import { generateMetaData } from "@/lib/utils"
import Image from "next/image"

export const metadata = generateMetaData(
  "Favorites",
  "A compact list of Aayush Bhadbhade's favorite movies, Formula 1 drivers, teams, and tracks.",
  { path: "/favorites" }
)

const FavoritesPage = () => {
  return (
    <ContainerWrapper>
      <Separator />
      <BackButton title="Home" href="/" />
      <Separator />

      <section className="w-full">
        <HeaderTitle title="Favorites" />

        {/* Formula 1 Section Header */}
        <div className="border-edge full-bleed-border-b flex items-center gap-3 border-b-[1px] px-3 py-2.5">
          <div className="relative h-4 w-9 shrink-0">
            <Image
              src="/assets/f1-logo.png"
              alt="Formula 1 logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-pixelify text-primary text-base font-bold">
            Formula 1
          </span>
        </div>

        {/* F1 Favorites Grid */}
        <F1Favorites />

        {/* ponytail: Movies/Web Series/Anime section needs TMDB_API_KEY +
            list IDs configured — commented out until that's set up.
            Re-enable by uncommenting this block (and the MovieFavorites
            import above) once env.sample's TMDB_* vars are filled in.
        <Separator />

        <div className="border-edge full-bleed-border-b flex items-center gap-3 border-b-[1px] px-3 py-2.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary size-4 shrink-0"
            aria-hidden="true"
          >
            <path
              d="M18 4v16H6V4h12m0-2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 6h2v2H8V6zm8 0h2v2h-2V6zm-8 4h2v2H8v-2zm8 0h2v2h-2v-2zm-8 4h2v2H8v-2zm8 0h2v2h-2v-2zm-8 4h2v2H8v-2zm8 0h2v2h-2v-2z"
              fill="currentColor"
            />
          </svg>
          <span className="font-pixelify text-primary text-base font-bold">
            Movies & Web Series
          </span>
        </div>

        <MovieFavorites />
        */}
      </section>

      <Separator />
    </ContainerWrapper>
  )
}

export default FavoritesPage
