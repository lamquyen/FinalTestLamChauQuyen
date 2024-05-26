const images = [
    'bau.png',
    'ca.png',
    'cua.png',
    'tom.png',
    'huou.png',
    'ga.png'
]

const boxes = document.querySelectorAll('.box');
const resulBoxes = document.querySelectorAll('.resul .box');

const countElements = document.querySelectorAll('.count');
const quayBtn = document.getElementById('quayBtn');
const resetBtn = document.getElementById('resetBtn');

let isSpinning = false;
let totalBet = 0;
let userBets = {};

// Hàm random hình ảnh
function getRandomImage() {
    return images[Math.floor(Math.random() * images.length)];
}

// Hàm hiển thị hình ảnh ngẫu nhiên
function showRandomImage(box, i) {
    box.querySelector('img').src = getRandomImage();
    // Lưu hình ảnh hiện tại vào data-img để sử dụng sau khi kết thúc quay
    box.dataset.img = box.querySelector('img').src;
}

// Hàm quay
function spin() {
    if (isSpinning) {
        return;
    }

    isSpinning = true;
    quayBtn.disabled = true;
    resetBtn.disabled = true;
    boxes.forEach(box => box.removeEventListener('click', handleClick));

    // Tạo hiệu ứng trộn
    let i = 0;
    const interval = setInterval(() => {
        resulBoxes.forEach((box, index) => {
            showRandomImage(box, index);
        });
        i++;

        if (i === 100) {
            clearInterval(interval);
            // Hiển thị kết quả cuối cùng
            resulBoxes.forEach((box, index) => {
                box.querySelector('img').src = box.dataset.img;
            });

            isSpinning = false;
            quayBtn.disabled = false;
            resetBtn.disabled = false;
            boxes.forEach(box => box.addEventListener('click', handleClick));

            // So sánh kết quả của người chơi cược và kết quả quay
            const result = checkResult();
            if (result) {
                console.log(`Bạn đã đoán đúng với kết quả: ${result}`);
            } else {
                console.log(`Bạn đã đoán sai với kết quả: ${getUserBetsString()}`);
            }
        }
    }, 50);
}

// Hàm xử lý khi bấm vào hình ảnh để đặt cược
function handleClick(event) {
    const box = event.target.closest('.box');
    const count = box.querySelector('.count');
    const countValue = parseInt(count.textContent);

    // Kiểm tra xem tổng số điểm cược đã đạt tối đa chưa
    if (totalBet < 3) {
        totalBet++;
        count.textContent = countValue + 1;
        userBets[box.dataset.img] = (userBets[box.dataset.img] || 0) + 1;
    }
}

// Hàm reset điểm cược
function resetBet() {
    totalBet = 0;
    countElements.forEach(count => count.textContent = 0);
    userBets = {};
}

// Hàm kiểm tra kết quả
function checkResult() {
    const resultImages = Array.from(resulBoxes).map(box => box.dataset.img);
    const userBetImages = Object.keys(userBets);

    for (const image of userBetImages) {
        if (resultImages.includes(image)) {
            return ` ${userBets[image]} `;
        }
    }

    return false;
}

// Hàm lấy chuỗi điểm cược của người chơi
function getUserBetsString() {
    return Object.keys(userBets).map(image => `${image}: ${userBets[image]}`).join(', ');
}

// Thêm event listener cho các nút
quayBtn.addEventListener('click', spin);
resetBtn.addEventListener('click', resetBet);

// Thêm event listener cho các hình ảnh
boxes.forEach(box => box.addEventListener('click', handleClick));