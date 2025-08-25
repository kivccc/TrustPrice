import React, { useState, useEffect } from 'react';
import styles from './ItemPriceListPage.module.css'; 
function ItemPriceListPage({ data, headers }) {
  const [selectedFood, setSelectedFood] = useState('');
  
  // '번호', '지역'을 제외한 품목 리스트
  const foodItems = headers.slice(2);

  // 데이터 로드 시 첫 번째 품목을 기본으로 선택
  useEffect(() => {
    if (foodItems.length > 0) {
      setSelectedFood(foodItems[0]);
    }
  }, [data]);

  return (
    <div className={styles.pageContainer}>
      <h2>메뉴별 가격 목록</h2>
      <p>궁금한 외식 메뉴를 선택하면 지역별 가격을 보여줍니다.</p>
      
      {/* 메뉴 선택 버튼 그룹 */}
      <div className={styles.buttonGroup}>
        {foodItems.map(food => (
          <button 
            key={food} 
            onClick={() => setSelectedFood(food)}
            // (수정) active 클래스 동적 적용
            className={selectedFood === food ? styles.active : ''}
          >
            {food}
          </button>
        ))}
      </div>

      {/* 가격 정보 카드 목록 */}
      {selectedFood && (
        <div className={styles.priceListContainer}>
          <h3>{selectedFood} 가격 정보</h3>
          <div className={styles.priceCardGrid}>
            {data.map(item => (
              <div key={item['지역']} className={styles.priceCard}>
                <span className={styles.regionName}>{item['지역']}</span>
                <span className={styles.priceValue}>
                  {/* toLocaleString으로 1000단위 콤마 추가 */}
                  {item[selectedFood].toLocaleString('ko-KR')}원
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemPriceListPage;