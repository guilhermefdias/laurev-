import type { StoredImage } from './products';

/** Limite do arquivo já redimensionado pelo navegador (o D1 aceita ~2 MB por linha). */
export const MAX_IMAGE_BYTES = 600 * 1024;

function detectMime(bytes: Uint8Array): string | null {
	const startsWith = (...sig: number[]) => sig.every((b, i) => bytes[i] === b);
	if (startsWith(0xff, 0xd8, 0xff)) return 'image/jpeg';
	if (startsWith(0x89, 0x50, 0x4e, 0x47)) return 'image/png';
	// WebP: "RIFF" .... "WEBP"
	if (startsWith(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45) {
		return 'image/webp';
	}
	return null;
}

function toBase64(bytes: Uint8Array): string {
	let binary = '';
	const chunk = 0x8000;
	for (let i = 0; i < bytes.length; i += chunk) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	}
	return btoa(binary);
}

export function fromBase64(base64: string): Uint8Array<ArrayBuffer> {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

export type ImageResult = { ok: true; image: StoredImage | null } | { ok: false; message: string };

/** Lê o arquivo enviado. Sem arquivo => `image: null`. O tipo vem dos bytes, não do cliente. */
export async function readUploadedImage(value: FormDataEntryValue | null): Promise<ImageResult> {
	if (!(value instanceof File) || value.size === 0) return { ok: true, image: null };
	if (value.size > MAX_IMAGE_BYTES) {
		return { ok: false, message: 'A imagem é grande demais (máximo de 600 KB após o ajuste).' };
	}
	const bytes = new Uint8Array(await value.arrayBuffer());
	const mime = detectMime(bytes);
	if (!mime)
		return { ok: false, message: 'Formato de imagem não suportado. Use JPG, PNG ou WebP.' };
	return { ok: true, image: { mime, base64: toBase64(bytes) } };
}
