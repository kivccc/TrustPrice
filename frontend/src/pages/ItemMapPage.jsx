import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./ItemMapPage.module.css"; // CSS 파일 import
import { useEffect, useState } from "react";

function ItemMapPage({ data, headers }) {
  const [geoData, setGeoData] = useState(null);
  const [selectedItem, setSelectedItem] = useState("냉면");

  useEffect(() => {
    fetch("/map.json")
      .then((res) => res.json())
      .then((json) => setGeoData(json));
  }, []);

  const getPriceByRegion = (regionName) => {
    const row = data.find((d) => d["지역"] === regionName);
    return row ? row[selectedItem] : null;
  };

  const getColor = (price) => {
    if (!price) return "#ccc";
    if (price > 20000) return "#ff4d4d";
    if (price > 15000) return "#ff944d";
    if (price > 10000) return "#ffd24d";
    return "#d9ff4d";
  };

  // GeoJSON 레이어 스타일 함수
  const style = (feature) => {
    const regionName = feature.properties.CTP_KOR_NM;
    const price = getPriceByRegion(regionName);
    return {
      fillColor: getColor(price),
      weight: 1,
      color: "black",
      fillOpacity: 0.7,
    };
  };

  // 각 지역(feature)에 적용할 기능
  const onEachFeature = (feature, layer) => {
    const regionName = feature.properties.CTP_KOR_NM;
    const price = getPriceByRegion(regionName);
    const label = `${regionName}<br/>${price ? price.toLocaleString() + "원" : "N/A"}`;

    // 툴팁을 항상 표시되도록 설정
    layer.bindTooltip(label, {
      permanent: true,     // 항상 표시
      direction: "center",   // 중앙에 위치
      className: "region-label", // CSS 클래스 적용
    });

    // hover 이벤트
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          weight: 3,
          color: "#333",
          fillOpacity: 0.9,
        });
      },
      mouseout: (e) => {
        // 원래 스타일로 복원 (GeoJSON의 style prop을 직접 참조할 수 없으므로 초기화)
        e.target.setStyle(style(feature));
      },
    });
  };


  return (
    <div>
      <h2>📍 한국 지도 - {selectedItem} 평균 가격</h2>

      <div style={{ marginBottom: "10px" }}>
        {headers
          .filter((h) => h !== "번호" && h !== "지역")
          .map((item) => (
            <button
              key={item}
              onClick={() => setSelectedItem(item)}
              style={{
                marginRight: "5px",
                padding: "5px 10px",
                background: selectedItem === item ? "#007bff" : "#e0e0e0",
                color: selectedItem === item ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {item}
            </button>
          ))}
      </div>

      <MapContainer
        style={{ height: "600px", width: "100%", marginTop: "10px" }}
        center={[36.5, 127.5]}
        zoom={7}
      >
        <TileLayer
          url="https://tiles.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />

        {geoData && (
          <GeoJSON
            key={selectedItem}
            data={geoData}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default ItemMapPage;