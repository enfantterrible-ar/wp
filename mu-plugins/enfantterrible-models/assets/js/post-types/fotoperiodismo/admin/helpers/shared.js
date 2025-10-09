/**
 * Validates if a string is a well-formed HTTPS URL.
 * Optionally allows empty strings.
 *
 * @param {*} value - The value to validate as a URL.
 * @param {boolean} [allowEmpty=false] - If true, empty strings are considered valid.
 * @returns {boolean} True if valid HTTPS URL or allowed empty, false otherwise.
 */
export function isUri(value, allowEmpty = false) {
	if (allowEmpty && value === '') return true;
	if (typeof value !== 'string') return false;

	try {
		const url = new URL(value);
		return url.protocol === 'https:';
	} catch {
		return false;
	}
}

/**
 * Normalize a URL string by trimming, lowercasing and removing leading '@'
 * symbol.
 *
 * @param {string} url - The URL string to normalize.
 * @returns {string} The normalized URL string.
 */
export function normalizeUrl(url) {
	if (!url || typeof url !== 'string') return '';
	const normalizedUrl = url.trim().toLowerCase();

	// Check if there's content before the protocol
	const protocolMatch = normalizedUrl.match(/^(.+?)(https?:\/\/)/);

	if (protocolMatch) {
		// Remove everything before the protocol
		return normalizedUrl.substring(protocolMatch[1].length);
	}

	return normalizedUrl;
}
