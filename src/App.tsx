import { useState } from 'react';
import './App.css';

// --- Type Definitions for TypeScript ---
type Service = 'hospital' | 'nursing-home' | 'visiting-care' | 'day-care';

type FilterCategory = {
  [category: string]: string[];
};

type FilterOptions = {
  [key in Service]: FilterCategory;
};

type MockResult = {
  name: string;
  image: string;
  matchPoint: string;
  review: string;
};

type MockResults = {
  [key in Service]: MockResult[];
};

type Errors = {
  step2?: string;
  location?: string;
  specialNeeds?: string;
};


// --- Data Constants ---
const filterOptions: FilterOptions = {
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

const mockResults: MockResults = {
    hospital: [{ name: '서울 재활 전문 요양병원', image: 'https://via.placeholder.com/300x200', matchPoint: '뇌졸중, 척추 손상 등 중증 질환에 대한 집중 재활 프로그램이 강점입니다.', review: '전문적인 재활 치료 덕분에 상태가 많이 호전되셨어요.' }, { name: '강남 시니어스 요양병원', image: 'https://via.placeholder.com/300x200', matchPoint: '대학병원 출신 전문의가 상주하며, 인공투석실을 운영하고 있습니다.', review: '투석 때문에 걱정이 많았는데, 여기서 편하게 받고 계십니다.' }, { name: '햇살 가득 요양병원', image: 'https://via.placeholder.com/300x200', matchPoint: '호스피스 완화의료 병동을 별도로 운영하여, 존엄하고 편안한 마무리를 돕습니다.', review: '마지막 가시는 길, 따뜻하게 보살펴주셔서 감사합니다.' }],
    'nursing-home': [{ name: '행복한 우리집 요양원', image: 'https://via.placeholder.com/300x200', matchPoint: '보건복지부 A등급 인증, 치매 전담실을 운영하여 전문적인 케어가 가능합니다.', review: '치매가 있으신데도 잘 돌봐주셔서 마음이 놓여요.' }, { name: '도심 속 자연 요양원', image: 'https://via.placeholder.com/300x200', matchPoint: '넓은 정원과 텃밭이 있어 어르신들이 소일거리를 하며 정서적 안정을 찾을 수 있습니다.', review: '답답한 걸 싫어하시는데, 정원이 넓어서 좋아하세요.' }, { name: '늘푸른 실버타운', image: 'https://via.placeholder.com/300x200', matchPoint: '전 세대 1인실 및 2인실로 구성되어 프라이빗한 생활을 보장합니다.', review: '독립적인 공간을 원하셨는데, 1인실이 있어 만족해하십니다.' }],
    'visiting-care': [{ name: '엄마를부탁해 케어(강남)', image: 'https://via.placeholder.com/300x200', matchPoint: '치매 전문 교육을 이수한 10년차 요양보호사가 배정됩니다.', review: '인지능력이 걱정이었는데, 전문 보호사님 덕분에 많이 좋아지셨어요.' }, { name: '따스한 손길 방문요양센터', image: 'https://via.placeholder.com/300x200', matchPoint: '주말, 야간 등 긴급 돌봄 필요시 24시간 대응팀을 운영합니다.', review: '갑자기 일이 생겨도 안심하고 맡길 수 있어서 정말 좋아요.' }, { name: '우리동네 효자손', image: 'https://via.placeholder.com/300x200', matchPoint: '어르신 성향과 필요에 맞춰 남성 또는 여성 보호사 선택이 가능합니다.', review: '아버지께서 남자 보호사님을 더 편하게 생각하셔서 만족스러워요.' }],
    'day-care': [{ name: '해피시니어 주야간보호센터', image: 'https://via.placeholder.com/300x200', matchPoint: '집 앞까지 안전하게 모시는 송영 서비스를 매일 운행합니다.', review: '매일 아침저녁으로 편하게 오가실 수 있어서 좋습니다.' }, { name: '기억튼튼 인지학교', image: 'https://via.placeholder.com/300x200', matchPoint: '대학과 연계한 전문 인지 프로그램을 운영하여 치매 예방에 효과적입니다.', review: '다양한 프로그램 덕분에 하루를 즐겁게 보내고 오세요.' }, { name: '활력충전소 물리치료실', image: 'https://via.placeholder.com/300x200', matchPoint: '전문 물리치료사가 상주하며, 최신 장비를 이용한 재활 운동을 돕습니다.', review: '물리치료 받고 오신 날은 컨디션이 훨씬 좋아 보이세요.' }]
};

function App() {
    const [step, setStep] = useState<number>(1);
    const [selectedService, setSelectedService] = useState<Service | '' >('');
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [location, setLocation] = useState<string>('');
    const [budget, setBudget] = useState<number>(2750000);
    const [specialNeeds, setSpecialNeeds] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({});

    const handleCardClick = (service: Service) => {
        setSelectedService(service);
        setSelectedFilters([]);
        setErrors({});
        setStep(2);
    };

    const handleFilterClick = (filter: string) => {
        setSelectedFilters(prev => 
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    const handleNextStep2 = () => {
        if (selectedFilters.length === 0) {
            setErrors({ step2: '가장 중요하게 생각하는 가치를 1개 이상 선택해주세요.' });
        } else {
            setErrors({});
            setStep(3);
        }
    };

    const handleNextStep3 = () => {
        const newErrors: Errors = {};
        if (!location) newErrors.location = '어디와 가까운 곳을 찾으시나요?';
        if (!specialNeeds) newErrors.specialNeeds = '특별히 고려해야 할 생활 습관이 있으신가요?';
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setErrors({});
            setStep(4);
        }
    };

    const handleRestart = () => {
        setStep(1);
        setSelectedService('');
        setSelectedFilters([]);
        setLocation('');
        setBudget(2750000);
        setSpecialNeeds('');
        setErrors({});
    };

    const renderFilters = () => {
        if (!selectedService) return null;
        const serviceCategories = filterOptions[selectedService];

        return Object.entries(serviceCategories).map(([category, options]) => (
            <div key={category} className="filter-category">
                <h4 className="filter-category-title">{category}</h4>
                <div className="filter-options-wrapper">
                    {options.map(option => (
                        <div 
                            key={option} 
                            className={`filter-option ${selectedFilters.includes(option) ? 'selected' : ''}`}
                            onClick={() => handleFilterClick(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        ));
    };

    const renderResults = () => {
        if (!selectedService) return null;
        const resultsForService = mockResults[selectedService];
        const userName = "어머님";
        const matchPercentage = 90 + Math.floor(Math.random() * 9);
        let dynamicMatchPoint = selectedFilters.length > 0 ? `특히 중요하게 생각하신 '${selectedFilters.join(', ')}' 조건에 잘 맞아요.` : "";

        return (
            <>
                <h1 className="match-copy">{`${userName}의 조건에 ${matchPercentage}% 일치하는 '최적의 시설' 3곳을 찾았습니다.`}</h1>
                <div className="result-container">
                    {resultsForService.map((result, index) => {
                        const finalMatchPoint = (index === 0 && dynamicMatchPoint) ? dynamicMatchPoint : result.matchPoint;
                        return (
                            <div className="result-card" key={result.name}>
                                <img src={result.image} alt={result.name} />
                                <div className="result-card-info">
                                    <h3>{index + 1}. {result.name}</h3>
                                    <p className="match-point">{finalMatchPoint}</p>
                                    <p className="review-summary">💬 "{result.review}"</p>
                                    <div className="result-card-actions">
                                        <button>📞 전화 상담하기</button>
                                        <button>📅 방문 예약 신청</button>
                                        <button>📄 상세 정보 더보기</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    return (
        <div className="container">
            {step === 1 && (
                <div id="step1" className="step">
                    <h1 className="main-copy">
                        <span className="main-line">엄마를 부탁해</span>
                    </h1>
                    <p className="sub-copy">어떤 돌봄이 필요하신가요?</p>
                    <div className="card-container">
                        <div className="card" onClick={() => handleCardClick('hospital')}><h3>요양병원</h3><p>전문의의 치료와 재활</p></div>
                        <div className="card" onClick={() => handleCardClick('nursing-home')}><h3>요양원</h3><p>집처럼 편안한 생활</p></div>
                        <div className="card" onClick={() => handleCardClick('visiting-care')}><h3>방문요양</h3><p>익숙한 집에서 받는 돌봄</p></div>
                        <div className="card" onClick={() => handleCardClick('day-care')}><h3>주야간보호</h3><p>즐거운 낮 시간 활동</p></div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div id="step2" className="step">
                    <h2 className="step-title">가장 중요하게 생각하는<br/>가치를 선택해주세요.</h2>
                    <div id="filters">{renderFilters()}</div>
                    {errors.step2 && <p className="error-message">{errors.step2}</p>}
                    <div className="button-group">
                        <button className="back-btn" onClick={() => setStep(1)}>이전</button>
                        <button className="next-btn" onClick={handleNextStep2}>다음</button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div id="step3" className="step">
                    <h2 className="step-title">현실적인 조건을 설정해주세요.</h2>
                    <div className="form-group">
                        <label htmlFor="location">어디와 가까운 곳을 찾으시나요?</label>
                        <input type="text" id="location" placeholder="예: 서울시 강남구" value={location} onChange={e => setLocation(e.target.value)} />
                        {errors.location && <p className="error-message">{errors.location}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="budget">월 예상 비용은 어느 정도 생각하시나요?</label>
                        <input type="range" id="budget" min="500000" max="5000000" step="100000" value={budget} onChange={e => setBudget(Number(e.target.value))} />
                        <span id="budget-value">{budget.toLocaleString()}원</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="special-needs">특별히 고려해야 할 생활 습관이 있으신가요?</label>
                        <input type="text" id="special-needs" placeholder="예: 기독교, 당뇨식" value={specialNeeds} onChange={e => setSpecialNeeds(e.target.value)} />
                        {errors.specialNeeds && <p className="error-message">{errors.specialNeeds}</p>}
                    </div>
                    <div className="button-group">
                        <button className="back-btn" onClick={() => setStep(2)}>이전</button>
                        <button className="next-btn" onClick={handleNextStep3}>결과 보기</button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div id="step4" className="step">
                    {renderResults()}
                    <div className="button-group">
                        <button className="restart-btn" onClick={handleRestart}>처음으로</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
