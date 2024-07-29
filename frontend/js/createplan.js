document.getElementById('createSchedule').addEventListener('click', function() {
    const title = document.getElementById('title').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (title && startDate && endDate) {
        const schedules = document.getElementById('schedules');
        const listItem = document.createElement('li');
        listItem.textContent = `${title} (시작: ${startDate}, 종료: ${endDate})`;
        schedules.appendChild(listItem);

        // 입력 필드 초기화
        document.getElementById('title').value = '';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
    } else {
        alert('모든 필드를 입력하세요.');
    }
});