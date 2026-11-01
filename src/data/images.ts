// Local supplied photographs and retained illustrative project imagery. See public/image-credits.txt.
export type Photo = { src: (width: number) => string; alt: string; position?: string; contain?: boolean; credit?: string };
const image = (name: string) => (width: number) =>
  `/images/illustrative/${name}-${width <= 480 ? 480 : width <= 960 ? 960 : 1600}.webp`;
const authentic = (name: string) => (width: number) => `/images/authentic/${name}-${width <= 480 ? 480 : width <= 960 ? 960 : 1600}.webp`;
export const photos = {
  portrait: { src: authentic("portrait"), alt: "Seated professional portrait" },
  worldScienceForum: {
    src: () => "/images/authentic/world-science-forum-welcome.png",
    alt: "Thomas Kivevele beside the World Science Forum 2022 welcome banner in Cape Town",
    position: "center 20%",
  },
  technaiOsirisInstrument: {
    src: () => "/images/authentic/technai-osiris-instrument.png",
    alt: "Thomas Kivevele standing beside a Technai Osiris instrument",
    position: "center",
  },
  solarFarm: {
    src: image("solarFarm"),
    alt: "Rows of solar panels on a large solar farm",
  },
  kilimanjaro: {
    src: image("kilimanjaro"),
    alt: "Mount Kilimanjaro rising above the clouds",
  },
  ruralSolar: {
    src: image("ruralSolar"),
    alt: "Solar panels on a building in a rural landscape",
  },
  lab: { src: authentic("PHOTO-031"), alt: "Thomas Kivevele beside laboratory instruments", position: "77% center", credit: "Supplied laboratory photograph" },
  solarRoof: {
    src: image("solarRoof"),
    alt: "Aerial view of a town with solar panels on a roof",
  },
  farmers: {
    src: image("farmers"),
    alt: "Farmers harvesting leafy greens in a field",
  },
  womenField: {
    src: image("womenField"),
    alt: "A group of women working in a field",
  },
  planting: { src: image("planting"), alt: "A woman planting crops" },
  classroom: {
    src: image("classroom"),
    alt: "A teacher instructing students in a classroom",
  },
  graduate: {
    src: image("graduate"),
    alt: "A graduate in a gown holding her certificate",
  },
  auditorium: {
    src: image("auditorium"),
    alt: "A large auditorium filled with conference delegates",
  },
  panel: {
    src: image("panel"),
    alt: "A panel discussion in front of an audience",
  },
  campus: { src: authentic("PHOTO-032"), alt: "Thomas Kivevele outside the NM-AIST entrance", position: "center", credit: "NM-AIST · supplied photograph" },
  presentation: { src: authentic("PHOTO-046"), alt: "A speaker presenting with an outstretched hand", position: "55% center", credit: "Presentation · supplied photograph" },
  solarBiogasSite: { src: authentic("solar-biogas-site"), alt: "Solar-biogas hybrid dryer installation with solar collector at the NM-AIST site", position: "50% center" },
  heatPumpSamples: { src: authentic("heatpump-samples"), alt: "Packaged dried fruit slices from the solar-assisted heat-pump dryer project", position: "center" },
  solarBiogasSecond: { src: authentic("solar-biogas-second"), alt: "Solar drying cabinet, collector and biogas digester at NM-AIST", position: "50% center" },
  solarStorageActivity: { src: authentic("solar-storage-workshop"), alt: "A participant handling biomaterial during a solar-drying project activity", position: "center" },
  pasetKickoff: { src: authentic("paset-kickoff"), alt: "Participants gathered at a PASET RSIF kickoff meeting in Mozambique", position: "center" },
  pasetMeeting: { src: authentic("paset-meeting"), alt: "Researchers and partners meeting during the PASET RSIF project kickoff", position: "center" },
  solarStorageDemonstration: { src: authentic("solar-storage-meeting"), alt: "Project discussion during a solar-drying workshop", position: "center" },
  heatPumpEvent: { src: authentic("heatpump-event"), alt: "Researchers and partners gathered during the solar-assisted heat-pump dryer project event", position: "center" },
  demonstration: { src: authentic("ARISE-046"), alt: "A researcher demonstrating the solar–biogas dryer", position: "35% 10%", credit: "Solar–biogas dryer · supplied project photograph" },
  speaking: { src: authentic("ARISE-012"), alt: "A speaker at an ARISE project event", contain: true, credit: "ARISE event · supplied photograph" },
  teaching: { src: authentic("EVENT-002"), alt: "A presenter explaining a topic from a lectern", position: "53% center", credit: "Presentation · supplied photograph" },
  contact: { src: authentic("PASET-022"), alt: "A speaker at the PASET RSIF kickoff meeting", position: "50% 0%", credit: "PASET RSIF kickoff · supplied photograph" },
  dryer: { src: authentic("ARISE-020"), alt: "Solar–biogas dryer with collector and drying cabinet", credit: "Solar–biogas dryer · supplied project photograph" },
  mountainTrees: {
    src: image("mountainTrees"),
    alt: "Green trees below a snow-capped mountain",
  },
  sunset: { src: image("sunset"), alt: "The sun setting over a dry landscape" },
} satisfies Record<string, Photo>;
