function cleanText(text) {
    if (!text) return '';

    return text
        // Remove <a> tags and their content
        .replace(/<a[^>]*>(.*?)<\/a>/g, '$1')
        // Remove Discogs [url=...]...[/url] tags
        .replace(/\[url=.*?\](.*?)\[\/url\]/g, '$1')
        // Remove Discogs [a=...] tags
        .replace(/\[a=.*?\]/g, '')
        // Remove Discogs [r=...] tags
        .replace(/\[r=.*?\]/g, '')
        // Remove BBCode-style tags like [/u] or [/b]
        .replace(/\[\/?[a-z]+\]/gi, '')
        // Remove specific Last.fm text
        .replace(/Read more on Last\.fm/g, '')
        // Remove codes in the format [a12345]
        .replace(/\[[a-zA-Z0-9]+\]/g, '')
        // Replace extra newlines and spaces
        .replace(/\r\n/g, '\n')
        .replace(/\n+/g, '\n')
        .trim();
}

export default cleanText;