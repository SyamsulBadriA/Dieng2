import axios from "axios";

export const BASE_URL = "https://dev.diengcalderarace.com";

const sendTrackingData = async (data) => {
  try {
    console.log(data);
    const response = await axios.post(BASE_URL + "/api/submit", data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Kesalahan saat mengirim data tracking:", error);
    return error;
  }
};

export const sendLocation = async (location, user) => {
  try {
    if (location != null && user != null) {
      const fullname = `${user.first_name} ${user.last_name}`;
      await sendTrackingData({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude ? location.coords.altitude : 10,
        category: `${user.id_category}_km`,
        email: user.email,
        fullname: fullname,
        uid: user.id_user,
      });
    }
  } catch (error) {
    console.error("Kesalahan saat mendapatkan lokasi:", error);
    return error;
  }
};
