import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './PriceChartPage.module.css';
// Chart.js의 구성요소를 등록해야 정상적으로 동작함
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function PriceChartPage({ data, headers }) {
  const [selectedFood, setSelectedFood] = useState('');
  
  // '번호', '지역'을 제외한 품목 리스트
  const foodItems = headers.slice(2);

  // 컴포넌트가 로드될 때 첫 번째 품목을 기본으로 선택
  useEffect(() => {
    if (foodItems.length > 0) {
      setSelectedFood(foodItems[0]);
    }
  }, [data]); // data가 로드된 후 실행

  // 선택된 품목이 없으면 렌더링하지 않음
  if (!selectedFood) {
    return <div>데이터를 불러오는 중이거나 표시할 품목이 없습니다.</div>;
  }
  
  // 차트 데이터 구성
  const chartData = {
    labels: data.map(item => item['지역']),
    datasets: [
      {
        label: `${selectedFood} 가격 (원)`,
        data: data.map(item => item[selectedFood]),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: `지역별 ${selectedFood} 가격 비교` },
    },
  };

  return (
    <div className={styles.pageContainer}>
      <h2>품목별 가격 비교</h2>
      <div className={styles.buttonGroup}>
        {foodItems.map(food => (
          <button 
            key={food} 
            onClick={() => setSelectedFood(food)}
            className={selectedFood === food ? 'active' : ''}
          >
            {food}
          </button>
        ))}
      </div>
      <div className={styles.chartContainer}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default PriceChartPage;