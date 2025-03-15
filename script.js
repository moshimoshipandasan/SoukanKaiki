// グローバル変数
let scatterChart = null;
let currentData = [];

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM読み込み完了');
    
    // ボタン要素の取得
    const negativeBtn = document.getElementById('negative-correlation');
    const moderateNegativeBtn = document.getElementById('moderate-negative-correlation');
    const noneBtn = document.getElementById('no-correlation');
    const moderatePositiveBtn = document.getElementById('moderate-positive-correlation');
    const positiveBtn = document.getElementById('positive-correlation');
    const customBtn = document.getElementById('custom-data');
    const plotBtn = document.getElementById('plot-data');
    
    // 要素が存在するか確認
    if (!negativeBtn || !moderateNegativeBtn || !noneBtn || !moderatePositiveBtn || !positiveBtn || !customBtn || !plotBtn) {
        console.error('一部のボタン要素が見つかりません');
        if (!negativeBtn) console.error('負の相関ボタンが見つかりません');
        if (!moderateNegativeBtn) console.error('中程度の負の相関ボタンが見つかりません');
        if (!noneBtn) console.error('相関なしボタンが見つかりません');
        if (!moderatePositiveBtn) console.error('中程度の正の相関ボタンが見つかりません');
        if (!positiveBtn) console.error('正の相関ボタンが見つかりません');
        if (!customBtn) console.error('カスタムデータボタンが見つかりません');
        if (!plotBtn) console.error('プロットボタンが見つかりません');
        return;
    }
    
    // イベントリスナーの設定
    negativeBtn.addEventListener('click', function() {
        console.log('負の相関ボタンがクリックされました');
        loadExample('negative');
    });
    
    moderateNegativeBtn.addEventListener('click', function() {
        console.log('中程度の負の相関ボタンがクリックされました');
        loadExample('moderate-negative');
    });
    
    noneBtn.addEventListener('click', function() {
        console.log('相関なしボタンがクリックされました');
        loadExample('none');
    });
    
    moderatePositiveBtn.addEventListener('click', function() {
        console.log('中程度の正の相関ボタンがクリックされました');
        loadExample('moderate-positive');
    });
    
    positiveBtn.addEventListener('click', function() {
        console.log('正の相関ボタンがクリックされました');
        loadExample('positive');
    });
    
    // デバッグ用のログ
    console.log('ボタン要素:', {
        negativeBtn,
        noneBtn,
        positiveBtn,
        customBtn,
        plotBtn
    });
    
    customBtn.addEventListener('click', function() {
        console.log('カスタムデータボタンがクリックされました');
        showDataInput();
        // デバッグ用のログ
        const dataInputContainer = document.getElementById('data-input-container');
        console.log('データ入力コンテナの表示状態:', dataInputContainer ? dataInputContainer.style.display : 'コンテナが見つかりません');
    });
    
    plotBtn.addEventListener('click', function() {
        console.log('プロットボタンがクリックされました');
        plotCustomData();
    });
    
    // 初期データとして負の相関を表示
    loadExample('negative');
    
    // データ入力エリアを初期状態では非表示
    const dataInputContainer = document.getElementById('data-input-container');
    if (dataInputContainer) {
        dataInputContainer.style.display = 'none';
    } else {
        console.error('データ入力コンテナが見つかりません');
    }
    
    console.log('イベントリスナーが設定されました');
});

