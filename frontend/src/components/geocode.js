"use client";

export const geocodeAddress = async (address) => {
    try {
        // 调用后端 API 来获取地理编码数据
        const response = await fetch(
            `http://localhost:8080/geocode/?address=${encodeURIComponent(address)}`,  // 调用后端 API
            {
                method: 'GET',
                credentials: 'include',  // 包含用户凭证
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            }
        );

        const data = await response.json();  // 从后端获取的响应数据

        if (response.ok && data.results.length > 0) {
            // 如果响应成功，获取地理编码信息
            const { lat, lng } = data.results[0].geometry.location;
            const formatted_address = data.results[0].formatted_address;
            console.log(`Latitude: ${lat}, Longitude: ${lng}, Address: ${formatted_address}`);
            return { lat, lng, formatted_address };
        } else {
            // 如果后端返回错误，抛出异常
            throw new Error(data.message || "Geocoding failed");
        }
    } catch (error) {
        // 捕获并处理错误
        console.error("Error in geocoding:", error.message);
        throw new Error(error.message);
    }
};

// export default geocodeAddress;

// const geocodeAddress = async (address) => {
//   try {
//     const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyCckyaBJIn_YdEaWxLpcGtMvbn3D3y_dLQ&language=en`
//     );
//     const data = await response.json();
//     const getCountryCode = (data) => {
//       try {
//         const addressComponents = data.results[0].address_components;
//         for (let component of addressComponents) {
//           if (component.types.includes("country")) {
//             return component.short_name;  // 获取国家的缩写
//           }
//         }
//       } catch (error) {
//         throw new Error("Please input valid and specific address, includes suburbs and state is ");
//       }
//     };
//     if (data.results.length > 0 && getCountryCode(data) === "AU") {
//       console.log(getCountryCode(data));  // 输出类似 "AU" 的国家代号
//       const { lat, lng } = data.results[0].geometry.location;
//       const formatted_address = data.results[0].formatted_address;
//       return { lat, lng , formatted_address};
//     } else if (data.results.length > 0 && getCountryCode(data) !== "AU") {
//       console.log(getCountryCode(data));  // 输出类似 "AU" 的国家代号
//       throw new Error("Input address is not in Australia");
//     } else {
//       console.log(getCountryCode(data));  // 输出类似 "AU" 的国家代号
//       throw new Error("Please input valid and specific address");
//     }
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };