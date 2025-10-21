import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import styles from "./ItemSearchPage.module.css";

function ProductSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ocrError, setOcrError] = useState('');
  const [searchTrigger, setSearchTrigger] = useState('text'); // 'text' | 'ocr'
  const fileInputRef = useRef(null);

  // 텍스트 검색 API 호출 함수
  const fetchResults = async (q) => {
    if (!q) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    setOcrError('');
    try {
      const res = await axios.get("/api/products/search", {
        params: { name: q },
      });
      setResults(res.data);
    } catch (err) {
      console.error("텍스트 검색 오류:", err);
      setOcrError('상품 검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 디바운스 적용된 검색 함수
  const debouncedFetch = useCallback(debounce(fetchResults, 300), []);

  // query 상태가 변경될 때 텍스트 검색 실행
  useEffect(() => {
    // 사용자가 직접 입력한 경우에만 디바운스 검색 실행
    if (searchTrigger === 'text') {
      debouncedFetch(query);
    }
    // Cleanup 함수: 컴포넌트 언마운트 시 디바운스 취소
    return () => debouncedFetch.cancel();
  }, [query, searchTrigger, debouncedFetch]); // searchTrigger를 의존성 배열에 추가

  // 이미지 업로드 핸들러
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    event.target.value = null; // 같은 파일 재업로드 가능하도록 초기화
    
    setSearchTrigger('ocr'); // 검색 출처를 'ocr'로 설정
    setQuery('');
    setResults([]);
    setIsLoading(true);
    setOcrError('');

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("/api/products/search-by-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { extractedText, products, error } = res.data;

      if (error) {
          setOcrError(error);
          setResults([]);
          setQuery('');
      } else if (extractedText) {
        // OCR 결과를 검색창에 표시만 하고, 결과는 바로 상태에 설정
        setQuery(`📷 ${extractedText}`);
        setResults(products || []);
      } else {
        setOcrError('이미지에서 텍스트를 추출하지 못했습니다.');
        setResults([]);
        setQuery('');
      }
    } catch (err) {
      console.error("이미지 검색 오류:", err);
      setOcrError('이미지 처리 또는 상품 검색 중 오류가 발생했습니다.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 텍스트 입력 핸들러
  const handleTextChange = (e) => {
    setSearchTrigger('text'); // 검색 출처를 'text'로 설정
    setQuery(e.target.value);
  }

  // 파일 입력창을 여는 함수
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.searchContainer}>
      <h2>상품 검색</h2>

      <div className={styles.searchInputWrapper}>
        <div className={styles.searchTooltip}>
          한국어 또는 로마자 표기로 검색하거나, <br />
          상품 이미지를 업로드하여 검색하세요.
        </div>

        <input
          className={styles.searchInput}
          type="text"
          value={query}
          placeholder="검색어 입력 또는 이미지 업로드..."
          onChange={handleTextChange} // 수정된 핸들러 연결
          disabled={isLoading}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ display: "none" }}
          disabled={isLoading}
        />
        <button onClick={triggerFileInput} disabled={isLoading} className={styles.uploadButton} style={{marginLeft: '10px'}}>
          {isLoading ? '처리 중...' : '이미지 업로드'}
        </button>
      </div>

      {isLoading && <div className={styles.loading}>🔍 검색 중...</div>}
      {!isLoading && ocrError && <div className={styles.error}>{ocrError}</div>}

      <div className={styles.results}>
        {!isLoading && !ocrError && (
          results.length > 0 ? (
            results.map((product) => (
              <div className={styles.resultCard} key={product.id}>
                <div className={styles.cardHeader}>
                  <span className={styles.productName}>{product.name}</span>
                  <span className={styles.price}>
                    {product.averagePrice.toLocaleString()}원
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.manufacturer}>
                    {product.manufacturer}
                  </span>
                  <span className={styles.surveyDate}>{product.surveyDate}</span>
                </div>
              </div>
            ))
          ) : query ? (
            <div className={styles.noResults}>검색 결과가 없습니다.</div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default ProductSearch;
