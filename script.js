document.addEventListener('DOMContentLoaded', function () {
    const upbitPriceEl = document.getElementById('upbit-price');
    const binancePriceEl = document.getElementById('binance-price');
    const exchangeRateEl = document.getElementById('exchange-rate');
    const kimchiPremiumEl = document.getElementById('kimchi-premium');
    const btcMinedEl = document.getElementById('btc-mined');
    const btcRemainingEl = document.getElementById('btc-remaining');
    const btcDominanceEl = document.getElementById('btc-dominance');
    const fearGreedIndexEl = document.getElementById('fear-greed-score');
    const fearGreedImageEl = document.getElementById('fear-greed-image');
    const toggleModeBtn = document.getElementById('toggle-mode');
    const tradingviewChart = document.getElementById('tradingview-chart');


// 기본 :  아작스  > 패치 말고 > 제이쿼리 아작스 > 리액트 엑시오스



    // 기본 모드는 다크 모드
    if (document.body.classList.contains('dark-mode')) {
        toggleModeBtn.textContent = '라이트 모드';
    } else {
        toggleModeBtn.textContent = '다크 모드';
    }

    async function fetchData() {
        try {
            const upbitResponse = await fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC');
            const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
            const exchangeRateResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const btcInfoResponse = await fetch('https://api.blockchain.info/q/totalbc');
            const btcDominanceResponse = await fetch('https://api.coingecko.com/api/v3/global');
            const fearGreedResponse = await fetch('https://api.alternative.me/fng/?limit=1');

            if (!upbitResponse.ok || !binanceResponse.ok || !exchangeRateResponse.ok || !btcInfoResponse.ok || !btcDominanceResponse.ok || !fearGreedResponse.ok) {
                throw new Error('API 요청 실패');
            }

            const upbitData = await upbitResponse.json();
            const binanceData = await binanceResponse.json();
            const exchangeRateData = await exchangeRateResponse.json();
            const btcInfoData = await btcInfoResponse.json();
            const btcDominanceData = await btcDominanceResponse.json();
            const fearGreedData = await fearGreedResponse.json();

            const upbitPrice = upbitData[0].trade_price;
            const binancePrice = binanceData.price;
            const exchangeRate = exchangeRateData.rates.KRW;

            const kimchiPremium = ((upbitPrice / (binancePrice * exchangeRate)) - 1) * 100;

            const totalBtcMined = btcInfoData / 100000000;
            const totalBtcSupply = 21000000;
            const btcRemaining = totalBtcSupply - totalBtcMined;

            const btcDominance = btcDominanceData.data.market_cap_percentage.btc.toFixed(2);
            const fearGreedIndex = fearGreedData.data[0].value;

            const fearGreedImage = `https://alternative.me/crypto/fear-and-greed-index.png?${new Date().getTime()}`;

            upbitPriceEl.textContent = `${upbitPrice.toLocaleString()} KRW`;
            binancePriceEl.textContent = `${parseFloat(binancePrice).toFixed(2)} USD`;
            exchangeRateEl.textContent = exchangeRate.toFixed(2);
            kimchiPremiumEl.textContent = `${kimchiPremium.toFixed(2)}%`;
            btcMinedEl.textContent = `${totalBtcMined.toLocaleString()} BTC`;
            btcRemainingEl.textContent = `${btcRemaining.toLocaleString()} BTC`;
            btcDominanceEl.textContent = `${btcDominance}%`;
            fearGreedIndexEl.textContent = `${fearGreedIndex} (탐욕지수)`;
            fearGreedImageEl.src = fearGreedImage;

            // 다크 모드일 경우 이미지 색상 반전
            if (document.body.classList.contains('dark-mode')) {
                fearGreedImageEl.style.filter = 'invert(1)';
            } else {
                fearGreedImageEl.style.filter = 'invert(0)';
            }

        } catch (error) {
            console.error('데이터 가져오기 오류:', error);
            upbitPriceEl.textContent = '데이터 로드 실패';
            binancePriceEl.textContent = '데이터 로드 실패';
            exchangeRateEl.textContent = '데이터 로드 실패';
            kimchiPremiumEl.textContent = '데이터 로드 실패';
            btcMinedEl.textContent = '데이터 로드 실패';
            btcRemainingEl.textContent = '데이터 로드 실패';
            btcDominanceEl.textContent = '데이터 로드 실패';
            fearGreedIndexEl.textContent = '데이터 로드 실패';
        }
    }

    fetchData();
    setInterval(fetchData, 60000); // 1분마다 데이터 갱신

    toggleModeBtn.addEventListener('click', function () {
        const body = document.body;
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');

        if (body.classList.contains('dark-mode')) {
            toggleModeBtn.textContent = '라이트 모드';
            tradingviewChart.src = tradingviewChart.src.replace("theme=light", "theme=dark");
            fearGreedImageEl.style.filter = 'invert(1)';
        } else {
            toggleModeBtn.textContent = '다크 모드';
            tradingviewChart.src = tradingviewChart.src.replace("theme=dark", "theme=light");
            fearGreedImageEl.style.filter = 'invert(0)';
        }
    });
});