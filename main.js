document.addEventListener('DOMContentLoaded', () => {
    const steps = {
        step1: document.getElementById('step1'),
        step2: document.getElementById('step2'),
        step3: document.getElementById('step3'),
        step4: document.getElementById('step4'),
    };

    const errorMessages = {
        step2: document.getElementById('step2-error'),
        location: document.getElementById('location-error'),
        specialNeeds: document.getElementById('special-needs-error'),
    };

    let selectedService = '';
    let selectedFilters = [];

    const showStep = (stepId) => {
        Object.values(steps).forEach(step => step.style.display = 'none');
        steps[stepId].style.display = 'block';
    };

    const clearErrorMessages = () => {
        Object.values(errorMessages).forEach(error => error.textContent = '');
    }

    // --- Step 1: Service Selection ---
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            selectedService = card.dataset.service;
            selectedFilters = []; // Reset filters when a new service is selected
            populateFilters(selectedService);
            clearErrorMessages();
            showStep('step2');
        });
    });

    // --- Step 2: Custom Filter ---
    const filtersContainer = document.getElementById('filters');
    const filterOptions = {
        hospital: {
            '의료 서비스': ['집중 재활치료 (뇌졸중, 파킨슨 등)', '인공 신장 투석', '호스피스 완화의료', '암 요양 전문', '대학병원 신속 협진'],
            '진료 과목': ['재활의학과 전문의 상주', '신경과 전문의 상주', '가정의학과 전문의 상주'],
            '시설 및 환경': ['1인실 / 2인실 보유', '신축 또는 리모델링', '도심 위치 (뛰어난 접근성)', '자연 친화 환경 (산, 공원 인접)']
        },
        'nursing-home': {
            '케어 전문성': ['치매 전담실 운영', '와상환자 케어 전문', '야간 상주 인력 많음', '국민건강보험공단 A등급'],
            '프로그램 및 활동': ['다양한 인지/신체 프로그램', '종교 활동 지원 (기독교, 불교, 천주교)', '텃밭 가꾸기 등 소일거리'],
            '생활 환경': ['단독 건물 (넓은 정원)', '1인실 보유', '부부 동반 입소 가능', '송영(셔틀) 서비스']
        },
        'visiting-care': {
            '보호사 전문성': ['치매 전문 교육 이수자', '10년 이상 장기 경력자', '남성/여성 보호사 선택', '특정 질환(예: 파킨슨) 케어 경험'],
            '서비스 범위': ['가사 지원 중심', '병원 동행 적극 지원', '주말/야간 케어 가능', '단기/긴급 돌봄 가능'],
            '매칭 조건': ['운전 가능 보호사', '반려동물 케어 가능']
        },
        'day-care': {
            '핵심 서비스': ['송영(셔틀) 서비스 (집 앞까지)', '야간 연장 운영', '주말 운영', '고품질 식사 및 간식 제공'],
            '전문 프로그램': ['전문 물리치료사 상주', '대학 연계 인지 강화 프로그램', '미술/음악 치료'],
            '시설 및 환경': ['넓고 쾌적한 시설', '최신 재활/운동 장비 보유', '전용 쉼터 또는 수면실']
        }
    };

    function populateFilters(service) {
        filtersContainer.innerHTML = '';
        const serviceCategories = filterOptions[service];
        for (const category in serviceCategories) {
            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('filter-category');

            const categoryTitle = document.createElement('h4');
            categoryTitle.classList.add('filter-category-title');
            categoryTitle.textContent = category;
            categoryContainer.appendChild(categoryTitle);

            const optionsWrapper = document.createElement('div');
            optionsWrapper.classList.add('filter-options-wrapper');

            serviceCategories[category].forEach(option => {
                const filterElement = document.createElement('div');
                filterElement.classList.add('filter-option');
                filterElement.textContent = option;
                filterElement.dataset.value = option;
                if (selectedFilters.includes(option)) {
                    filterElement.classList.add('selected');
                }
                optionsWrapper.appendChild(filterElement);
            });

            categoryContainer.appendChild(optionsWrapper);
            filtersContainer.appendChild(categoryContainer);
        }
    }

    filtersContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-option')) {
            e.target.classList.toggle('selected');
            const value = e.target.dataset.value;
            if (selectedFilters.includes(value)) {
                selectedFilters = selectedFilters.filter(item => item !== value);
            } else {
                selectedFilters.push(value);
            }
        }
    });

    document.querySelector('#step2 .next-btn').addEventListener('click', () => {
        clearErrorMessages();
        if (selectedFilters.length === 0) {
            errorMessages.step2.textContent = '가장 중요하게 생각하는 가치를 1개 이상 선택해주세요.';
        } else {
            showStep('step3');
        }
    });
    document.querySelector('#step2 .back-btn').addEventListener('click', () => {
        clearErrorMessages();
        showStep('step1');
    });

    // --- Step 3: Common Items ---
    const budgetSlider = document.getElementById('budget');
    const budgetValue = document.getElementById('budget-value');

    budgetSlider.addEventListener('input', () => {
        budgetValue.textContent = `${parseInt(budgetSlider.value).toLocaleString()}원`;
    });

    document.querySelector('#step3 .next-btn').addEventListener('click', () => {
        clearErrorMessages();
        const location = document.getElementById('location').value;
        const specialNeeds = document.getElementById('special-needs').value;
        let isValid = true;
        if (!location) {
            errorMessages.location.textContent = '어디와 가까운 곳을 찾으시나요?';
            isValid = false;
        }
        if (!specialNeeds) {
            errorMessages.specialNeeds.textContent = '특별히 고려해야 할 생활 습관이 있으신가요?';
            isValid = false;
        }
        
        if (isValid) {
            generateResults();
            showStep('step4');
        }
    });
    document.querySelector('#step3 .back-btn').addEventListener('click', () => {
        clearErrorMessages();
        showStep('step2');
    });

    // --- Step 4: Results ---
    function generateResults() {
        const resultContainer = document.querySelector('.result-container');
        resultContainer.innerHTML = ''; 

        const userName = "어머님";
        const matchPercentage = 90 + Math.floor(Math.random() * 9);
        document.querySelector('#step4 .match-copy').textContent = `${userName}의 조건에 ${matchPercentage}% 일치하는 '최적의 시설' 3곳을 찾았습니다.`;

        const mockResults = {
            hospital: [{ name: '서울 재활 전문 요양병원', image: 'https://via.placeholder.com/480x150?text=Image', matchPoint: '뇌졸중, 척추 손상 등 중증 질환에 대한 집중 재활 프로그램이 강점입니다.', review: '전문적인 재활 치료 덕분에 상태가 많이 호전되셨어요.' }, { name: '강남 시니어스 요양병원', image: 'https://via.placeholder.com/480x150?text=Image', matchPoint: '대학병원 출신 전문의가 상주하며, 인공투석실을 운영하고 있습니다.', review: '투석 때문에 걱정이 많았는데, 여기서 편하게 받고 계십니다.' }, { name: '햇살 가득 요양병원', image: 'https://via.placeholder.com/480x150?text=Image', matchPoint: '호스피스 완화의료 병동을 별도로 운영하여, 존엄하고 편안한 마무리를 돕습니다.', review: '마지막 가시는 길, 따뜻하게 보살펴주셔서 감사합니다.' }],
            'nursing-home': [{ name: '행복한 우리집 요양원', image: 'https://via.placeholder.com/480x150?text=Image', matchPoint: '보건복지부 A등급 인증, 치매 전담실을 운영하여 전문적인 케어가 가능합니다.', review: '치매가 있으신데도 잘 돌봐주셔서 마음이 놓여요.' }, { name: '도심 속 자연 요양원', image: 'https://via.placeholder.com/480x150?text=Image', matchPoint: '넓은 정원과 텃밭이 있어 어르신들이 소일거리를 하며 정서적 안정을 찾을 수 있습니다.', review: '답답한 걸 싫어하시는데, 정원이 넓어서 좋아하세요.' }, { name: '늘푸른 실버타운', image: 'https://via.placeholder.com/480x150?text=Image', matchPoint: '전 세대 1인실 및 2인실로 구성되어 프라이빗한 생활을 보장합니다.', review: '독립적인 공간을 원하셨는데, 1인실이 있어 만족해하십니다.' }],
            'visiting-care': [{ name: '엄마를부탁해 케어(강남)', image: 'https://via.placeholder.com/480x150?text=Image', matchPoint: '치매 전문 교육을 이수한 10년차 요양보호사가 배정됩니다.', review: '인지능력이 걱정이었는데, 전문 보호사님 덕분에 많이 좋아지셨어요.' }, { name: '따스한 손길 방문요양센터', image: 'https://via.placeholder.com/480x150?text=Image', matchPoint: '주말, 야간 등 긴급 돌봄 필요시 24시간 대응팀을 운영합니다.', review: '갑자기 일이 생겨도 안심하고 맡길 수 있어서 정말 좋아요.' }, { name: '우리동네 효자손', image: 'https://via.placeholder.com/480x150?text=Image', matchPoint: '어르신 성향과 필요에 맞춰 남성 또는 여성 보호사 선택이 가능합니다.', review: '아버지께서 남자 보호사님을 더 편하게 생각하셔서 만족스러워요.' }],
            'day-care': [{ name: '해피시니어 주야간보호센터', image: 'https://via.placeholder.com/480x150?text=Image', matchPoint: '집 앞까지 안전하게 모시는 송영 서비스를 매일 운행합니다.', review: '매일 아침저녁으로 편하게 오가실 수 있어서 좋습니다.' }, { name: '기억튼튼 인지학교', image: 'https://via.placeholder.com/480x150?text=Image', matchPoint: '대학과 연계한 전문 인지 프로그램을 운영하여 치매 예방에 효과적입니다.', review: '다양한 프로그램 덕분에 하루를 즐겁게 보내고 오세요.' }, { name: '활력충전소 물리치료실', image: 'https://via.placeholder.com/480x150?text=Image', matchPoint: '전문 물리치료사가 상주하며, 최신 장비를 이용한 재활 운동을 돕습니다.', review: '물리치료 받고 오신 날은 컨디션이 훨씬 좋아 보이세요.' }]
        };

        const resultsForService = mockResults[selectedService] || [];
        let dynamicMatchPoint = selectedFilters.length > 0 ? `특히 중요하게 생각하신 '${selectedFilters.join(', ')}' 조건에 잘 맞아요.` : "";

        resultsForService.forEach((result, index) => {
            const finalMatchPoint = (index === 0 && dynamicMatchPoint) ? dynamicMatchPoint : result.matchPoint;
            const resultCard = `
                <div class="result-card">
                    <img src="${result.image}" alt="${result.name}">
                    <div class="result-card-info">
                        <h3>${index + 1}. ${result.name}</h3>
                        <p class="match-point">${finalMatchPoint}</p>
                        <p class="review-summary">💬 "${result.review}"</p>
                        <div class="result-card-actions">
                            <button>📞 전화 상담하기</button>
                            <button>📅 방문 예약 신청</button>
                            <button>📄 상세 정보 더보기</button>
                        </div>
                    </div>
                </div>`;
            resultContainer.innerHTML += resultCard;
        });
    }

    document.querySelector('.restart-btn').addEventListener('click', () => {
        selectedService = '';
        selectedFilters = [];
        document.getElementById('location').value = '';
        document.getElementById('special-needs').value = '';
        budgetSlider.value = 2750000;
        budgetValue.textContent = '2,750,000원';
        clearErrorMessages();
        showStep('step1');
    });

    // Initial state
    showStep('step1');
});