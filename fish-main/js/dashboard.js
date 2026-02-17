// Скрипт для дашборда администратора

document.addEventListener('DOMContentLoaded', function() {
    // Добавляем класс к body для применения стилей из dashboard.css
    document.body.classList.add('dashboard-body');
    
    // Загрузка данных администратора (заранее заданных)
    const adminData = getAdminData();
    
    // Отображаем данные администратора
    displayAdminInfo(adminData);
    
    // Получаем список пользователей из localStorage
    const usersListJSON = localStorage.getItem('usersList');
    
    if (!usersListJSON) {
        // Если нет списка, пробуем получить информацию о единственном пользователе (совместимость)
        const userInfoJSON = localStorage.getItem('userInfo');
        
        if (!userInfoJSON) {
            displayNoDataMessage();
            return;
        }
        
        try {
            // Создаем список из одного пользователя
            const userInfo = JSON.parse(userInfoJSON);
            const usersList = [userInfo];
            
            // Отображаем список пользователей
            renderUsersList(usersList);
            
            // Отображаем информацию о пользователе
            displayUserDetails(userInfo);
        } catch (error) {
            console.error('Ошибка при обработке данных пользователя:', error);
            displayNoDataMessage();
        }
    } else {
        try {
            // Парсим список пользователей
            const usersList = JSON.parse(usersListJSON);
            
            if (usersList.length > 0) {
                // Отображаем список пользователей
                renderUsersList(usersList);
                
                // Отображаем информацию о первом пользователе по умолчанию
                displayUserDetails(usersList[0]);
            } else {
                displayNoDataMessage();
            }
        } catch (error) {
            console.error('Ошибка при обработке списка пользователей:', error);
            displayNoDataMessage();
        }
    }
    
    // Обновляем заголовок страницы и дополнительные элементы
    updateDashboardHeader();
});

// Создание данных администратора
function getAdminData() {
    return {
        email: 'Нет данных',
        role: 'Администратор системы',
        lastLogin: new Date().toISOString(),
        ip: '192.168.1.1',
        location: {
            city: 'Астана',
            country: 'Казахстан',
            coordinates: [55.7558, 37.6173]
        },
        system: {
            device: 'Рабочая станция',
            os: 'Windows 11 Pro',
            browser: 'Chrome 115.0.5790.171'
        }
    };
}

// Обновление заголовка дашборда
function updateDashboardHeader() {
    const dashboardTitle = document.querySelector('.dashboard-title');
    const dashboardSubtitle = document.querySelector('.dashboard-subtitle');
    const headerElement = document.querySelector('.dashboard-header');
    
    if (dashboardTitle) {
        dashboardTitle.innerHTML = '<i class="fas fa-shield-alt"></i> Панель администратора';
    }
    
    if (dashboardSubtitle) {
        dashboardSubtitle.textContent = 'Мониторинг и управление пользователями';
    }
    
    // Добавляем метку "Админ панель"
    if (headerElement && !document.querySelector('.admin-panel-label')) {
        const adminLabel = document.createElement('div');
        adminLabel.classList.add('admin-panel-label');
        adminLabel.textContent = 'Админ-панель';
        headerElement.insertBefore(adminLabel, dashboardTitle);
    }
    
    // Обновляем предупреждающий баннер
    const warningBanner = document.querySelector('.warning-banner');
    if (warningBanner) {
        warningBanner.innerHTML = `
            <div class="warning-title"><i class="fas fa-exclamation-triangle"></i> Режим демонстрации</div>
            <div class="warning-text">Данный дашборд предназначен для демонстрации возможностей сбора информации. Все отображаемые данные о пользователях собраны с согласия в рамках демонстрации.</div>
        `;
    }
    
    // Обновляем заголовки для блоков информации
    updateCardTitles();
}

