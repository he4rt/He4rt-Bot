const jimp = require('jimp');
const { readdir } = require('fs-extra');
const { log, logTypes } = require('./log');

const jimpLoader = async () => {
	try {
		const defaultImagesDir = await readdir('src/assets/images');
		const fontsDir = (await readdir('src/assets/fonts')).filter(x => !x.includes('.png'));
		const langsDir = await readdir('src/assets/langs');

		const assetsSize = defaultImagesDir.length + fontsDir.length + langsDir.length;
		log(`Found ${assetsSize} assets`);

		const imageLocations = defaultImagesDir.map(x => require.resolve(`../assets/images/${x}`));
		const fontLocations = fontsDir.map(x => require.resolve(`../assets/fonts/${x}`));
		const langImagesLocations = langsDir.map(x => require.resolve(`../assets/langs/${x}`));

		const images = await Promise.all(
			imageLocations.map(async x => ({
				name: x.substring(x.lastIndexOf('\\') + 1, x.length),
				res: await jimp.read(x),
			})),
		);

		const fonts = await Promise.all(
			fontLocations.map(async x => ({
				name: x.substring(x.lastIndexOf('\\') + 1, x.length),
				res: await jimp.loadFont(x),
			})),
		);

		const langImages = await Promise.all(
			langImagesLocations.map(async x => {
				const name = x.substring(x.lastIndexOf('\\') + 1, x.length);
				const idName = `${name.substring(0, name.length - 4).toUpperCase()}_LANG_ROLE`;
				return {
					name,
					res: await jimp.read(x),
					id: process.env[idName],
				};
			}),
		);

		log(`Loaded ${images.length + langImages.length} Images`);
		log(`Loaded ${fonts.length} Fonts`);

		return { images, fonts, langImages };
	} catch (err) {
		log(`Error when loading assets ${err.toString()}`, logTypes.ERROR);
	}

	return null;
};

module.exports = { jimpLoader };
