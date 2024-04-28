  // useEffect(() => {
  //   const API_URL = 'http://192.168.1.2:3001/InsertTracking'; 
  //   const sendTrackingData = async (data) => {
  //     try {
  //       const response = await fetch(API_URL, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(data),
  //       });
  //       const body = await response.text();
  //       console.log("Hasil body:", body);
  //       console.log("data", data);
  //       const responseData = await response.json();
  //       console.log(responseData);
  //     } catch (error) {
  //       console.error('Kesalahan saat mengirim data tracking:', error);
  //     }
  //   };

  //   const getAndSendLocation = async () => {
  //     try {
  //       let { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== 'granted') {
  //         setErrorMsg('Izin lokasi ditolak');
  //         return;
  //       }
  
  //       let location = await Location.getCurrentPositionAsync({});
  //       setLocation(location);
  //       setErrorMsg(null);
  
  //       console.log("Sebelum sendTrackingData");
  //       sendTrackingData({
  //         latitude: location.coords.latitude,
  //         longitude: location.coords.longitude,
  //         altitude: location.coords.altitude,
  //         category: '10_Km',
  //         email: 'YourEmail@example.com', 
  //         fullname: 'YourFullName', 
  //         Tracking_time: '1', 
  //       });
  //       console.log("Setelah sendTrackingData");

  //     } catch (error) {
  //       console.error('Kesalahan saat mendapatkan lokasi:', error);
  //       setErrorMsg('Kesalahan saat mendapatkan lokasi');
  //     }
  //   };

  //   const interval = setInterval(() => {
  //     getAndSendLocation();
  //   }, 10000);

  //   return () => clearInterval(interval);
  // }, []);