import Geocoder from "react-native-geocoding";

Geocoder.init("YOUR_GOOGLE_API_KEY");

export const getLatLngFromAddress = async (address: string) => {
    const res = await Geocoder.from(address);

    const location = res.results[0].geometry.location;

    return {
        lat: location.lat,
        lng: location.lng,
    };
};