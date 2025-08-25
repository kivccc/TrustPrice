import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import PriceChartPage from './pages/PriceChartPage';
import RawDataPage from './pages/RawDataPage';
import ItemPriceListPage from './pages/ItemPriceListPage';
import ItemMapPage from './pages/ItemMapPage';
import ItemSearchPage from './pages/ItemSearchPage';
import styles from './App.module.css';

function App() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length > 0) {
          setHeaders(Object.keys(jsonData[0]));
          setData(jsonData);
        }
    console.log(data);

      } catch (error) {
        console.error("엑셀 파일 로딩 오류:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>데이터 로딩 중...</div>;
  }

  return (
    <BrowserRouter>
      <div className={styles.appContainer}>
        <nav className={styles.mainNav}>
          <Link to="/"> 🔍 제품 검색</Link>
          <Link to="/map">📍 외식 지도 보기</Link>
          <Link to="/list">🍽️ 외식 메뉴별 가격</Link>
          <Link to="/chart">📊 외식 가격 비교 차트</Link>
          <Link to="/table">📋 전체 외식 데이터</Link>
        </nav>
        <main>
          <Routes>
            <Route
              path="/"
              element={<ItemSearchPage/>}
            />
            <Route 
              path="/map" 
              element={<ItemMapPage data={data} headers={headers} />} 
            />
            <Route 
              path="/list" 
              element={<ItemPriceListPage data={data} headers={headers} />} 
            />
            <Route 
              path="/chart" 
              element={<PriceChartPage data={data} headers={headers} />} 
            />
            <Route 
              path="/table" 
              element={<RawDataPage data={data} headers={headers} />} 
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;