import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('아래 버튼을 눌러주세요.');
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setMessage('데이터를 불러오는 중...');

    try {
      const response = await axios.get('/api/test');
      console.log("전체 응답:", response);
      setMessage(response.data);
    } catch (error) {
      console.error("데이터 로딩 중 에러 발생:", error);
      setMessage("데이터를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false); 
    }
  };

  const clear = async () => {
    setIsLoading(false);
    setMessage('데이터를 불러오는 중...');
  };


  return (
    <div className="App">
      <header className="App-header">
        
        {/* 버튼 클릭 시 fetchData 함수를 호출. isLoading이 true일 때는 비활성화 */}
        <button onClick={fetchData} disabled={isLoading}>
          {isLoading ? '로딩 중...' : '백엔드 데이터 요청'}
        </button>
        test
        <button onClick={clear}>
          {'초기화'}
        </button>
        {/* API 응답 결과를 화면에 표시 */}
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