// サンプルデータの読み込み
function loadExample(type) {
    let data = [];
    
    console.log(`loadExample called with type: ${type}`, new Date().toISOString());
    
    switch(type) {
        case 'negative':
            // 負の相関のサンプルデータ（100個）- さらにばらつきを持たせる
            data = [];
            for (let i = 0; i < 100; i++) {
                const x = Math.floor(Math.random() * 100) + 1; // 1から100までのランダムな値
                // 負の相関になるように、xが大きいほどyが小さくなるようにする（ばらつきあり）
                const baseY = 100 - x; // 基本的な負の相関
                const noise = Math.floor(Math.random() * 21); // 0から20までのランダムなノイズ
                // ノイズを正負ランダムに適用（最大値最小値の制限なし）
                const y = baseY + (Math.random() < 0.5 ? noise : -noise);
                data.push([x, y]);
            }
            break;
        case 'moderate-negative':
            // 中程度の負の相関のサンプルデータ（100個）
            data = [];
            for (let i = 0; i < 100; i++) {
                const x = Math.floor(Math.random() * 100) + 1; // 1から100までのランダムな値
                // 中程度の負の相関になるように、xが大きいほどyが小さくなるようにする（より大きなばらつきあり）
                const baseY = 100 - x; // 基本的な負の相関
                const noise = Math.floor(Math.random() * 70); // 0から70までのランダムなノイズ（より大きなノイズ）
                // ノイズを正負ランダムに適用
                const y = baseY + (Math.random() < 0.5 ? noise : -noise);
                data.push([x, y]);
            }
            break;
        case 'none':
            // 相関なしのサンプルデータ（100個）
            data = [];
            // ランダムなデータを生成
            for (let i = 0; i < 100; i++) {
                const x = Math.floor(Math.random() * 100) + 1; // 1から100までのランダムな値
                const y = Math.floor(Math.random() * 100) + 1; // 1から100までのランダムな値
                data.push([x, y]);
            }
            break;
        case 'moderate-positive':
            // 中程度の正の相関のサンプルデータ（100個）
            data = [];
            for (let i = 0; i < 100; i++) {
                const x = Math.floor(Math.random() * 100) + 1; // 1から100までのランダムな値
                // 中程度の正の相関になるように、xが大きいほどyも大きくなるようにする（より大きなばらつきあり）
                const baseY = x; // 基本的な正の相関
                const noise = Math.floor(Math.random() * 70); // 0から70までのランダムなノイズ（より大きなノイズ）
                // ノイズを正負ランダムに適用
                const y = baseY + (Math.random() < 0.5 ? noise : -noise);
                data.push([x, y]);
            }
            break;
        case 'positive':
            // 正の相関のサンプルデータ（100個）- さらにばらつきを持たせる
            data = [];
            for (let i = 0; i < 100; i++) {
                const x = Math.floor(Math.random() * 100) + 1; // 1から100までのランダムな値
                // 正の相関になるように、xが大きいほどyも大きくなるようにする（ばらつきあり）
                const baseY = x; // 基本的な正の相関
                const noise = Math.floor(Math.random() * 21); // 0から20までのランダムなノイズ
                // ノイズを正負ランダムに適用（最大値最小値の制限なし）
                const y = baseY + (Math.random() < 0.5 ? noise : -noise);
                data.push([x, y]);
            }
            break;
        default:
            console.error(`不明なデータタイプ: ${type}`);
            return;
    }
    
    // データを設定して表示
    currentData = data;
    updateChart();
    calculateAndDisplayStatistics();
    
    // データ入力エリアを非表示
    const dataInputContainer = document.getElementById('data-input-container');
    if (dataInputContainer) {
        dataInputContainer.style.display = 'none';
    }
}

