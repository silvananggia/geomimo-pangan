// src/api/hotspotService.js
export const fetchHotspotData = async (startDate, endDate, confLevel) => {
    const params = new URLSearchParams({
      "$$hashKey": "object:32",
      "class": "hotspot",
      "conf_lvl": confLevel,
      "enddate": endDate,
      "id": "0",
      "loc": JSON.stringify({ stt: "Indonesia", disp: "Indonesia" }),
      "mode": "cluster",
      "name": "Hotspot",
      "startdate": startDate,
      "time": "usedate",
      "visibility": "true"
    });
  
    const url = `https://hotspot.brin.go.id/getHS?${params.toString()}`;
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching hotspot data:', error);
      throw error;
    }
};
  