// Обновление заголовков карточек
function updateCardTitles() {
    const cardTitles = document.querySelectorAll('.card-title');
    const icons = ['fa-user-circle', 'fa-laptop', 'fa-map-marker-alt', 'fa-network-wired'];
    const titles = ['Данные пользователя', 'Системная информация', 'Геолокация', 'Сетевая информация'];
    
    cardTitles.forEach((title, index) => {
        if (index < icons.length) {
            title.innerHTML = `<i class="fas ${icons[index]}"></i> ${titles[index]}`;
        }
    });
    
    // Обновляем заголовок списка пользователей
    const usersTitle = document.querySelector('.users-title');
    if (usersTitle) {
        usersTitle.innerHTML = '<i class="fas fa-users"></i> Список пользователей';
    }
}

// Отображение информации об администраторе
function displayAdminInfo(adminData) {
    // Проверяем наличие контейнера для информации об администраторе
    let adminSummary = document.querySelector('.admin-summary');
    
    // Если контейнера нет, создаем его
    if (!adminSummary) {
        const colLeft = document.querySelector('.col-left');
        
        if (!colLeft) return;
        
        adminSummary = document.createElement('div');
        adminSummary.classList.add('admin-summary');
        
        adminSummary.innerHTML = `
            <div class="admin-summary-header">
                <div class="admin-summary-title"><i class="fas fa-user-shield"></i> Информация администратора</div>
                <div class="admin-summary-subtitle">Текущий статус системы</div>
            </div>
            <div class="admin-summary-content">
                <div class="admin-summary-row">
                    <div class="admin-summary-icon"><i class="fas fa-envelope"></i></div>
                    <div class="admin-summary-label">Email:</div>
                    <div class="admin-summary-value" id="admin-email"></div>
                </div>
                <div class="admin-summary-row">
                    <div class="admin-summary-icon"><i class="fas fa-user-tag"></i></div>
                    <div class="admin-summary-label">Роль:</div>
                    <div class="admin-summary-value" id="admin-role"></div>
                </div>
                <div class="admin-summary-row">
                    <div class="admin-summary-icon"><i class="fas fa-clock"></i></div>
                    <div class="admin-summary-label">Вход:</div>
                    <div class="admin-summary-value" id="admin-login-time"></div>
                </div>
                <div class="admin-summary-row">
                    <div class="admin-summary-icon"><i class="fas fa-network-wired"></i></div>
                    <div class="admin-summary-label">IP:</div>
                    <div class="admin-summary-value" id="admin-ip"></div>
                </div>
                <div class="admin-summary-row">
                    <div class="admin-summary-icon"><i class="fas fa-map-marker-alt"></i></div>
                    <div class="admin-summary-label">Локация:</div>
                    <div class="admin-summary-value" id="admin-location"></div>
                </div>
                <div class="admin-summary-row">
                    <div class="admin-summary-icon"><i class="fas fa-desktop"></i></div>
                    <div class="admin-summary-label">Система:</div>
                    <div class="admin-summary-value" id="admin-system"></div>
                </div>
            </div>
        `;
        
        // Добавляем в начало колонки
        colLeft.insertBefore(adminSummary, colLeft.firstChild);
    }
    
    // Заполняем информацию об администраторе
    document.getElementById('admin-email').textContent = adminData.email;
    document.getElementById('admin-role').textContent = adminData.role;
    document.getElementById('admin-login-time').textContent = formatDate(new Date(adminData.lastLogin));
    document.getElementById('admin-ip').textContent = adminData.ip;
    document.getElementById('admin-location').textContent = `${adminData.location.city}, ${adminData.location.country}`;
    document.getElementById('admin-system').textContent = adminData.system.browser;
    
    // Обновляем заголовок пользовательского резюме
    const userSummaryTitle = document.querySelector('.user-summary-title');
    if (userSummaryTitle) {
        userSummaryTitle.innerHTML = '<i class="fas fa-user"></i> Информация о пользователе';
    }
}

