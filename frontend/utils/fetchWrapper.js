export default async function safeFetch(fetchFunction) {

    try {
        const rawResponse = await fetchFunction;
        if (rawResponse.ok) {
            return await rawResponse.json();
        } else {
            throw Error(rawResponse.statusText);
        }
    } catch (error) {
        throw error;
    }
}