// カスタムデータ入力エリアの表示
function showDataInput() {
    console.log('showDataInput関数が呼び出されました');
    const dataInputContainer = document.getElementById('data-input-container');
    console.log('データ入力コンテナ要素:', dataInputContainer);
    
    if (dataInputContainer) {
        console.log('データ入力コンテナの現在の表示状態:', dataInputContainer.style.display);
        dataInputContainer.style.display = 'block';
        console.log('データ入力コンテナの表示状態を"block"に設定しました');
        
        // スクロールしてデータ入力エリアを表示
        try {
            dataInputContainer.scrollIntoView({ behavior: 'smooth' });
            console.log('スクロール処理を実行しました');
        } catch (error) {
            console.error('スクロール処理でエラーが発生しました:', error);
        }
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
    
    // 相関係数の計算
    const correlation = calculateCorrelation();
    const correlationStrength = getCorrelationStrength(correlation);
    
    // 回帰直線のデータポイント
    const regressionLine = [];
    const xValues = currentData.map(point => point[0]);
    const yValues = currentData.map(point => point[1]);
    const minX = 0; // 原点から始める
    const maxX = Math.max(...xValues) * 1.1; // 少し余裕を持たせる
    const maxY = Math.max(...yValues) * 1.1; // Y軸の最大値も調整
    
    regressionLine.push([minX, slope * minX + intercept]);
    regressionLine.push([maxX, slope * maxX + intercept]);
    
    // 原点を基準とした三角形を表示するためのデータ
    // データの範囲に合わせて単位点の位置を調整
    const unitX = maxX * 0.15; // X軸上の「1」の位置をデータの最大値の15%に設定（小さくする）
    
    // 基準となる三角形データ（原点から単位1の三角形）
    const triangleData = [];
    triangleData.push({x: 0, y: 0}); // 原点
    triangleData.push({x: unitX, y: 0}); // X軸上の点
    triangleData.push({x: unitX, y: unitX}); // 45度の点（傾き1）
    triangleData.push({x: 0, y: 0}); // 原点に戻る
    
    // 回帰直線の傾きを示す三角形（回帰直線に接するように配置）
    const slopeTriangleData = [];
    slopeTriangleData.push({x: 0, y: intercept}); // Y切片の点
    slopeTriangleData.push({x: unitX, y: intercept}); // X軸上の点から水平に
    slopeTriangleData.push({x: unitX, y: slope * unitX + intercept}); // 回帰直線上の点
    slopeTriangleData.push({x: 0, y: intercept}); // Y切片の点に戻る
    
    // X軸上の単位点を示すマーカー
    const unitPoint = {
        x: unitX,
        y: 0
    };
    
    // Y切片を示す点
    const interceptPoint = {
        x: 0,
        y: intercept
    };
    
    // 傾きのラベル位置（三角形の中央付近）
    const slopeLabelPoint = {
        x: unitX / 2,
        y: unitX * slope / 2
    };
    
    // 補助線のデータ
    const xAxisLineData = [];
    xAxisLineData.push({x: 0, y: intercept});
    xAxisLineData.push({x: unitX, y: intercept});
    
    const yAxisLineData = [];
    yAxisLineData.push({x: unitX, y: intercept});
    yAxisLineData.push({x: unitX, y: slope * unitX + intercept});
    
    // 「1」のラベル位置
    const oneLabelPoint = {
        x: unitX,
        y: intercept
    };
    
    // 「a」のラベル位置
    const aLabelPoint = {
        x: unitX / 2,
        y: (slope * unitX + intercept + intercept) / 2
    };
    
    // 「b」のラベル位置
    const bLabelPoint = {
        x: 0,
        y: intercept
    };
    
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
                },
                // 基準三角形は非表示
                {
                    label: `回帰直線の傾き a = ${slope.toFixed(2)}（直接接する三角形）`,
                    data: slopeTriangleData,
                    type: 'line',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true
                },
                // 相関係数と相関の強さを表示するスタンプ
                {
                    label: `相関係数: r = ${correlation.toFixed(4)}`,
                    data: [{x: maxX * 0.75, y: maxY * 0.9}],
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    pointRadius: 0,
                    pointHoverRadius: 0
                },
                {
                    label: `${correlationStrength}相関`,
                    data: [{x: maxX * 0.75, y: maxY * 0.8}],
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    pointRadius: 0,
                    pointHoverRadius: 0
                },
                {
                    label: 'X軸補助線',
                    data: xAxisLineData,
                    type: 'line',
                    borderColor: 'rgba(0, 0, 0, 0.3)',
                    borderDash: [2, 2],
                    borderWidth: 1,
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Y軸補助線',
                    data: yAxisLineData,
                    type: 'line',
                    borderColor: 'rgba(0, 0, 0, 0.3)',
                    borderDash: [2, 2],
                    borderWidth: 1,
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: `単位点 (1)`,
                    data: [oneLabelPoint],
                    backgroundColor: 'rgba(100, 100, 100, 1)',
                    pointRadius: 5,
                    pointStyle: 'circle'
                },
                {
                    label: `傾き (a)`,
                    data: [aLabelPoint],
                    backgroundColor: 'rgba(75, 192, 192, 1)',
                    pointRadius: 5,
                    pointStyle: 'circle'
                },
                {
                    label: `Y切片 (b)`,
                    data: [interceptPoint],
                    backgroundColor: 'rgba(255, 159, 64, 1)',
                    pointRadius: 8,
                    pointStyle: 'rectRot'
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
                    },
                    min: 0, // 原点から始める
                    suggestedMax: maxX
                },
                y: {
                    title: {
                        display: true,
                        text: 'Y値'
                    },
                    min: 0, // 原点から始める
                    suggestedMax: maxY
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex <= 1) {
                                return `(${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
                            } else if (context.datasetIndex === 6) {
                                return `単位点: (${unitX.toFixed(2)}, 0)`;
                            } else if (context.datasetIndex === 7) {
                                return `傾き a: ${slope.toFixed(2)}`;
                            } else if (context.datasetIndex === 8) {
                                return `Y切片 b: (0, ${intercept.toFixed(2)})`;
                            }
                            return context.dataset.label;
                        }
                    }
                },
                legend: {
                    display: false // 凡例を非表示にする
                }
            }
        }
    });
    
    // 相関係数と相関の強さをスタンプとして表示
    const correlationStamp = document.createElement('div');
    correlationStamp.className = 'correlation-stamp';
    correlationStamp.style.position = 'absolute';
    correlationStamp.style.top = '20px';
    correlationStamp.style.right = '20px';
    correlationStamp.style.padding = '10px';
    correlationStamp.style.backgroundColor = getCorrelationColor(correlation);
    correlationStamp.style.color = 'white';
    correlationStamp.style.borderRadius = '5px';
    correlationStamp.style.fontWeight = 'bold';
    correlationStamp.style.fontSize = '18px';
    correlationStamp.style.zIndex = '1000';
    correlationStamp.innerHTML = `
        <div>相関係数: r = ${correlation.toFixed(4)}</div>
        <div>${correlationStrength}相関</div>
    `;
    
    // 既存のスタンプがあれば削除
    const existingStamp = document.querySelector('.correlation-stamp');
    if (existingStamp) {
        existingStamp.remove();
    }
    
    // チャートコンテナにスタンプを追加
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.style.position = 'relative';
    chartContainer.appendChild(correlationStamp);
    
    // グラフの説明を追加
    addChartExplanation(slope, intercept, calculateCorrelation(), result.r2);
}

// グラフの説明を追加
function addChartExplanation(slope, intercept, correlation, r2) {
    // 既存の説明があれば削除
    const existingExplanation = document.getElementById('chart-explanation');
    if (existingExplanation) {
        existingExplanation.remove();
    }
    
    // 新しい説明を作成
    const explanationDiv = document.createElement('div');
    explanationDiv.id = 'chart-explanation';
    explanationDiv.className = 'chart-explanation';
    explanationDiv.innerHTML = `
        <h3>グラフの説明</h3>
        <div class="explanation-grid">
            <div class="explanation-item">
                <span class="color-dot data-point"></span>
                <div class="explanation-text">
                    <strong>データポイント</strong>
                    <span>散布図上の各点</span>
                </div>
            </div>
            <div class="explanation-item">
                <span class="color-dot regression-line"></span>
                <div class="explanation-text">
                    <strong>回帰直線</strong>
                    <span>Y = ${slope.toFixed(2)}X + ${intercept.toFixed(2)}</span>
                </div>
            </div>
            <div class="explanation-item">
                <span class="color-dot correlation-triangle"></span>
                <div class="explanation-text">
                    <strong>傾き (a)</strong>
                    <span>${slope.toFixed(4)}</span>
                </div>
            </div>
            <div class="explanation-item">
                <span class="color-dot y-intercept"></span>
                <div class="explanation-text">
                    <strong>Y切片 (b)</strong>
                    <span>${intercept.toFixed(2)}</span>
                </div>
            </div>
            <div class="explanation-item">
                <div class="explanation-text">
                    <strong>相関係数 (r)</strong>
                    <span>${correlation.toFixed(4)}</span>
                </div>
            </div>
            <div class="explanation-item">
                <div class="explanation-text">
                    <strong>決定係数 (R²)</strong>
                    <span>${r2.toFixed(4)}</span>
                </div>
            </div>
        </div>
    `;
    
    // main-contentの後に挿入
    const mainContent = document.querySelector('.main-content');
    mainContent.after(explanationDiv);
}

// 統計量の計算と表示
function calculateAndDisplayStatistics() {
    // 相関係数の計算
    const correlation = calculateCorrelation();
    const correlationStrength = getCorrelationStrength(correlation);
    
    // 回帰分析
    const result = regression.linear(currentData);
    const slope = result.equation[0];
    const intercept = result.equation[1];
    const r2 = result.r2;
    
    // 統計情報をコンソールに出力（デバッグ用）
    console.log({
        correlation: correlation.toFixed(4),
        strength: correlationStrength,
        equation: `Y = ${slope.toFixed(4)}X + ${intercept.toFixed(4)}`,
        r2: r2.toFixed(4)
    });
    
    // 相関係数と相関の強さを表示
    const correlationValueElement = document.getElementById('correlation-value');
    const correlationStrengthElement = document.getElementById('correlation-strength');
    
    if (correlationValueElement && correlationStrengthElement) {
        correlationValueElement.textContent = correlation.toFixed(4);
        correlationStrengthElement.textContent = correlationStrength;
        
        // 相関の強さに応じて色を変更
        correlationValueElement.style.color = getCorrelationColor(correlation);
        correlationStrengthElement.style.color = getCorrelationColor(correlation);
    }
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
        return '弱い';
    } else if (absR <= 0.7) {
        return '中程度';
    } else {
        return '強い';
    }
}

// 相関係数に基づいて色を取得
function getCorrelationColor(r) {
    const absR = Math.abs(r);
    
    if (absR <= 0.2) {
        return 'rgba(150, 150, 150, 0.8)'; // グレー（相関なし）
    } else if (absR <= 0.4) {
        return 'rgba(255, 193, 7, 0.8)'; // 黄色（弱い相関）
    } else if (absR <= 0.7) {
        return 'rgba(255, 87, 34, 0.8)'; // オレンジ（中程度の相関）
    } else {
        // 正の相関か負の相関かで色を変える
        return r > 0 
            ? 'rgba(76, 175, 80, 0.8)' // 緑（強い正の相関）
            : 'rgba(244, 67, 54, 0.8)'; // 赤（強い負の相関）
    }
}
