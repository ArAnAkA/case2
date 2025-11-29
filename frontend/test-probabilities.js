// Скрипт для тестирования вероятностей выпадения
function testProbabilities() {
    const items = [
        { name: "Обычный предмет", chance: 80 },
        { name: "Редкий предмет", chance: 15 },
        { name: "Легендарный предмет", chance: 5 }
    ];

    const results = {};
    const totalTests = 10000;

    for (let i = 0; i < totalTests; i++) {
        const totalChance = items.reduce((sum, item) => sum + item.chance, 0);
        const random = Math.random() * totalChance;
        
        let currentSum = 0;
        for (const item of items) {
            currentSum += item.chance;
            if (random <= currentSum) {
                results[item.name] = (results[item.name] || 0) + 1;
                break;
            }
        }
    }

    console.log("Результаты теста вероятностей:");
    for (const [name, count] of Object.entries(results)) {
        const percentage = (count / totalTests * 100).toFixed(2);
        console.log(`${name}: ${count} раз (${percentage}%)`);
    }
}

testProbabilities();