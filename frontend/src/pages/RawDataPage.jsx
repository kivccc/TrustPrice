import React from 'react';
import styles from './RawDataPage.module.css';

function RawDataPage({ data, headers }) {
  if (data.length === 0) {
    return <div>표시할 데이터가 없습니다.</div>
  }
  
  return (
    <div className={styles.pageContainer}>
      <h2>전체 원본 데이터</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {headers.map(header => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map(header => <td key={header}>{row[header]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RawDataPage;