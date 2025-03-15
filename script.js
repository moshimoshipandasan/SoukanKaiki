// グローバル変数
let scatterChart = null;
let currentData = [];

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    // イベントリスナーの設定
    document.getElementById('negative-correlation').addEventListener('click', () => loadExample('negative'));
    document.getElementById('no-correlation').addEventListener('click', () => loadExample('none'));
    document.getElementById('positive-correlation').addEventListener('click', () => loadExample('positive'));
    document.getElementById('custom-data').addEventListener('click', showDataInput);
    document.getElementById('plot-data').addEventListener('click', plotCustomData);
    
    // 初期データとして負の相関を表示
    loadExample('negative');
    
    // データ入力エリアを初期状態では非表示
    const dataInputContainer = document.getElementById('data-input-container');
    if (dataInputContainer) {
        dataInputContainer.style.display = 'none';
    } else {
        console.error('データ入力コンテナが見つかりません');
    }
});

// サンプルデータの読み込み
function loadExample(type) {
    let data = [];
    
    switch(type) {
        case 'negative':
            // 負の相関のサンプルデータ
            data = [
                [10, 95], [12, 90], [15, 85], [18, 80], [20, 75],
                [23, 70], [25, 65], [28, 60], [30, 55], [33, 50],
                [35, 45], [38, 40], [40, 35], [43, 30], [45, 25]
            ];
            break;
        case 'none':
            // 相関なしのサンプルデータ
            data = [
                [10, 50], [15, 60], [20, 45], [25, 55], [30, 40],
                [35, 65], [40, 50], [45, 35], [50, 60], [55, 45],
                [60, 55], [65, 40], [70, 50], [75, 45], [80, 55]
            ];
            break;
        case 'positive':
            // 正の相関のサンプルデータ
            data = [
                [10, 20], [15, 30], [20, 35], [25, 40], [30, 45],
                [35, 50], [40, 55], [45, 60], [50, 65], [55, 70],
                [60, 75], [65, 80], [70, 85], [75, 90], [80, 95]
            ];
            break;
    }
    
    // データを設定して表示
    currentData = data;
    updateChart();
    calculateAndDisplayStatistics();
    
    // データ入力エリアを非表示
    document.getElementById('data-input-container').style.display = 'none';
}

// カスタムデータ入力エリアの表示
function showDataInput() {
    const dataInputContainer = document.getElementById('data-input-container');
    if (dataInputContainer) {
        dataInputContainer.style.display = 'block';
        // スクロールしてデータ入力エリアを表示
        dataInputContainer.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error('データ入力コンテナが見つかりません');
    }
}

// カスタムデータのプロット
function plotCustomData() {
    const inputText = document.getElementById('data-input').value.trim();
    const lines = inputText.split('\n');
    const data = [];
    
    // ヘッダー行をスキップするためのフラグ
    let skipHeader = false;
    
    // 最初の行がX,Yのようなヘッダーかチェック
    if (lines.length > 0) {
        const firstLine = lines[0].toLowerCase();
        if (firstLine.includes('x') && firstLine.includes('y') && !firstLine.match(/[0-9]/)) {
            skipHeader = true;
        }
    }
    
    // 各行をパース
    for (let i = skipHeader ? 1 : 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;
        
        const parts = line.split(',');
        if (parts.length >= 2) {
            const x = parseFloat(parts[0]);
            const y = parseFloat(parts[1]);
            
            if (!isNaN(x) && !isNaN(y)) {
                data.push([x, y]);
            }
        }
    }
    
    if (data.length < 2) {
        alert('少なくとも2つの有効なデータポイントが必要です。');
        return;
    }
    
    // データを設定して表示
    currentData = data;
    updateChart();
    calculateAndDisplayStatistics();
}

// グラフの更新
function updateChart() {
    const ctx = document.getElementById('scatter-plot').getContext('2d');
    
    // 既存のチャートを破棄
    if (scatterChart) {
        scatterChart.destroy();
    }
    
    // 回帰直線の計算
    const result = regression.linear(currentData);
    const slope = result.equation[0];
    const intercept = result.equation[1];
    
    // 回帰直線のデータポイント
    const regressionLine = [];
    const xValues = currentData.map(point => point[0]);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    
    regressionLine.push([minX, slope * minX + intercept]);
    regressionLine.push([maxX, slope * maxX + intercept]);
    
    // 新しいチャートの作成
    scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'データポイント',
                    data: currentData.map(point => ({ x: point[0], y: point[1] })),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: '回帰直線',
                    data: regressionLine.map(point => ({ x: point[0], y: point[1] })),
                    type: 'line',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    pointRadius: 0,
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'X値'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Y値'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `(${context.parsed.x}, ${context.parsed.y})`;
                        }
                    }
                }
            }
        }
    });
}

// 統計量の計算と表示
function calculateAndDisplayStatistics() {
    // 相関係数の計算
    const correlation = calculateCorrelation();
    
    // 相関係数の表示
    document.getElementById('correlation-value').textContent = `r = ${correlation.toFixed(4)}`;
    
    // 相関の強さの判定と表示
    const strength = getCorrelationStrength(correlation);
    document.getElementById('correlation-strength').textContent = strength;
    
    // 回帰分析
    const result = regression.linear(currentData);
    const slope = result.equation[0];
    const intercept = result.equation[1];
    const r2 = result.r2;
    
    // 回帰式の表示
    document.getElementById('regression-equation').textContent = `Y = ${slope.toFixed(4)}X + ${intercept.toFixed(4)}`;
    
    // 決定係数の表示
    document.getElementById('determination-coefficient').textContent = `決定係数 (R²) = ${r2.toFixed(4)}`;
}

// 相関係数の計算
function calculateCorrelation() {
    const n = currentData.length;
    
    // X値とY値の配列を取得
    const xValues = currentData.map(point => point[0]);
    const yValues = currentData.map(point => point[1]);
    
    // 平均の計算
    const xMean = xValues.reduce((sum, val) => sum + val, 0) / n;
    const yMean = yValues.reduce((sum, val) => sum + val, 0) / n;
    
    // 分子と分母の計算
    let numerator = 0;
    let denominatorX = 0;
    let denominatorY = 0;
    
    for (let i = 0; i < n; i++) {
        const xDiff = xValues[i] - xMean;
        const yDiff = yValues[i] - yMean;
        
        numerator += xDiff * yDiff;
        denominatorX += xDiff * xDiff;
        denominatorY += yDiff * yDiff;
    }
    
    // 相関係数の計算
    const correlation = numerator / Math.sqrt(denominatorX * denominatorY);
    
    return correlation;
}

// 相関の強さの判定
function getCorrelationStrength(r) {
    const absR = Math.abs(r);
    
    if (absR <= 0.2) {
        return '相関なし';
    } else if (absR <= 0.4) {
        return '弱い相関';
    } else if (absR <= 0.7) {
        return '中程度の相関';
    } else {
        return '強い相関';
    }
}
