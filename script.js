const BHORI = 11.664;
const ANA_TO_GRAM = 0.729;

let currentUnit = 'bhori';

let rates = { 
    gold: { '22k': 22485, '21k': 21465, '18k': 18400, 'traditional': 14985 },
    silver: { '22k': 520, '21k': 495, '18k': 425, 'traditional': 320 }
};

function fetchGoldRates() {
    setTimeout(() => {
        const rows = document.querySelectorAll('#priceTable table tbody tr');
        if (rows.length >= 8) {
            rates.gold['22k'] = extractNumber(rows[0]?.cells[1]?.innerText) || rates.gold['22k'];
            rates.gold['21k'] = extractNumber(rows[1]?.cells[1]?.innerText) || rates.gold['21k'];
            rates.gold['18k'] = extractNumber(rows[2]?.cells[1]?.innerText) || rates.gold['18k'];
            rates.gold['traditional'] = extractNumber(rows[3]?.cells[1]?.innerText) || rates.gold['traditional'];
            
            rates.silver['22k'] = extractNumber(rows[4]?.cells[1]?.innerText) || rates.silver['22k'];
            rates.silver['21k'] = extractNumber(rows[5]?.cells[1]?.innerText) || rates.silver['21k'];
            rates.silver['18k'] = extractNumber(rows[6]?.cells[1]?.innerText) || rates.silver['18k'];
            rates.silver['traditional'] = extractNumber(rows[7]?.cells[1]?.innerText) || rates.silver['traditional'];
            
            updatePriceDisplay();
            document.getElementById('lastUpdateTime').innerHTML = '<i class="fas fa-clock"></i> আপডেট: ' + new Date().toLocaleString('bn-BD');
        }
    }, 2500); 
}

function extractNumber(text) {
    if (!text) return null;
    const match = text.replace(/[^\d]/g, '');
    return match ? parseInt(match) : null;
}

setInterval(fetchGoldRates, 3600000);

window.setUnit = function(unit) {
    currentUnit = unit;
    
    document.getElementById('unitBhori').classList.toggle('active', unit === 'bhori');
    document.getElementById('unitGram').classList.toggle('active', unit === 'gram');
    
    document.getElementById('goldUnitLabel').innerText = unit === 'bhori' ? '(টাকা/ভরি)' : '(টাকা/গ্রাম)';
    document.getElementById('silverUnitLabel').innerText = unit === 'bhori' ? '(টাকা/ভরি)' : '(টাকা/গ্রাম)';
    
    document.getElementById('inputUnitBadge').innerText = unit === 'bhori' ? 'আনাতে লিখুন' : 'গ্রামে লিখুন';
    
    updatePriceDisplay();
};

function updatePriceDisplay() {
    const goldIds = ['gold22Price', 'gold21Price', 'gold18Price', 'goldTradPrice'];
    const silverIds = ['silver22Price', 'silver21Price', 'silver18Price', 'silverTradPrice'];
    const goldTypes = ['22k', '21k', '18k', 'traditional'];
    const silverTypes = ['22k', '21k', '18k', 'traditional'];
    
    for (let i=0; i<4; i++) {
        let goldVal = rates.gold[goldTypes[i]];
        let silverVal = rates.silver[silverTypes[i]];
        
        if (currentUnit === 'bhori') {
            goldVal = goldVal * BHORI;
            silverVal = silverVal * BHORI;
        }
        
        document.getElementById(goldIds[i]).innerText = '৳' + Math.round(goldVal).toLocaleString('bn-BD');
        document.getElementById(silverIds[i]).innerText = '৳' + Math.round(silverVal).toLocaleString('bn-BD');
    }
    
    document.getElementById('goldRate22').value = rates.gold['22k'];
    document.getElementById('goldRate21').value = rates.gold['21k'];
    document.getElementById('goldRate18').value = rates.gold['18k'];
    document.getElementById('goldRateTrad').value = rates.gold['traditional'];
    document.getElementById('silverRate22').value = rates.silver['22k'];
    document.getElementById('silverRate21').value = rates.silver['21k'];
    document.getElementById('silverRate18').value = rates.silver['18k'];
    document.getElementById('silverRateTrad').value = rates.silver['traditional'];
}

window.applyManualRates = function() {
    rates.gold['22k'] = parseFloat(document.getElementById('goldRate22').value);
    rates.gold['21k'] = parseFloat(document.getElementById('goldRate21').value);
    rates.gold['18k'] = parseFloat(document.getElementById('goldRate18').value);
    rates.gold['traditional'] = parseFloat(document.getElementById('goldRateTrad').value);
    rates.silver['22k'] = parseFloat(document.getElementById('silverRate22').value);
    rates.silver['21k'] = parseFloat(document.getElementById('silverRate21').value);
    rates.silver['18k'] = parseFloat(document.getElementById('silverRate18').value);
    rates.silver['traditional'] = parseFloat(document.getElementById('silverRateTrad').value);
    
    updatePriceDisplay();
    document.getElementById('lastUpdateTime').innerHTML = '<i class="fas fa-clock"></i> ম্যানুয়াল আপডেট: ' + new Date().toLocaleString('bn-BD');
    alert('মূল্য ম্যানুয়ালি আপডেট হয়েছে');
};

