"use client"

import { useEffect, useState } from "react"
import {
  FAVORITE_DRIVERS,
  FAVORITE_TEAMS,
  FAVORITE_CARS,
  FAVORITE_TRACKS,
} from "@/data/f1-favorites"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface StandingInfo {
  position: string
  points: string
}

const DriverCard = ({
  driver,
  standing,
}: {
  driver: (typeof FAVORITE_DRIVERS)[number]
  standing?: StandingInfo
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={driver.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group relative flex flex-col items-center gap-2 rounded-md p-3 transition-all duration-200",
            "hover:bg-accent/50"
          )}
        >
          {/* Driver number badge */}
          <span className="font-pixelify text-muted-foreground/40 absolute top-1 right-2 text-[10px] font-bold tabular-nums sm:text-xs">
            #{driver.permanentNumber}
          </span>

          {/* Driver headshot */}
          <div
            className={cn(
              "relative size-14 overflow-hidden rounded-full sm:size-16",
              "border-edge border bg-gradient-to-b from-zinc-800 to-zinc-900",
              "transition-transform duration-200 group-hover:scale-105"
            )}
          >
            <Image
              src={driver.imageUrl}
              alt={`${driver.givenName} ${driver.familyName}`}
              fill
              sizes="64px"
              className="object-cover object-top"
            />
          </div>

          {/* Driver name & standings */}
          <div className="flex flex-col items-center gap-0.5 text-center">
            <span className="text-muted-foreground text-[9px] tracking-wider uppercase sm:text-[10px]">
              {driver.givenName}
            </span>
            <span className="font-pixelify text-primary text-xs leading-tight font-semibold sm:text-sm">
              {driver.familyName}
            </span>
            {standing && (
              <span className="text-muted-foreground/85 font-mono text-[9px] font-medium tracking-tight sm:text-[10px]">
                P{standing.position} • {standing.points} pts
              </span>
            )}
          </div>

          {/* Hover underline indicator */}
          <span className="bg-primary/60 absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 transition-all duration-200 group-hover:w-3/4" />
        </a>
      </TooltipTrigger>
      <TooltipContent className="border-edge bg-popover text-popover-foreground rounded-md border px-2.5 py-1.5 text-[11px] shadow-md">
        <div className="font-pixelify flex items-center gap-1.5">
          <span>Wikipedia Profile</span>
          <svg
            viewBox="0 0 24 24"
            className="size-3 fill-current opacity-70"
            aria-hidden="true"
          >
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
          </svg>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

const TeamCard = ({
  team,
  standing,
}: {
  team: (typeof FAVORITE_TEAMS)[number]
  standing?: StandingInfo
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={team.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group relative flex flex-col items-center justify-center gap-2 rounded-md p-3 transition-all duration-200",
            "hover:bg-accent/50"
          )}
        >
          {/* Team logo */}
          <div className="relative flex h-8 w-20 items-center justify-center sm:h-10 sm:w-24">
            <Image
              src={team.logoUrl}
              alt={`${team.displayName} logo`}
              fill
              unoptimized
              sizes="96px"
              className={cn(
                "object-contain transition-all duration-200",
                team.invertible
                  ? "brightness-90 group-hover:brightness-100 dark:brightness-100 dark:invert"
                  : "brightness-95 group-hover:brightness-100"
              )}
            />
          </div>

          {/* Team name & standings */}
          <div className="flex flex-col items-center gap-0.5 text-center">
            <span className="font-pixelify text-muted-foreground group-hover:text-primary text-[11px] font-medium transition-colors sm:text-xs">
              {team.displayName}
            </span>
            {standing && (
              <span className="text-muted-foreground/85 font-mono text-[9px] font-medium tracking-tight sm:text-[10px]">
                P{standing.position} • {standing.points} pts
              </span>
            )}
          </div>

          {/* Hover underline indicator */}
          <span className="bg-primary/60 absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 transition-all duration-200 group-hover:w-3/4" />
        </a>
      </TooltipTrigger>
      <TooltipContent className="border-edge bg-popover text-popover-foreground rounded-md border px-2.5 py-1.5 text-[11px] shadow-md">
        <div className="font-pixelify flex items-center gap-1.5">
          <span>Wikipedia Page</span>
          <svg
            viewBox="0 0 24 24"
            className="size-3 fill-current opacity-70"
            aria-hidden="true"
          >
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
          </svg>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

const CarCard = ({ car }: { car: (typeof FAVORITE_CARS)[number] }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={car.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group relative flex flex-col items-center gap-2 rounded-md p-3 transition-all duration-200",
            "hover:bg-accent/50"
          )}
        >
          {/* Car Image */}
          <div className="flex h-20 w-full items-center justify-center sm:h-24">
            <Image
              src={car.imageUrl}
              alt={`${car.name} livery`}
              width={200}
              height={80}
              className="h-auto max-h-full w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>

          {/* Car Details */}
          <div className="flex flex-col items-center gap-0.5 text-center">
            <span className="text-muted-foreground text-[9px] tracking-wider uppercase sm:text-[10px]">
              {car.year} • {car.team}
            </span>
            <span className="font-pixelify text-primary text-xs leading-tight font-semibold sm:text-sm">
              {car.name}
            </span>
          </div>

          {/* Hover underline indicator */}
          <span className="bg-primary/60 absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 transition-all duration-200 group-hover:w-3/4" />
        </a>
      </TooltipTrigger>
      <TooltipContent className="border-edge bg-popover text-popover-foreground rounded-md border px-2.5 py-1.5 text-[11px] shadow-md">
        <div className="font-pixelify flex items-center gap-1.5">
          <span>Wikipedia Page</span>
          <svg
            viewBox="0 0 24 24"
            className="size-3 fill-current opacity-70"
            aria-hidden="true"
          >
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
          </svg>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

const CarCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-2 rounded-md p-3">
      <div className="bg-muted h-16 w-full animate-pulse rounded sm:h-20" />
      <div className="flex w-full flex-col items-center gap-1.5">
        <div className="bg-muted h-2 w-12 animate-pulse rounded" />
        <div className="bg-muted h-3.5 w-16 animate-pulse rounded" />
      </div>
    </div>
  )
}

