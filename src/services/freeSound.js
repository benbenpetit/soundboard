const baseUrl = 'https://freesound.org/apiv2';
const token = 'bn7aVBxK6UImjuoZY5pc4erzFbkvwRvi8MtEPGug';

export const getSongsByName = async (query) => {
  try {
    const result = await fetch(`${baseUrl}/search/text/?token=${token}&query=${query}`);
    const json = await result.json();
    const soundsId = json.results.slice(0, 10).map(sound => sound.id);
    const sounds = await Promise.all(soundsId.map(async soundId => {
      try {
        const result = await fetch(`${baseUrl}/sounds/${soundId}/?token=${token}`);
        const sound = await result.json();
        return {
          id: sound.id,
          description: sound.description,
          title: sound.name,
          duration: sound.duration,
          url: sound.previews['preview-hq-mp3'],
          cover: sound.images.waveform_bw_m
        }
      } catch (error) {
        console.log(error);
        return undefined;
      }
    }));
    return sounds.filter(sound => sound != undefined)
  } catch (error) {
    console.log(error);
    return [];
  }
};
