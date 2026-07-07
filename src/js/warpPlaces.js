import { renderFishingLocation } from './warpLocations/fishing.js'
import { renderStainedAltarLocation } from './warpLocations/stainedaltar.js'
export const warpLocationDictionary = {
    SlimedLake: {
        name: 'Slimed Lake',
        description: 'a pleasant lake full of life. it can get a bit slimy when it rains.',
        render: renderFishingLocation,
    },
    StainedAltar: {
        name: 'Stained Altar',
        description: 'it seems like this altar harbors dangerous sealed power',
        render: renderStainedAltarLocation,
    }
}
