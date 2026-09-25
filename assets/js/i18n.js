// assets/js/i18n.js
const translation ={};
let currentLang="en";

function getPreferredLanguage(){
    const urlParams =new URLSearchParams(window.location.search)
    const langParam = urlParams.get("lang")
    if (langParam){
        return langParam
    };
    const storedLang = localStorage.getItem("userLang");
    if (storedLang){
        return storedLang
    }
    const browserLang = navigator.language.split('-')[0];
    if (["en", "zh", "ja"].includes(browserLang)) {
        return browserLang;
    }
    return 'en';
}
async function loadTranslations(lang) {
    // 只有当该语言的翻译尚未加载时才去请求
    if (!translations[lang]) {
        try {
            const response = await fetch(`./lang/${lang}.json`);
            translations[lang] = await response.json();
        } catch (error) {
            console.error(`Error loading ${lang} translations:`, error);
            // 如果加载失败，可以考虑使用 HTML 中的默认英文内容，或提供一个回退机制
        }
    }
}

// 3. 更新页面内容
function updateContent() {
    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-i18n');
        // 只有当当前语言的翻译存在，且有对应的key时才进行替换
        if (translations[currentLang] && translations[currentLang][key]) {
            if (element.tagName === 'TITLE') {
                element.innerText = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });

    document.documentElement.lang = currentLang;
}

// 4. 切换语言函数
async function setLanguage(lang) {
    if (currentLang === lang) return; // 避免重复切换
    currentLang = lang;
    localStorage.setItem('userLang', lang); // 存储用户选择
    await loadTranslations(currentLang); // 确保当前语言翻译已加载
    updateContent();
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', async () => {
    currentLang = getPreferredLanguage(); // 根据优先级获取当前语言

    // 优先加载当前语言的翻译
    await loadTranslations(currentLang);
    // 也可以预加载所有语言，以便更快的切换
    // 如果 currentLang 是 'en'，这里会加载 'en.json'，然后加载 'zh.json'
    // 如果 currentLang 是 'zh'，这里会加载 'zh.json'，然后加载 'en.json'
    if (currentLang === 'en') {
        await loadTranslations('zh');
    } else {
        await loadTranslations('en');
    }

    updateContent(); // 初始渲染

    // 绑定语言切换按钮事件
    document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
    document.getElementById('lang-zh').addEventListener('click', () => setLanguage('zh'));
});