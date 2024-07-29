document.getElementById('createSchedule').addEventListener('click', function() {
    const title = document.getElementById('title').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (title && startDate && endDate) {
        // 입력 필드 초기화
        document.getElementById('title').value = '';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';

        // 일정 생성 함수 호출
        generateItinerary(title, startDate, endDate);
    } else {
        alert('모든 필드를 입력하세요.');
    }
});

function generateItinerary(title, startDate, endDate) {
    const itinerary = document.getElementById('itinerary');

    // 기존 콘텐츠 초기화
    itinerary.innerHTML = '';

    // 날짜 객체 생성
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 날짜 차이 계산
    const dayDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // 날짜가 유효한지 확인
    if (dayDifference < 1) {
        alert('종료일이 시작일보다 이전입니다.');
        return;
    }

    for (let i = 0; i < dayDifference; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        
        card.innerHTML = `
            <h3>
                <span style="font-size: 19px; color: #00189e;">Day ${i + 1}</span>  
                <span style="font-size: 14px; color: black;"> (${date.toISOString().split('T')[0]}) </span>
            </h3>
        `;

        
        itinerary.appendChild(card);
    }
}
