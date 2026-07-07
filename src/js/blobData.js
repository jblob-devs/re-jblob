export const blobDictionary = {
  basicBlob: {
    name: "Basic Blob",
    image: "basicBlob",
    cost: 30,
    costType: "currencyItems.roundCoins",
    generateMaterial: "currencyItems.roundCoins",
    generateAmount: 1,
    generateInterval: 1000,
    maxStorage: 10,
  },
};

export function initBlobStates() {
  return {
    basicBlob: {
      owned: 1,
      level: 1,
      curStorage: 0,
    },
  };
}
