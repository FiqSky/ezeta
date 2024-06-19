(adsbygoogle = window.adsbygoogle || []).push({
    google_ad_client: "ca-pub-4500247414012171",
    enable_page_level_ads: true
});

document.getElementById('userAddressForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userAddress = document.getElementById('userAddress').value.toLowerCase().trim();
    checkUserAddress(userAddress);
});

function checkUserAddress(userAddress) {
    const loadingMessages = ['Loading...', 'Please wait...', 'Wait a minute...', 'Checking data...', 'Calm down...', 'So many data, wait...', 'Almost done...'];
    let messageIndex = 0;
    const loadingElement = document.getElementById('loading');
    
    loadingElement.style.display = 'block';
    const loadingInterval = setInterval(() => {
        loadingElement.innerText = loadingMessages[messageIndex];
        messageIndex = (messageIndex + 1) % loadingMessages.length;
    }, 5000);
    
    document.getElementById('result').innerHTML = '';

    Papa.parse('users.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        step: function(row) {
            if (row.data.userAddress.toLowerCase().trim() === userAddress) {
                const xpTotal = parseInt(row.data.xpTotal, 10);
                const isEligible = xpTotal > 200000;
                displayResult(Object.keys(row.data), Object.values(row.data), isEligible);
                this.abort();
            }
        },
        complete: function() {
            clearInterval(loadingInterval);
            loadingElement.style.display = 'none';
            if (document.getElementById('result').innerHTML === '') {
                document.getElementById('result').innerText = `Wallet address ${userAddress} not found in the data try other address.`;
            }
        },
        error: function(error) {
            clearInterval(loadingInterval);
            loadingElement.style.display = 'none';
            console.error('Error parsing the CSV file:', error);
            document.getElementById('result').innerText = `Error parsing the CSV file: ${error.message}`;
        }
    });
}

function displayResult(headers, row, isEligible) {
    document.getElementById('loading').style.display = 'none';
    let resultHTML = '<table>';
    for (let i = 0; i < headers.length; i++) {
        resultHTML += `<tr><th>${headers[i]}</th><td>${row[i]}</td></tr>`;
    }
    resultHTML += '</table>';
    resultHTML += isEligible 
        ? '<div class="eligible">Eligible</div>' 
        : '<div class="not-eligible">Not Eligible</div>';
    document.getElementById('result').innerHTML = resultHTML;
    document.getElementById('result').innerHTML += `
        <div class="advertisement">
            <p>Mohon maaf, ada iklan di bawah ini:</p>
            <div id="ad">
                <ins class="adsbygoogle"
                    style="display:block"
                    data-ad-client="ca-pub-4500247414012171"
                    data-ad-slot="1234567890"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>
            <p>Eligible means more than 200k exp, and vice versa</p>
            <p>This website does not collect any data just to check the data because the data is too much and big, cheers</p>
        </div>
    `;
}