// Отображение списка пользователей
function renderUsersList(usersList) {
    const usersListElement = document.getElementById('users-list');
    
    if (!usersListElement) return;
    
    // Очищаем текущее содержимое
    usersListElement.innerHTML = '';
    
    // Создаем элементы для каждого пользователя
    usersList.forEach(user => {
        const userItem = document.createElement('div');
        userItem.classList.add('user-item');
        userItem.dataset.userId = user.id;
        
        // Получаем первую букву email (или "U", если email отсутствует)
        const firstLetter = user.email ? user.email[0].toUpperCase() : 'U';
        
        // Форматируем дату
        const dateFormatted = user.time ? formatDateShort(new Date(user.time)) : 'Неизвестно';
        
        // Создаем HTML для элемента пользователя
        userItem.innerHTML = `
            <div class="user-item-data">
                <div class="user-item-avatar">${firstLetter}</div>
                <div class="user-item-info">
                    <div class="user-item-email">${user.email || 'Неизвестный пользователь'}</div>
                    <div class="user-item-details">
                        <span><i class="fas fa-clock"></i> ${dateFormatted}</span>
                        <span><i class="fas fa-globe"></i> ${user.ip || 'Неизвестный IP'}</span>
                    </div>
                </div>
            </div>
            <div class="user-item-actions">
                <button class="user-item-btn view-user">Подробнее</button>
            </div>
        `;
        
        // Добавляем обработчик нажатия на элемент или кнопку
        userItem.addEventListener('click', function() {
            // Находим пользователя по ID
            const selectedUser = usersList.find(u => u.id === user.id);
            
            if (selectedUser) {
                // Удаляем активный класс у всех элементов
                document.querySelectorAll('.user-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Добавляем активный класс выбранному элементу
                userItem.classList.add('active');
                
                // Отображаем информацию о выбранном пользователе
                displayUserDetails(selectedUser);
            }
        });
        
        // Добавляем элемент в список
        usersListElement.appendChild(userItem);
    });
}

// Отображение данных выбранного пользователя
function displayUserDetails(userInfo) {
    displayUserInfo(userInfo);
    displaySystemInfo(userInfo);
    displayNetworkInfo(userInfo);
    displaySummaryInfo(userInfo);
    
    // Инициализируем карту и отображаем информацию о местоположении
    displayLocationInfo(userInfo);
}

// Отображение пользовательских данных
function displayUserInfo(userInfo) {
    const userEmailEl = document.getElementById('user-email');
    const userPasswordEl = document.getElementById('user-password');
    const loginTimeEl = document.getElementById('login-time');
    
    if (userEmailEl && userInfo.email) {
        userEmailEl.textContent = userInfo.email;
    }
    
    if (userPasswordEl && userInfo.password) {
        userPasswordEl.textContent = userInfo.password;
    }
    
    if (loginTimeEl && userInfo.time) {
        const date = new Date(userInfo.time);
        loginTimeEl.textContent = formatDate(date);
    }
}

// Отображение системной информации
function displaySystemInfo(userInfo) {
    const deviceInfoEl = document.getElementById('device-info');
    const browserInfoEl = document.getElementById('browser-info');
    const osInfoEl = document.getElementById('os-info');
    const screenInfoEl = document.getElementById('screen-info');
    
    if (deviceInfoEl && userInfo.deviceInfo) {
        deviceInfoEl.textContent = typeof userInfo.deviceInfo === 'string' ? userInfo.deviceInfo : 'Сложные данные';
    }
    
    if (browserInfoEl && userInfo.browserInfo) {
        browserInfoEl.textContent = userInfo.browserInfo;
    }
    
    if (osInfoEl && userInfo.osInfo) {
        osInfoEl.textContent = userInfo.osInfo;
    }
    
    if (screenInfoEl && userInfo.screenInfo) {
        if (typeof userInfo.screenInfo === 'string') {
            screenInfoEl.textContent = userInfo.screenInfo;
        } else if (typeof userInfo.screenInfo === 'object') {
            screenInfoEl.innerHTML = '';
            
            const resolutionEl = document.createElement('div');
            resolutionEl.innerHTML = `<span class="screen-detail">Разрешение:</span> ${userInfo.screenInfo.resolution || 'Неизвестно'}`;
            screenInfoEl.appendChild(resolutionEl);
            
            if (userInfo.screenInfo.pixelRatio) {
                const pixelRatioEl = document.createElement('div');
                pixelRatioEl.innerHTML = `<span class="screen-detail">Плотность пикселей:</span> ${userInfo.screenInfo.pixelRatio}`;
                screenInfoEl.appendChild(pixelRatioEl);
            }
            
            if (userInfo.screenInfo.orientation) {
                const orientationEl = document.createElement('div');
                orientationEl.innerHTML = `<span class="screen-detail">Ориентация:</span> ${userInfo.screenInfo.orientation}`;
                screenInfoEl.appendChild(orientationEl);
            }
        }
    }
    
    // Добавляем дополнительную информацию об устройстве
    appendExtraDeviceInfo(userInfo);
}

// Добавление дополнительной информации об устройстве
function appendExtraDeviceInfo(userInfo) {
    const deviceInfoCard = document.querySelector('.card:nth-child(2) .card-content');
    
    if (!deviceInfoCard) return;
    
    // Проверяем, есть ли дополнительные поля
    const hasExtraFields = userInfo.hardwareConcurrency || userInfo.deviceMemory || 
                          userInfo.touchPoints || userInfo.batteryInfo;
    
    // Если есть дополнительные данные и еще не добавлены
    if (hasExtraFields && !document.getElementById('extra-device-info')) {
        const extraInfoSection = document.createElement('div');
        extraInfoSection.id = 'extra-device-info';
        extraInfoSection.classList.add('extra-device-section');
        
        let extraInfoHTML = '<div class="extra-section-title"><i class="fas fa-microchip"></i> Дополнительная информация</div>';
        
        if (userInfo.hardwareConcurrency) {
            extraInfoHTML += `
                <div class="data-item">
                    <div class="label">Количество ядер CPU:</div>
                    <div class="value">${userInfo.hardwareConcurrency}</div>
                </div>
            `;
        }
        
        if (userInfo.deviceMemory) {
            extraInfoHTML += `
                <div class="data-item">
                    <div class="label">Объем памяти:</div>
                    <div class="value">${userInfo.deviceMemory} ГБ</div>
                </div>
            `;
        }
        
        if (userInfo.touchPoints) {
            extraInfoHTML += `
                <div class="data-item">
                    <div class="label">Макс. кол-во касаний:</div>
                    <div class="value">${userInfo.touchPoints}</div>
                </div>
            `;
        }
        
        if (userInfo.batteryInfo) {
            let batteryText = userInfo.batteryInfo;
            
            if (typeof userInfo.batteryInfo === 'object') {
                batteryText = `Уровень: ${userInfo.batteryInfo.level}, Зарядка: ${userInfo.batteryInfo.charging}`;
            }
            
            extraInfoHTML += `
                <div class="data-item">
                    <div class="label">Батарея:</div>
                    <div class="value">${batteryText}</div>
                </div>
            `;
        }
        
        extraInfoSection.innerHTML = extraInfoHTML;
        deviceInfoCard.appendChild(extraInfoSection);
    }
}

// Отображение информации о местоположении
function displayLocationInfo(userInfo) {
    // Элементы DOM для обновления
    const ipAddressEl = document.getElementById('ip-address');
    const locationEl = document.getElementById('location');
    const mapContainer = document.getElementById('map');
    
    // IP-адрес
    if (ipAddressEl && userInfo.ip) {
        ipAddressEl.textContent = userInfo.ip;
    }
    
    // Данные о местоположении
    let locationText = 'Местоположение неизвестно';
    let latitude = null;
    let longitude = null;
    let displayAddress = null;
    let locationType = 'ip'; // по умолчанию по IP
    
    // Проверяем наличие точных координат
    if (userInfo.accurateLocation && userInfo.accurateLocation.latitude && userInfo.accurateLocation.longitude) {
        latitude = userInfo.accurateLocation.latitude;
        longitude = userInfo.accurateLocation.longitude;
        locationType = 'accurate';
        
        if (userInfo.accurateAddress) {
            displayAddress = userInfo.accurateAddress;
        }
    } 
    // Если нет точных, используем по IP
    else if (userInfo.location && userInfo.location.latitude && userInfo.location.longitude) {
        latitude = userInfo.location.latitude;
        longitude = userInfo.location.longitude;
        
        if (userInfo.location.city && userInfo.location.city !== 'Неизвестно') {
            const locationParts = [];
            
            if (userInfo.location.city) locationParts.push(userInfo.location.city);
            if (userInfo.location.region) locationParts.push(userInfo.location.region);
            if (userInfo.location.country) locationParts.push(userInfo.location.country);
            
            if (locationParts.length > 0) {
                displayAddress = locationParts.join(', ');
            }
        }
    }
    
    // Обновляем информацию о местоположении на странице
    if (locationEl) {
        if (displayAddress) {
            // Если есть точный адрес, используем его с пометкой типа
            const locationTypeLabel = locationType === 'accurate' ? 
                '<span class="location-accurate">[Точное]</span>' : 
                '<span class="location-ip">[По IP]</span>';
            
            locationEl.innerHTML = `${locationTypeLabel} ${displayAddress}`;
        } else {
            locationEl.textContent = locationText;
        }
    }
    
    // Дополнительная информация о местоположении
    if (userInfo.location && userInfo.location.provider) {
        appendExtraLocationInfo(userInfo);
    }
    
    // Инициализируем карту с координатами
    if (mapContainer && latitude && longitude) {
        initMap(latitude, longitude, locationType, displayAddress, userInfo);
    } else if (mapContainer) {
        mapContainer.innerHTML = '<div class="no-data">Информация о местоположении недоступна</div>';
    }
}

// Добавление дополнительной информации о местоположении
function appendExtraLocationInfo(userInfo) {
    const locationCard = document.querySelector('.card:nth-child(3) .card-content');
    
    if (!locationCard) return;
    
    // Проверяем, есть ли дополнительные поля и еще не добавлены
    if (userInfo.location && !document.getElementById('extra-location-info')) {
        const extraInfoSection = document.createElement('div');
        extraInfoSection.id = 'extra-location-info';
        extraInfoSection.classList.add('extra-location-section');
        
        let extraInfoHTML = '<div class="extra-section-title"><i class="fas fa-info-circle"></i> Дополнительная информация</div>';
        
        if (userInfo.location.timezone) {
            extraInfoHTML += `
                <div class="data-item">
                    <div class="label">Часовой пояс:</div>
                    <div class="value">${userInfo.location.timezone}</div>
                </div>
            `;
        }
        
        if (userInfo.location.provider) {
            extraInfoHTML += `
                <div class="data-item">
                    <div class="label">Провайдер:</div>
                    <div class="value">${userInfo.location.provider}</div>
                </div>
            `;
        }
        
        if (userInfo.location.postal) {
            extraInfoHTML += `
                <div class="data-item">
                    <div class="label">Почтовый индекс:</div>
                    <div class="value">${userInfo.location.postal}</div>
                </div>
            `;
        }
        
        if (userInfo.geolocationStatus) {
            extraInfoHTML += `
                <div class="data-item">
                    <div class="label">Статус геолокации:</div>
                    <div class="value">${userInfo.geolocationStatus}</div>
                </div>
            `;
        }
        
        if (extraInfoHTML) {
            extraInfoSection.innerHTML = extraInfoHTML;
            locationCard.appendChild(extraInfoSection);
        }
    }
}

// Отображение сетевой информации
function displayNetworkInfo(userInfo) {
    const languageEl = document.getElementById('language');
    const userAgentEl = document.getElementById('user-agent');
    const referrerEl = document.getElementById('referrer');
    
    if (languageEl) {
        if (userInfo.languages) {
            languageEl.textContent = userInfo.languages;
        } else if (userInfo.language) {
            languageEl.textContent = userInfo.language;
        }
    }
    
    if (userAgentEl && userInfo.userAgent) {
        userAgentEl.textContent = userInfo.userAgent;
    }
    
    if (referrerEl && userInfo.referrer) {
        referrerEl.textContent = userInfo.referrer;
    }
    
    // Добавляем дополнительную сетевую информацию
    appendExtraNetworkInfo(userInfo);
}

// Добавление дополнительной сетевой информации
function appendExtraNetworkInfo(userInfo) {
    const networkCard = document.querySelector('.card:nth-child(4) .card-content');
    
    if (!networkCard) return;
    
    // Проверяем, есть ли дополнительные поля и еще не добавлены
    if (!document.getElementById('extra-network-info')) {
        const extraInfoSection = document.createElement('div');
        extraInfoSection.id = 'extra-network-info';
        extraInfoSection.classList.add('extra-network-section');
        
        let extraInfoHTML = '<div class="extra-section-title"><i class="fas fa-network-wired"></i> Дополнительная информация</div>';
        
        if (userInfo.timeZone) {
            extraInfoHTML += `
                <div class="data-item">
                    <div class="label">Часовой пояс браузера:</div>
                    <div class="value">${userInfo.timeZone}</div>
                </div>
            `;
        }
        
        if (userInfo.cookiesEnabled !== undefined) {
            extraInfoHTML += `
                <div class="data-item">
                    <div class="label">Куки разрешены:</div>
                    <div class="value">${userInfo.cookiesEnabled ? 'Да' : 'Нет'}</div>
                </div>
            `;
        }
        
        if (userInfo.doNotTrack) {
            extraInfoHTML += `
                <div class="data-item">
                    <div class="label">Do Not Track:</div>
                    <div class="value">${userInfo.doNotTrack === '1' || userInfo.doNotTrack === 'yes' ? 'Включено' : 'Выключено'}</div>
                </div>
            `;
        }
        
        if (userInfo.connectionType) {
            extraInfoHTML += `
                <div class="data-item">
                    <div class="label">Тип соединения:</div>
                    <div class="value">${userInfo.connectionType}</div>
                </div>
            `;
        }
        
        if (userInfo.networkInfo) {
            if (userInfo.networkInfo.effectiveType) {
                extraInfoHTML += `
                    <div class="data-item">
                        <div class="label">Эффективный тип:</div>
                        <div class="value">${userInfo.networkInfo.effectiveType}</div>
                    </div>
                `;
            }
            
            if (userInfo.networkInfo.downlink) {
                extraInfoHTML += `
                    <div class="data-item">
                        <div class="label">Скорость соединения:</div>
                        <div class="value">${userInfo.networkInfo.downlink} Мбит/с</div>
                    </div>
                `;
            }
            
            if (userInfo.networkInfo.rtt) {
                extraInfoHTML += `
                    <div class="data-item">
                        <div class="label">Задержка сети (RTT):</div>
                        <div class="value">${userInfo.networkInfo.rtt} мс</div>
                    </div>
                `;
            }
            
            if (userInfo.networkInfo.saveData !== undefined) {
                extraInfoHTML += `
                    <div class="data-item">
                        <div class="label">Режим экономии данных:</div>
                        <div class="value">${userInfo.networkInfo.saveData ? 'Включен' : 'Выключен'}</div>
                    </div>
                `;
            }
        }
        
        if (extraInfoHTML) {
            extraInfoSection.innerHTML = extraInfoHTML;
            networkCard.appendChild(extraInfoSection);
        }
    }
}

// Отображение сводной информации о пользователе
function displaySummaryInfo(userInfo) {
    // Меняем класс для блока резюме
    const userSummary = document.querySelector('.user-summary');
    if (userSummary) {
        userSummary.classList.remove('user-summary');
        userSummary.classList.add('admin-summary');
        
        // Добавляем иконки к строкам
        const summaryRows = userSummary.querySelectorAll('.user-summary-row');
        summaryRows.forEach(row => {
            row.classList.remove('user-summary-row');
            row.classList.add('admin-summary-row');
            
            // Добавляем контейнер для иконки
            if (!row.querySelector('.admin-summary-icon')) {
                const iconContainer = document.createElement('div');
                iconContainer.classList.add('admin-summary-icon');
                row.insertBefore(iconContainer, row.firstChild);
            }
        });
        
        // Обновляем классы
        const labels = userSummary.querySelectorAll('.user-summary-label');
        labels.forEach(label => {
            label.classList.remove('user-summary-label');
            label.classList.add('admin-summary-label');
        });
        
        const values = userSummary.querySelectorAll('.user-summary-value');
        values.forEach(value => {
            value.classList.remove('user-summary-value');
            value.classList.add('admin-summary-value');
        });
    }
    
    // Обновляем информацию о пользователе
    if (userInfo.email) {
        const summaryEmail = document.getElementById('summary-email');
        if (summaryEmail) {
            summaryEmail.textContent = userInfo.email;
        }
    }
    
    if (userInfo.time) {
        const summaryTime = document.getElementById('summary-time');
        if (summaryTime) {
            const date = new Date(userInfo.time);
            summaryTime.textContent = formatDate(date);
        }
    }
    
    if (userInfo.ip) {
        const summaryIp = document.getElementById('summary-ip');
        if (summaryIp) {
            summaryIp.textContent = userInfo.ip;
        }
    }
    
    // Добавляем иконки
    const summaryIcons = {
        'summary-email': 'fa-envelope',
        'summary-time': 'fa-clock',
        'summary-ip': 'fa-network-wired'
    };
    
    for (const [id, iconClass] of Object.entries(summaryIcons)) {
        const iconContainer = document.querySelector(`#${id}`).parentNode.querySelector('.admin-summary-icon');
        if (iconContainer) {
            iconContainer.innerHTML = `<i class="fas ${iconClass}"></i>`;
        }
    }
}

// Инициализация карты с Leaflet
function initMap(latitude, longitude, locationType, address, userInfo) {
    // Проверяем наличие доступного элемента карты
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    // Если карта уже инициализирована, удаляем её
    if (window.map) {
        window.map.remove();
    }
    
    // Настраиваем стили маркера в зависимости от типа местоположения
    const markerOptions = {};
    let popupText = 'Местоположение пользователя';
    
    if (locationType === 'accurate') {
        markerOptions.icon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        popupText = '<b>Точное местоположение</b>' + (address ? '<br>' + address : '');
    } else {
        markerOptions.icon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        popupText = '<b>Приблизительное местоположение (по IP)</b>' + (address ? '<br>' + address : '');
    }
    
    // Создаем карту
    window.map = L.map('map').setView([latitude, longitude], 13);
    
    // Добавляем тайлы OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(window.map);
    
    // Добавляем маркер
    L.marker([latitude, longitude], markerOptions).addTo(window.map)
        .bindPopup(popupText)
        .openPopup();
    
    // Если это точное местоположение, добавляем круг точности
    if (locationType === 'accurate' && userInfo.accurateLocation && userInfo.accurateLocation.accuracy) {
        L.circle([latitude, longitude], {
            radius: userInfo.accurateLocation.accuracy,
            color: '#7cac85',
            fillColor: '#7cac85',
            fillOpacity: 0.2
        }).addTo(window.map);
    }
}

// Отображение сообщения об отсутствии данных
function displayNoDataMessage() {
    const elements = [
        'user-email', 'user-password', 'login-time',
        'device-info', 'browser-info', 'os-info', 'screen-info',
        'ip-address', 'location', 'language', 'user-agent', 'referrer',
        'summary-email', 'summary-time', 'summary-ip'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = 'Нет данных';
        }
    });
    
    // Если есть контейнер карты, отображаем сообщение
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.innerHTML = '<div class="no-data">Данных о местоположении нет</div>';
    }
    
    // Отображаем сообщение в списке пользователей
    const usersListElement = document.getElementById('users-list');
    if (usersListElement) {
        usersListElement.innerHTML = '<div class="no-users">Еще нет данных о пользователях</div>';
    }
}

// Форматирование даты полностью
function formatDate(date) {
    if (!(date instanceof Date)) return 'Некорректная дата';
    
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    return date.toLocaleDateString('ru-RU', options);
}

// Форматирование даты в краткой форме
function formatDateShort(date) {
    if (!(date instanceof Date)) return 'Неизвестно';
    
    const options = { 
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return date.toLocaleDateString('ru-RU', options);
} 