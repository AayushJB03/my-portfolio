export type F1Driver = {
  driverId: string
  givenName: string
  familyName: string
  code: string
  permanentNumber: string
  nationality: string
  url: string
  imageUrl: string
}

export type F1Team = {
  constructorId: string
  name: string
  displayName: string
  nationality: string
  url: string
  logoUrl: string
  invertible: boolean
}

export const FAVORITE_DRIVERS: F1Driver[] = [
  {
    driverId: "max_verstappen",
    givenName: "Max",
    familyName: "Verstappen",
    code: "VER",
    permanentNumber: "1",
    nationality: "Dutch",
    url: "https://en.wikipedia.org/wiki/Max_Verstappen",
    imageUrl:
      "https://media.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png",
  },
  {
    driverId: "hamilton",
    givenName: "Lewis",
    familyName: "Hamilton",
    code: "HAM",
    permanentNumber: "44",
    nationality: "British",
    url: "https://en.wikipedia.org/wiki/Lewis_Hamilton",
    imageUrl:
      "https://media.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png",
  },
  {
    driverId: "sainz",
    givenName: "Carlos",
    familyName: "Sainz",
    code: "SAI",
    permanentNumber: "55",
    nationality: "Spanish",
    url: "https://en.wikipedia.org/wiki/Carlos_Sainz_Jr.",
    imageUrl:
      "https://media.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png",
  },
  {
    driverId: "piastri",
    givenName: "Oscar",
    familyName: "Piastri",
    code: "PIA",
    permanentNumber: "81",
    nationality: "Australian",
    url: "https://en.wikipedia.org/wiki/Oscar_Piastri",
    imageUrl:
      "https://media.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png",
  },
  {
    driverId: "antonelli",
    givenName: "Kimi",
    familyName: "Antonelli",
    code: "ANT",
    permanentNumber: "12",
    nationality: "Italian",
    url: "https://en.wikipedia.org/wiki/Andrea_Kimi_Antonelli",
    imageUrl:
      "https://media.formula1.com/content/dam/fom-website/drivers/A/ANDANT01_Andrea%20Kimi_Antonelli/andant01.png",
  },
  {
    driverId: "alonso",
    givenName: "Fernando",
    familyName: "Alonso",
    code: "ALO",
    permanentNumber: "14",
    nationality: "Spanish",
    url: "https://en.wikipedia.org/wiki/Fernando_Alonso",
    imageUrl:
      "https://media.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png",
  },
]

export const FAVORITE_TEAMS: F1Team[] = [
  {
    constructorId: "ferrari",
    name: "Ferrari",
    displayName: "Ferrari",
    nationality: "Italian",
    url: "https://en.wikipedia.org/wiki/Scuderia_Ferrari",
    logoUrl: "/assets/ferrari-logo.png",
    invertible: false,
  },
  {
    constructorId: "sauber",
    name: "Sauber",
    displayName: "Audi",
    nationality: "Swiss",
    url: "https://en.wikipedia.org/wiki/Sauber_Motorsport",
    logoUrl: "/assets/audi-logo.png",
    invertible: true,
  },
  {
    constructorId: "red_bull",
    name: "Red Bull",
    displayName: "Red Bull",
    nationality: "Austrian",
    url: "https://en.wikipedia.org/wiki/Red_Bull_Racing",
    logoUrl: "/assets/redbull-logo.png",
    invertible: false,
  },
  {
    constructorId: "mercedes",
    name: "Mercedes",
    displayName: "Mercedes",
    nationality: "German",
    url: "https://en.wikipedia.org/wiki/Mercedes-Benz_in_Formula_One",
    logoUrl: "/assets/mercedes-logo.png",
    invertible: true,
  },
]

export type F1Car = {
  carId: string
  name: string
  team: string
  year: string
  url: string
  imageUrl: string
}

export const FAVORITE_CARS: F1Car[] = [
  {
    carId: "red_bull_verstappen",
    name: "Red Bull Racing",
    team: "Red Bull Racing",
    year: "2024",
    url: "https://en.wikipedia.org/wiki/Red_Bull_Racing",
    imageUrl: "/assets/f1-cars/Max_Verstappen_F1_poster__handmade_illustration__formula_1_car_print__gift_ideas-removebg-preview.png",
  },
  {
    carId: "mercedes_w16",
    name: "Mercedes W16",
    team: "Mercedes",
    year: "2025",
    url: "https://en.wikipedia.org/wiki/Mercedes-Benz_in_Formula_One",
    imageUrl: "/assets/f1-cars/Mercedes_F1_W16-removebg-preview.png",
  },
  {
    carId: "mclaren_mcl60",
    name: "McLaren MCL60",
    team: "McLaren",
    year: "2023",
    url: "https://en.wikipedia.org/wiki/McLaren_MCL60",
    imageUrl: "/assets/f1-cars/F1_MCL60_oscar_piastri-removebg-preview.png",
  },
  {
    carId: "ferrari_f190",
    name: "Ferrari F1-90",
    team: "Ferrari",
    year: "1990",
    url: "https://en.wikipedia.org/wiki/Ferrari_641",
    imageUrl: "/assets/f1-cars/1990_Ferrari_F1-90-removebg-preview.png",
  },
]

export type F1Track = {
  trackId: string
  name: string
  location: string
  url: string
  imageUrl: string
}

export const FAVORITE_TRACKS: F1Track[] = [
  {
    trackId: "monaco",
    name: "Circuit de Monaco",
    location: "Monte Carlo, Monaco",
    url: "https://en.wikipedia.org/wiki/Circuit_de_Monaco",
    imageUrl: "/assets/tracks/monaco.png",
  },
  {
    trackId: "abu_dhabi",
    name: "Yas Marina Circuit",
    location: "Abu Dhabi, UAE",
    url: "https://en.wikipedia.org/wiki/Yas_Marina_Circuit",
    imageUrl: "/assets/tracks/abu-dhabi.png",
  },
]