const TrackCard = ({ track }: { track: (typeof FAVORITE_TRACKS)[number] }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group relative flex flex-col items-center gap-3 rounded-md p-4 transition-all duration-200",
            "hover:bg-accent/50"
          )}
        >
          {/* Track Outline Image */}
          <div className="relative h-20 w-full sm:h-24">
            <Image
              src={track.imageUrl}
              alt={`${track.name} layout`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-contain transition-transform duration-200 group-hover:scale-105 dark:invert"
            />
          </div>

          {/* Track Details */}
          <div className="flex flex-col items-center gap-0.5 text-center">
            <span className="text-muted-foreground text-[9px] tracking-wider uppercase sm:text-[10px]">
              {track.location}
            </span>
            <span className="font-pixelify text-primary text-xs leading-tight font-semibold sm:text-sm">
              {track.name}
            </span>
          </div>

          {/* Hover underline indicator */}
          <span className="bg-primary/60 absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 transition-all duration-200 group-hover:w-3/4" />
        </a>
      </TooltipTrigger>
      <TooltipContent className="border-edge bg-popover text-popover-foreground rounded-md border px-2.5 py-1.5 text-[11px] shadow-md">
        <div className="font-pixelify flex items-center gap-1.5">
          <span>Wikipedia Page</span>
          <svg
            viewBox="0 0 24 24"
            className="size-3 fill-current opacity-70"
            aria-hidden="true"
          >
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
          </svg>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

const DriverCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-2 rounded-md p-3">
      <div className="bg-muted size-14 animate-pulse rounded-full sm:size-16" />
      <div className="flex w-full flex-col items-center gap-1.5">
        <div className="bg-muted h-2 w-8 animate-pulse rounded" />
        <div className="bg-muted h-3.5 w-14 animate-pulse rounded" />
        <div className="bg-muted h-2.5 w-12 animate-pulse rounded" />
      </div>
    </div>
  )
}

const TeamCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md p-3">
      <div className="bg-muted h-8 w-20 animate-pulse rounded sm:h-10 sm:w-24" />
      <div className="flex w-full flex-col items-center gap-1.5">
        <div className="bg-muted h-3 w-12 animate-pulse rounded" />
        <div className="bg-muted h-2.5 w-12 animate-pulse rounded" />
      </div>
    </div>
  )
}

