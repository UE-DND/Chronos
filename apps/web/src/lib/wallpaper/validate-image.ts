/** Decode before installing an image so a valid hash cannot hide unusable bytes. */
export async function validateImage(blob: Blob): Promise<void> {
	const url = URL.createObjectURL(blob);
	try {
		const image = new Image();
		image.src = url;
		await image.decode();
		if (!image.naturalWidth || !image.naturalHeight) throw new Error('Invalid wallpaper image');
	} finally {
		URL.revokeObjectURL(url);
	}
}
