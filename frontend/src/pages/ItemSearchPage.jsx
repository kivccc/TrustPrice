import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import styles from "./ItemSearchPage.module.css";

function ProductSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const fetchResults = async (q) => {
    if (!q) {
      setResults([]);
      return;
    }
    try {
      const res = await axios.get("/api/products/search", {
        params: { name: q },
      });
      setResults(res.data);
    } catch (err) {
      console.error("검색 오류:", err);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchResults, 300), []);

  useEffect(() => {
    debouncedFetch(query);
    return () => debouncedFetch.cancel();
  }, [query, debouncedFetch]);

  return (
    <div className={styles.searchContainer}>
      <h2>상품 검색</h2>

      <div className={styles.searchInputWrapper}>
        {/* 항상 표시되는 안내 문구 */}
        <div className={styles.searchTooltip}>
          한국어 또는 로마자 표기(e.g. 한글 → Hangeul)로 검색하세요. <br />
          Search by Korean name or Romanized spelling.
        </div>

        <input
          className={styles.searchInput}
          type="text"
          value={query}
          placeholder="검색어 입력..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className={styles.results}>
        {results.length > 0 ? (
          results.map((product, index) => (
            <div className={styles.resultCard} key={index}>
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
        ) : null}
      </div>
    </div>
  );
}

export default ProductSearch;