window.resetToLiveRates = function() {
    fetchGoldRates();
    document.getElementById('lastUpdateTime').innerHTML = '<i class="fas fa-clock"></i> GoldR লাইভ রেটে রিসেট হচ্ছে...';
};

window.togglePriceEditor = function() {
    const editor = document.getElementById('priceEditor');
    const icon = document.getElementById('toggleIcon');
    editor.classList.toggle('show');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
};

function calculateZakat() {
    function getValue(id) { return parseFloat(document.getElementById(id)?.value) || 0; }

    function convertToGram(value) {
        if (currentUnit === 'bhori') {
            return value * ANA_TO_GRAM;
        } else {
            return value;
        }
    }

    const gold22 = convertToGram(getValue('gold22_in')) * rates.gold['22k'];
    const gold21 = convertToGram(getValue('gold21_in')) * rates.gold['21k'];
    const gold18 = convertToGram(getValue('gold18_in')) * rates.gold['18k'];
    const goldTrad = convertToGram(getValue('goldTrad_in')) * rates.gold['traditional'];
    const totalGold = gold22 + gold21 + gold18 + goldTrad;

    const silver22 = convertToGram(getValue('silver22_in')) * rates.silver['22k'];
    const silver21 = convertToGram(getValue('silver21_in')) * rates.silver['21k'];
    const silver18 = convertToGram(getValue('silver18_in')) * rates.silver['18k'];
    const silverTrad = convertToGram(getValue('silverTrad_in')) * rates.silver['traditional'];
    const totalSilver = silver22 + silver21 + silver18 + silverTrad;

    const cash = getValue('cash');
    const bank = getValue('bank');
    const fdr = getValue('fdr');
    const stocks = getValue('stocks');
    const mf = getValue('mf');
    const other = getValue('other');
    const inventory = getValue('inventory');
    const bizCash = getValue('businessCash');

    const shortDebt = getValue('shortDebt');
    const longDebt = getValue('longDebt');
    const otherLiab = getValue('otherLiab');
    const totalLiab = shortDebt + longDebt + otherLiab;

    const totalAssets = totalGold + totalSilver + cash + bank + fdr + stocks + mf + other + inventory + bizCash;
    const netAssets = Math.max(0, totalAssets - totalLiab);

    const nisabGold = 87.48 * rates.gold['22k'];
    const nisabSilver = 612.36 * rates.silver['traditional'];
    const applicableNisab = Math.min(nisabGold, nisabSilver);
    const zakat = netAssets >= applicableNisab ? netAssets * 0.025 : 0;

    const resultDiv = document.getElementById('resultArea');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3 class="text-2xl font-bold mb-3">📊 যাকাত হিসাবের ফলাফল</h3>
        <div class="grid gap-2">
            <div class="flex justify-between"><span>মোট সম্পদ:</span> <strong>৳${totalAssets.toFixed(2).toLocaleString('bn-BD')}</strong></div>
            <div class="flex justify-between"><span>মোট দায়:</span> <strong>৳${totalLiab.toFixed(2).toLocaleString('bn-BD')}</strong></div>
            <div class="flex justify-between border-t pt-2 text-lg font-bold"><span>নেট যাকাতযোগ্য সম্পদ:</span> <strong>৳${netAssets.toFixed(2).toLocaleString('bn-BD')}</strong></div>
            <div class="flex justify-between"><span>সোনার নিসাব (৮৭.৪৮ গ্রাম):</span> <strong>৳${nisabGold.toFixed(2).toLocaleString('bn-BD')}</strong></div>
            <div class="flex justify-between"><span>রুপার নিসাব (৬১২.৩৬ গ্রাম):</span> <strong>৳${nisabSilver.toFixed(2).toLocaleString('bn-BD')}</strong></div>
            <div class="flex justify-between bg-yellow-100 p-2 rounded"><span>প্রযোজ্য নিসাব (ছোটটি):</span> <strong>৳${applicableNisab.toFixed(2).toLocaleString('bn-BD')}</strong></div>
            <div class="flex justify-between text-2xl font-extrabold text-green-800 border-t-4 border-green-500 mt-3 pt-3">
                <span>প্রদেয় যাকাত (২.৫%):</span> <strong>৳${zakat.toFixed(2).toLocaleString('bn-BD')}</strong>
            </div>
            <p class="mt-3 text-lg ${netAssets >= applicableNisab ? 'text-green-700' : 'text-red-600'}">
                ${netAssets >= applicableNisab ? '✅ আপনার যাকাত ফরজ হয়েছে।' : '❌ আপনি নিসাব সীমা অতিক্রম করেননি। যাকাত ফরজ নয়।'}
            </p>
            <p class="text-sm text-gray-600 mt-2">*আপনি ${currentUnit === 'bhori' ? 'আনা' : 'গ্রাম'} এককে সংখ্যা বসিয়েছেন</p>
        </div>
    `;
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

window.toggleFaq = function(btn) {
    const answer = btn.nextElementSibling;
    const icon = btn.querySelector('span');
    answer.classList.toggle('open');
    icon.innerText = answer.classList.contains('open') ? '−' : '+';
};

window.onload = function() {
    updatePriceDisplay(); 
    fetchGoldRates();    
};