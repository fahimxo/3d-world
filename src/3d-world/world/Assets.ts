interface ITextures {
  name: string;
  url: string;
}

export interface IResources {
  textures?: ITextures[];
}

const filePath = './images/earth/';
const fileSuffix = [
  'gradient',
  'redCircle',
  'label',
  'aperture',
  'glow',
  'light_column',
  'aircraft',
];

const textures = fileSuffix.map((item) => {
  return {
    name: item,
    url: filePath + item + '.png',
  };
});

textures.push({
  name: 'earth',
  url: filePath + '3DGlobe-TS.png',
});

textures.push({
  name: 'earthDetailed', // Give it a new, unique name
  url: filePath + '3DGlobe-C.png', // Use the correct file name
});

const resources: IResources = {
  textures,
};

export { resources };