export function F1Favorites() {
  const [driverStandings, setDriverStandings] = useState<
    Record<string, StandingInfo>
  >({})
  const [constructorStandings, setConstructorStandings] = useState<
    Record<string, StandingInfo>
  >({})
  const [loading, setLoading] = useState(true)

  // Mobile Load More State
  const [isMobile, setIsMobile] = useState(false)
  const [showAllDrivers, setShowAllDrivers] = useState(false)
  const [showAllTeams, setShowAllTeams] = useState(false)
  const [showAllCars, setShowAllCars] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 640px)").matches)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    let active = true

    async function fetchF1Data() {
      try {
        const [driversRes, constructorsRes] = await Promise.all([
          fetch("https://api.jolpi.ca/ergast/f1/2025/driverStandings.json"),
          fetch(
            "https://api.jolpi.ca/ergast/f1/2025/constructorStandings.json"
          ),
        ])

        if (!driversRes.ok || !constructorsRes.ok) {
          throw new Error("Failed to fetch F1 standings data")
        }

        const driversData = await driversRes.json()
        const constructorsData = await constructorsRes.json()

        if (!active) return

        const driverLists =
          driversData?.MRData?.StandingsTable?.StandingsLists?.[0]
            ?.DriverStandings || []
        const mappedDrivers: Record<string, StandingInfo> = {}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        driverLists.forEach((ds: any) => {
          if (ds?.Driver?.driverId) {
            mappedDrivers[ds.Driver.driverId] = {
              position: ds.position,
              points: ds.points,
            }
          }
        })

        const constructorLists =
          constructorsData?.MRData?.StandingsTable?.StandingsLists?.[0]
            ?.ConstructorStandings || []
        const mappedConstructors: Record<string, StandingInfo> = {}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructorLists.forEach((cs: any) => {
          if (cs?.Constructor?.constructorId) {
            mappedConstructors[cs.Constructor.constructorId] = {
              position: cs.position,
              points: cs.points,
            }
          }
        })

        setDriverStandings(mappedDrivers)
        setConstructorStandings(mappedConstructors)
      } catch (err) {
        console.error("F1 API fetch error:", err)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchF1Data()
    return () => {
      active = false
    }
  }, [])

  const driversToRender =
    isMobile && !showAllDrivers
      ? FAVORITE_DRIVERS.slice(0, 3)
      : FAVORITE_DRIVERS

  const teamsToRender =
    isMobile && !showAllTeams ? FAVORITE_TEAMS.slice(0, 3) : FAVORITE_TEAMS

  const carsToRender =
    isMobile && !showAllCars ? FAVORITE_CARS.slice(0, 2) : FAVORITE_CARS

  const driverSkeletonsCount = isMobile && !showAllDrivers ? 3 : 6
  const teamSkeletonsCount = isMobile && !showAllTeams ? 3 : 4
  const carSkeletonsCount = isMobile && !showAllCars ? 2 : 4

  return (
    <TooltipProvider>
      <div className="grid w-full grid-cols-1 md:grid-cols-2">
        {/* Drivers */}
        <article className="border-edge border-b-[1px] p-3 md:border-r-[1px]">
          <div className="flex h-full flex-col gap-3">
            <div className="space-y-0.5">
              <h3 className="font-pixelify text-primary text-lg font-semibold">
                Drivers
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Drivers I follow across seasons.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1 sm:grid-cols-3">
              {loading
                ? Array.from({ length: driverSkeletonsCount }).map((_, i) => (
                    <DriverCardSkeleton key={i} />
                  ))
                : driversToRender.map((driver) => (
                    <DriverCard
                      key={driver.driverId}
                      driver={driver}
                      standing={driverStandings[driver.driverId]}
                    />
                  ))}
            </div>

            {isMobile && (
              <button
                type="button"
                onClick={() => setShowAllDrivers(!showAllDrivers)}
                className="font-pixelify text-muted-foreground hover:text-primary mt-1.5 cursor-pointer self-center text-xs underline"
              >
                {showAllDrivers ? "See Less" : "Load More"}
              </button>
            )}
          </div>
        </article>

        {/* Teams */}
        <article className="border-edge border-b-[1px] p-3">
          <div className="flex h-full flex-col gap-3">
            <div className="space-y-0.5">
              <h3 className="font-pixelify text-primary text-lg font-semibold">
                Teams
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Teams, liveries, and engineering stories I love.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1 sm:grid-cols-3">
              {loading
                ? Array.from({ length: teamSkeletonsCount }).map((_, i) => (
                    <TeamCardSkeleton key={i} />
                  ))
                : teamsToRender.map((team) => (
                    <TeamCard
                      key={team.constructorId}
                      team={team}
                      standing={constructorStandings[team.constructorId]}
                    />
                  ))}
            </div>

            {isMobile && (
              <button
                type="button"
                onClick={() => setShowAllTeams(!showAllTeams)}
                className="font-pixelify text-muted-foreground hover:text-primary mt-1.5 cursor-pointer self-center text-xs underline"
              >
                {showAllTeams ? "See Less" : "Load More"}
              </button>
            )}
          </div>
        </article>

        {/* Cars */}
        <article className="border-edge border-b-[1px] p-3 md:col-span-2">
          <div className="flex h-full flex-col gap-3">
            <div className="space-y-0.5">
              <h3 className="font-pixelify text-primary text-lg font-semibold">
                Cars
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Iconic machines that define F1 history for me.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {loading
                ? Array.from({ length: carSkeletonsCount }).map((_, i) => (
                    <CarCardSkeleton key={i} />
                  ))
                : carsToRender.map((car) => (
                    <CarCard key={car.carId} car={car} />
                  ))}
            </div>

            {isMobile && (
              <button
                type="button"
                onClick={() => setShowAllCars(!showAllCars)}
                className="font-pixelify text-muted-foreground hover:text-primary mt-1.5 cursor-pointer self-center text-xs underline"
              >
                {showAllCars ? "See Less" : "Load More"}
              </button>
            )}
          </div>
        </article>

        {/* Tracks */}
        <article className="border-edge col-span-1 p-3 md:col-span-2">
          <div className="flex h-full flex-col gap-3">
            <div className="space-y-0.5">
              <h3 className="font-pixelify text-primary text-lg font-semibold">
                Tracks
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Circuits that define speed and drama for me.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {FAVORITE_TRACKS.map((track) => (
                <TrackCard key={track.trackId} track={track} />
              ))}
            </div>
          </div>
        </article>
      </div>
    </TooltipProvider>
  )
}
