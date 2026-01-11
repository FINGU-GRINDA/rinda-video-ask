'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Video,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  X,
  MessageSquare,
  Phone,
  Send,
  Bot,
  Volume2,
  VolumeX,
  Settings,
  Clock,
  MousePointerClick,
  Building2,
  GraduationCap,
  ShoppingBag,
  Stethoscope,
  Briefcase,
  Home,
  Plane,
  Dumbbell,
  ChevronRight,
  Scroll,
  Link as LinkIcon,
  Zap,
  ArrowUpRight,
  Check,
  Star,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  Heart,
  Shield,
  Award,
  Target,
  Timer,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type WidgetMode = 'video' | 'chat' | 'calendar'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type TriggerCondition = {
  id: string
  type: 'time' | 'scroll' | 'exit' | 'url' | 'idle'
  label: string
  description: string
  icon: typeof Clock
  value?: number | string
  enabled: boolean
}

type Industry = {
  id: string
  name: string
  icon: typeof Building2
  color: string
  gradient: string
  scenarios: Scenario[]
}

type Scenario = {
  id: string
  name: string
  description: string
  pageTitle: string
  pageUrl: string
  welcomeMessage: string
  videoTitle: string
  videoSubtitle: string
  triggers: string[]
  aiResponses: Record<string, string>
}

// 산업군별 시나리오 정의
const INDUSTRIES: Industry[] = [
  {
    id: 'saas',
    name: 'SaaS / IT 서비스',
    icon: Briefcase,
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-cyan-500',
    scenarios: [
      {
        id: 'saas-pricing',
        name: '요금제 페이지 체류',
        description: '가격 페이지에서 15초 이상 체류 시',
        pageTitle: 'Pricing - 합리적인 요금제',
        pageUrl: 'app.yourservice.com/pricing',
        welcomeMessage: '안녕하세요! 요금제를 살펴보고 계시네요 😊\n\n어떤 기능이 가장 필요하신가요? 팀 규모에 맞는 플랜을 추천해드릴게요!',
        videoTitle: '요금제 상담',
        videoSubtitle: '최적의 플랜을 찾아드려요',
        triggers: ['time', 'scroll'],
        aiResponses: {
          '가격': '저희 요금제를 안내해드릴게요!\n\n• Starter: 월 39,000원 (5명까지)\n• Growth: 월 99,000원 (20명까지)\n• Enterprise: 맞춤 견적\n\n연간 결제 시 20% 할인됩니다!',
          '무료': '14일 무료 체험을 제공해요! 모든 기능을 제한 없이 사용해보실 수 있고, 신용카드 등록 없이 시작하실 수 있습니다 😊',
          '기능': '주요 기능을 안내해드릴게요!\n\n✅ 실시간 협업 대시보드\n✅ 자동화 워크플로우\n✅ API 연동 지원\n✅ 24시간 고객 지원\n\n어떤 기능이 가장 관심 있으세요?',
          '할인': '연간 결제 시 20% 할인을 적용받으실 수 있어요. 스타트업이시라면 추가 할인 프로그램도 있으니 문의해주세요!',
          '비교': '경쟁사 대비 장점을 말씀드릴게요:\n\n1. 50% 더 빠른 처리 속도\n2. 무제한 API 호출\n3. 한국어 24시간 지원\n4. 데이터 국내 보관',
        },
      },
      {
        id: 'saas-trial-end',
        name: '무료 체험 종료 임박',
        description: '체험 기간 마지막 3일 방문 시',
        pageTitle: '대시보드 - 체험 기간 3일 남음',
        pageUrl: 'app.yourservice.com/dashboard',
        welcomeMessage: '체험 기간이 곧 끝나네요! 😊\n\n지금까지 사용해보시면서 어떠셨나요? 유료 전환 시 특별 혜택을 안내해드릴까요?',
        videoTitle: '특별 혜택 안내',
        videoSubtitle: '체험 종료 전 확인하세요',
        triggers: ['url', 'time'],
        aiResponses: {
          '혜택': '체험 기간 내 전환 시 특별 혜택을 드려요!\n\n🎁 첫 3개월 30% 할인\n🎁 온보딩 1:1 미팅 제공\n🎁 추가 사용자 2명 무료\n\n지금 바로 적용해드릴까요?',
          '연장': '체험 기간 연장이 필요하시면 말씀해주세요! 팀 검토가 더 필요하시다면 7일 추가 연장해드릴 수 있어요.',
          '문의': '궁금하신 점이 있으시면 편하게 물어봐주세요. 전화 상담을 원하시면 010-6326-9009로 연락주셔도 됩니다!',
        },
      },
    ],
  },
  {
    id: 'realestate',
    name: '부동산 / 인테리어',
    icon: Home,
    color: 'text-emerald-600',
    gradient: 'from-emerald-500 to-teal-500',
    scenarios: [
      {
        id: 'realestate-listing',
        name: '매물 상세 페이지',
        description: '매물 페이지에서 20초 이상 체류 시',
        pageTitle: '강남역 초역세권 오피스텔',
        pageUrl: 'realestate.com/listing/gangnam-officetel',
        welcomeMessage: '안녕하세요! 이 매물에 관심 가져주셨네요 😊\n\n내부 실사 영상이나 추가 정보가 필요하시면 말씀해주세요. 방문 예약도 바로 잡아드릴 수 있어요!',
        videoTitle: '매물 상담',
        videoSubtitle: '궁금한 점을 물어보세요',
        triggers: ['time', 'scroll'],
        aiResponses: {
          '방문': '방문 일정을 잡아드릴게요! 원하시는 날짜와 시간을 말씀해주시면 바로 예약해드려요. 주말 방문도 가능합니다 😊',
          '가격': '현재 보증금 1억/월세 150만원이에요. 협상 가능 여부는 직접 확인해드릴 수 있어요. 연락처 남겨주시면 바로 확인 후 연락드릴게요!',
          '주변': '주변 정보를 안내해드릴게요!\n\n🚇 강남역 도보 3분\n🏪 편의시설 도보권 다수\n🏥 강남세브란스 10분\n🏫 학군 우수 지역\n\n더 궁금한 점 있으세요?',
          '계약': '계약 절차를 안내해드릴게요:\n\n1. 방문 및 매물 확인\n2. 조건 협의\n3. 계약금 입금\n4. 잔금 및 입주\n\n중개수수료는 0.4%입니다.',
        },
      },
      {
        id: 'realestate-exit',
        name: '이탈 시도 감지',
        description: '페이지 이탈 시도 시',
        pageTitle: '매물 검색 결과 - 강남구',
        pageUrl: 'realestate.com/search?area=gangnam',
        welcomeMessage: '잠깐만요! 원하시는 매물을 못 찾으셨나요?\n\n조건을 말씀해주시면 맞춤 매물을 찾아드릴게요. 비공개 매물도 안내해드릴 수 있어요!',
        videoTitle: '맞춤 매물 찾기',
        videoSubtitle: '원하시는 조건을 알려주세요',
        triggers: ['exit'],
        aiResponses: {
          '조건': '어떤 조건의 매물을 찾으세요?\n\n📍 선호 지역\n💰 예산 범위\n🏠 매물 유형 (아파트/오피스텔/빌라)\n📐 원하는 평수\n\n편하게 말씀해주세요!',
          '예산': '예산에 맞는 매물을 찾아드릴게요. 보증금과 월세 예산이 어느 정도이신가요? 전세도 가능하시면 말씀해주세요!',
        },
      },
    ],
  },
  {
    id: 'education',
    name: '교육 / 학원',
    icon: GraduationCap,
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-pink-500',
    scenarios: [
      {
        id: 'edu-course',
        name: '강좌 상세 페이지',
        description: '강좌 페이지에서 30초 이상 체류 시',
        pageTitle: '[왕초보] 6개월 완성 영어회화 마스터',
        pageUrl: 'academy.com/course/english-master',
        welcomeMessage: '안녕하세요! 영어회화 과정에 관심 가져주셨네요 😊\n\n수강 상담을 도와드릴까요? 레벨 테스트도 무료로 받아보실 수 있어요!',
        videoTitle: '수강 상담',
        videoSubtitle: '맞춤 커리큘럼을 안내해드려요',
        triggers: ['time', 'scroll'],
        aiResponses: {
          '가격': '수강료를 안내해드릴게요!\n\n• 6개월 과정: 월 198,000원\n• 12개월 과정: 월 149,000원 (25% 할인)\n\n지금 등록 시 교재 무료 + 1:1 코칭 2회 제공해드려요!',
          '레벨': '무료 레벨 테스트를 받아보세요! 10분 정도 소요되고, 결과에 따라 맞춤 반을 추천해드려요. 바로 예약해드릴까요?',
          '시간': '수업 시간표를 안내해드릴게요:\n\n🌅 오전반: 10:00 - 12:00\n☀️ 오후반: 14:00 - 16:00\n🌙 저녁반: 19:00 - 21:00\n💻 온라인: 자유 수강\n\n어떤 시간이 편하세요?',
          '환불': '수강 시작 후 7일 이내 100% 환불, 30일 이내 50% 환불 가능해요. 수업에 만족 못하시면 언제든 말씀해주세요!',
        },
      },
      {
        id: 'edu-compare',
        name: '경쟁사 비교 검색',
        description: '"비교", "후기" 등 검색 후 방문 시',
        pageTitle: '수강생 후기 - 실제 수강생의 솔직한 이야기',
        pageUrl: 'academy.com/reviews',
        welcomeMessage: '후기를 살펴보고 계시네요! 👀\n\n다른 학원과 고민 중이시라면, 저희만의 차별점을 직접 설명해드릴까요? 무료 체험 수업도 가능해요!',
        videoTitle: '차별점 안내',
        videoSubtitle: '왜 저희를 선택해야 할까요?',
        triggers: ['url', 'time'],
        aiResponses: {
          '차별': '저희 학원의 차별점을 말씀드릴게요!\n\n1️⃣ 원어민 + 한국인 강사 듀얼 티칭\n2️⃣ 1:4 소수정예 회화 수업\n3️⃣ 출석률 90% 시 수강료 10% 환급\n4️⃣ 수업 영상 무제한 복습\n\n체험 수업 한번 들어보실래요?',
          '후기': '최근 수강생 후기를 보여드릴게요:\n\n⭐⭐⭐⭐⭐ "3개월 만에 영어 울렁증 극복!"\n⭐⭐⭐⭐⭐ "원어민 친구랑 대화 가능해졌어요"\n⭐⭐⭐⭐ "직장인도 다니기 편해요"\n\n평균 만족도 4.8점입니다!',
        },
      },
    ],
  },
  {
    id: 'ecommerce',
    name: '이커머스 / 쇼핑몰',
    icon: ShoppingBag,
    color: 'text-orange-600',
    gradient: 'from-orange-500 to-red-500',
    scenarios: [
      {
        id: 'ecom-cart',
        name: '장바구니 이탈',
        description: '장바구니에서 이탈 시도 시',
        pageTitle: '장바구니 - 결제를 완료해주세요',
        pageUrl: 'shop.com/cart',
        welcomeMessage: '결제를 망설이고 계신가요? 🤔\n\n혹시 배송이나 사이즈가 걱정되시면 바로 답변드릴게요! 지금 구매하시면 특별 할인도 적용해드려요.',
        videoTitle: '결제 도움',
        videoSubtitle: '궁금한 점을 해결해드려요',
        triggers: ['exit', 'idle'],
        aiResponses: {
          '배송': '배송 정보를 안내해드릴게요!\n\n🚚 일반배송: 2-3일 소요 (무료)\n⚡ 당일배송: 오후 2시 전 주문 시 (3,000원)\n📦 새벽배송: 밤 11시 전 주문 시 (4,000원)\n\n5만원 이상 구매 시 무료배송이에요!',
          '사이즈': '사이즈 선택이 고민되시나요? 제품 상세 페이지에 실측 사이즈가 있어요. 평소 입으시는 사이즈를 알려주시면 추천해드릴게요!',
          '환불': '교환/환불 정책 안내해드릴게요:\n\n✅ 수령 후 7일 이내 무료 반품\n✅ 하자 상품 100% 교환/환불\n✅ 반품비 무료 (하자 시)\n\n편하게 구매하세요!',
          '할인': '지금 결제하시면 특별 할인을 적용해드릴 수 있어요! 쿠폰 코드를 안내해드릴까요? 😊',
          '재고': '재고 확인해드릴게요! 어떤 상품, 어떤 옵션이 궁금하세요?',
        },
      },
      {
        id: 'ecom-product',
        name: '상품 상세 체류',
        description: '같은 상품을 2회 이상 조회 시',
        pageTitle: '프리미엄 무선 이어폰 - ★4.9',
        pageUrl: 'shop.com/product/wireless-earbuds',
        welcomeMessage: '이 상품이 마음에 드셨나요? 👀\n\n재방문해주셨네요! 궁금한 점이 있으시면 바로 답변드릴게요. 지금 구매하시면 특별 혜택도 있어요!',
        videoTitle: '상품 상담',
        videoSubtitle: '궁금한 점을 물어보세요',
        triggers: ['url', 'time'],
        aiResponses: {
          '스펙': '제품 스펙을 안내해드릴게요!\n\n🎵 노이즈 캔슬링: ANC 지원\n🔋 배터리: 최대 30시간\n💧 방수: IPX5 등급\n📱 호환: iOS/Android 모두 가능\n\n더 궁금한 점 있으세요?',
          '후기': '구매자 후기 요약해드릴게요:\n\n👍 장점: 음질 최고, 착용감 편함\n👎 단점: 케이스 약간 큼\n\n평균 별점 4.9점으로 매우 만족도 높아요!',
          '비교': '경쟁 제품과 비교해드릴까요? 어떤 제품이랑 비교가 필요하세요?',
        },
      },
    ],
  },
  {
    id: 'healthcare',
    name: '의료 / 헬스케어',
    icon: Stethoscope,
    color: 'text-rose-600',
    gradient: 'from-rose-500 to-pink-500',
    scenarios: [
      {
        id: 'health-booking',
        name: '예약 페이지 체류',
        description: '예약 페이지에서 10초 이상 체류 시',
        pageTitle: '진료 예약 - 피부과 전문의 상담',
        pageUrl: 'clinic.com/booking/dermatology',
        welcomeMessage: '예약을 도와드릴까요? 😊\n\n원하시는 날짜와 시간을 말씀해주시면 바로 확인해드려요. 어떤 고민으로 방문하시는지 여쭤봐도 될까요?',
        videoTitle: '예약 상담',
        videoSubtitle: '편하게 문의하세요',
        triggers: ['time'],
        aiResponses: {
          '예약': '예약 가능한 시간을 확인해드릴게요! 원하시는 날짜가 있으신가요? 평일/주말 선호도 말씀해주세요 😊',
          '비용': '진료 비용을 안내해드릴게요:\n\n• 초진 상담: 15,000원\n• 재진 상담: 10,000원\n• 시술비는 별도\n\n건강보험 적용 항목도 있어요!',
          '시간': '진료 시간 안내해드릴게요:\n\n🕐 평일: 09:00 - 18:00\n🕐 토요일: 09:00 - 13:00\n🚫 일요일/공휴일: 휴진\n\n점심시간 12:30-14:00',
          '주차': '건물 내 무료 주차 가능해요! 2시간까지 무료이고, 초과 시 30분당 1,000원입니다.',
        },
      },
      {
        id: 'health-symptom',
        name: '증상 검색 후 방문',
        description: '"증상", "치료" 등 검색 후 방문 시',
        pageTitle: '여드름 치료 - 원인부터 치료까지',
        pageUrl: 'clinic.com/treatment/acne',
        welcomeMessage: '피부 고민이 있으시군요! 😊\n\n증상에 대해 간단히 상담해드릴 수 있어요. 어떤 부분이 가장 고민이세요?',
        videoTitle: '증상 상담',
        videoSubtitle: '전문의가 답변드려요',
        triggers: ['url', 'scroll'],
        aiResponses: {
          '치료': '치료 방법을 안내해드릴게요:\n\n1️⃣ 약물 치료 (경구/외용)\n2️⃣ 스케일링/압출\n3️⃣ 레이저 치료\n4️⃣ 관리 프로그램\n\n정확한 진단 후 맞춤 치료를 받으시는 게 좋아요!',
          '비용': '치료 비용은 증상과 치료 방법에 따라 달라요. 정확한 비용은 상담 후 안내드릴 수 있어요. 예약해드릴까요?',
          '기간': '치료 기간은 개인마다 달라요. 보통 3-6개월 정도 꾸준한 관리가 필요해요. 자세한 건 상담 시 안내드릴게요!',
        },
      },
    ],
  },
  {
    id: 'travel',
    name: '여행 / 숙박',
    icon: Plane,
    color: 'text-sky-600',
    gradient: 'from-sky-500 to-blue-500',
    scenarios: [
      {
        id: 'travel-search',
        name: '여행 상품 검색',
        description: '검색 결과 페이지에서 스크롤 시',
        pageTitle: '제주도 3박4일 패키지 - 베스트 상품',
        pageUrl: 'travel.com/search?dest=jeju',
        welcomeMessage: '제주도 여행을 계획하고 계시네요! ✈️\n\n인원, 일정, 예산을 알려주시면 딱 맞는 상품을 추천해드릴게요!',
        videoTitle: '여행 상담',
        videoSubtitle: '맞춤 여행을 찾아드려요',
        triggers: ['scroll', 'time'],
        aiResponses: {
          '추천': '인기 상품을 추천해드릴게요!\n\n🏆 1위: 럭셔리 호텔 3박4일 (599,000원~)\n🥈 2위: 가족 펜션 패키지 (399,000원~)\n🥉 3위: 렌터카 자유여행 (299,000원~)\n\n어떤 스타일을 선호하세요?',
          '가격': '예산이 어느 정도이세요? 맞춤 상품을 찾아드릴게요!\n\n💰 30만원대: 알뜰 자유여행\n💰 50만원대: 호텔 패키지\n💰 70만원대: 럭셔리 풀빌라',
          '일정': '여행 일정이 언제인가요? 성수기/비수기에 따라 가격이 달라요. 날짜를 알려주시면 정확한 견적을 알려드릴게요!',
        },
      },
    ],
  },
  {
    id: 'fitness',
    name: '피트니스 / 스포츠',
    icon: Dumbbell,
    color: 'text-lime-600',
    gradient: 'from-lime-500 to-green-500',
    scenarios: [
      {
        id: 'fitness-membership',
        name: '회원권 페이지',
        description: '회원권 페이지에서 15초 이상 체류 시',
        pageTitle: '회원권 안내 - 당신의 건강한 시작',
        pageUrl: 'gym.com/membership',
        welcomeMessage: '운동을 시작하려고 하시나요? 💪\n\n목표와 일정에 맞는 회원권을 추천해드릴게요. 무료 체험도 가능해요!',
        videoTitle: '회원권 상담',
        videoSubtitle: '맞춤 플랜을 찾아드려요',
        triggers: ['time', 'scroll'],
        aiResponses: {
          '가격': '회원권 가격을 안내해드릴게요!\n\n• 1개월: 99,000원\n• 3개월: 249,000원 (17% 할인)\n• 6개월: 449,000원 (25% 할인)\n• 12개월: 799,000원 (33% 할인)\n\nPT도 함께 등록하시면 추가 할인!',
          '체험': '무료 체험 신청 받고 있어요! 1일 무료 이용권과 체형분석, 상담까지 제공해드려요. 언제 방문 가능하세요?',
          '시설': '시설 안내해드릴게요:\n\n🏋️ 최신 웨이트 기구\n🏃 러닝머신 20대\n🧘 GX룸 (요가/필라테스)\n🚿 샤워실/사우나\n🅿️ 무료 주차\n\n투어도 가능해요!',
          'pt': 'PT 프로그램 안내해드릴게요:\n\n• 10회: 550,000원\n• 20회: 990,000원 (10% 할인)\n• 30회: 1,350,000원 (15% 할인)\n\n전문 트레이너가 1:1로 관리해드려요!',
        },
      },
    ],
  },
]

// 고급 트리거 조건 정의
const TRIGGER_CONDITIONS: TriggerCondition[] = [
  {
    id: 'time',
    type: 'time',
    label: '체류 시간',
    description: '페이지에 일정 시간 이상 머무를 때',
    icon: Clock,
    value: 15,
    enabled: true,
  },
  {
    id: 'scroll',
    type: 'scroll',
    label: '스크롤 깊이',
    description: '페이지를 일정 % 이상 스크롤할 때',
    icon: Scroll,
    value: 50,
    enabled: false,
  },
  {
    id: 'exit',
    type: 'exit',
    label: '이탈 감지',
    description: '마우스가 브라우저를 벗어나려 할 때',
    icon: MousePointerClick,
    value: undefined,
    enabled: false,
  },
  {
    id: 'url',
    type: 'url',
    label: 'URL 패턴',
    description: '특정 URL 패턴과 일치할 때',
    icon: LinkIcon,
    value: '/pricing',
    enabled: false,
  },
  {
    id: 'idle',
    type: 'idle',
    label: '비활성 감지',
    description: '사용자가 일정 시간 동안 움직임이 없을 때',
    icon: Timer,
    value: 30,
    enabled: false,
  },
]

export default function DemoPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('saas')
  const [selectedScenario, setSelectedScenario] = useState<string>('saas-pricing')
  const [showWidget, setShowWidget] = useState(false)
  const [widgetMode, setWidgetMode] = useState<WidgetMode>('video')
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTriggerConfig, setShowTriggerConfig] = useState(false)
  const [timeOnPage, setTimeOnPage] = useState(0)
  const [scrollDepth, setScrollDepth] = useState(0)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [triggerConditions, setTriggerConditions] = useState<TriggerCondition[]>(TRIGGER_CONDITIONS)
  // Calendar state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookingStep, setBookingStep] = useState<'date' | 'time' | 'form' | 'success'>('date')
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', message: '' })
  const chatEndRef = useRef<HTMLDivElement>(null)
  const pageContentRef = useRef<HTMLDivElement>(null)

  const currentIndustry = INDUSTRIES.find(i => i.id === selectedIndustry)!
  const currentScenario = currentIndustry.scenarios.find(s => s.id === selectedScenario) || currentIndustry.scenarios[0]

  // Initialize chat with welcome message when widget shows
  useEffect(() => {
    if (showWidget && chatMessages.length === 0) {
      setChatMessages([{
        id: '1',
        role: 'assistant',
        content: currentScenario.welcomeMessage,
        timestamp: new Date()
      }])
    }
  }, [showWidget, currentScenario.welcomeMessage, chatMessages.length])

  // Time counter
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnPage((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      if (pageContentRef.current) {
        const element = pageContentRef.current
        const scrollTop = element.scrollTop
        const scrollHeight = element.scrollHeight - element.clientHeight
        const depth = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0
        setScrollDepth(depth)
      }
    }

    const element = pageContentRef.current
    if (element) {
      element.addEventListener('scroll', handleScroll)
      return () => element.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Auto-trigger for demo (시간 기반)
  useEffect(() => {
    if (showWidget) return
    if (timeOnPage >= 4) setShowWidget(true)
  }, [timeOnPage, showWidget])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const resetDemo = () => {
    setShowWidget(false)
    setWidgetMode('video')
    setIsPlaying(true)
    setTimeOnPage(0)
    setScrollDepth(0)
    setChatMessages([])
  }

  const handleIndustryChange = (industryId: string) => {
    setSelectedIndustry(industryId)
    const industry = INDUSTRIES.find(i => i.id === industryId)!
    setSelectedScenario(industry.scenarios[0].id)
    resetDemo()
    setShowSettings(false)
  }

  const handleScenarioChange = (scenarioId: string) => {
    setSelectedScenario(scenarioId)
    resetDemo()
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      let response = '네, 말씀 감사합니다! 더 궁금한 점이 있으시면 언제든 물어봐주세요. 전화 상담을 원하시면 010-6326-9009로 연락 주세요 😊'

      const lowerInput = inputMessage.toLowerCase()
      const aiResponses = currentScenario.aiResponses

      for (const [keyword, resp] of Object.entries(aiResponses)) {
        if (lowerInput.includes(keyword)) {
          response = resp
          break
        }
      }

      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }])
      setIsTyping(false)
    }, 1500)
  }

  const handlePhoneCall = () => {
    window.location.href = 'tel:010-6326-9009'
  }

  // Calendar helper functions
  const getNext7Days = () => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push(date)
    }
    return days
  }

  const getTimeSlots = () => {
    const slots: { time: string; available: boolean }[] = []
    for (let hour = 9; hour <= 18; hour++) {
      slots.push({ time: `${hour.toString().padStart(2, '0')}:00`, available: Math.random() > 0.3 })
      if (hour < 18) {
        slots.push({ time: `${hour.toString().padStart(2, '0')}:30`, available: Math.random() > 0.3 })
      }
    }
    return slots
  }

  const formatDateKr = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토']
    return `${date.getMonth() + 1}/${date.getDate()} (${days[date.getDay()]})`
  }

  const handleBookingSubmit = () => {
    if (!selectedDate || !selectedTime || !bookingForm.name || !bookingForm.email) return
    setBookingStep('success')
  }

  const toggleTriggerCondition = (id: string) => {
    setTriggerConditions(prev => prev.map(t =>
      t.id === id ? { ...t, enabled: !t.enabled } : t
    ))
  }

  const updateTriggerValue = (id: string, value: number | string) => {
    setTriggerConditions(prev => prev.map(t =>
      t.id === id ? { ...t, value } : t
    ))
  }

  // Render page content based on scenario
  const renderPageContent = () => {
    const industryId = selectedIndustry
    const scenarioId = selectedScenario

    if (industryId === 'saas') {
      if (scenarioId === 'saas-pricing') {
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Simple, Transparent Pricing</h2>
              <p className="text-slate-500">Start free. Scale as you grow.</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {[
                { name: 'Starter', price: '39,000', users: '5명', features: ['기본 기능', '이메일 지원', '5GB 스토리지'] },
                { name: 'Growth', price: '99,000', users: '20명', features: ['모든 기능', '우선 지원', '50GB 스토리지', 'API 접근'], popular: true },
                { name: 'Enterprise', price: '문의', users: '무제한', features: ['커스텀 기능', '전담 매니저', '무제한 스토리지', 'SLA 보장'] },
              ].map((plan) => (
                <div key={plan.name} className={cn(
                  "rounded-2xl p-6 border-2 transition-all relative",
                  plan.popular ? "border-primary-500 bg-primary-50 scale-105 shadow-lg" : "border-slate-200 bg-white"
                )}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="font-bold text-xl mb-1">{plan.name}</div>
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {plan.price === '문의' ? plan.price : `₩${plan.price}`}
                    {plan.price !== '문의' && <span className="text-sm font-normal text-slate-500">/월</span>}
                  </div>
                  <div className="text-sm text-slate-500 mb-4">{plan.users}까지</div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className={cn(
                    "w-full py-2.5 rounded-lg text-sm font-semibold transition-colors",
                    plan.popular ? "bg-primary-500 text-white hover:bg-primary-600" : "bg-slate-100 hover:bg-slate-200"
                  )}>
                    {plan.price === '문의' ? '상담 신청' : '14일 무료 체험'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      } else if (scenarioId === 'saas-trial-end') {
        return (
          <div className="max-w-3xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="font-semibold text-amber-800">체험 기간이 3일 남았습니다</div>
                <div className="text-sm text-amber-600">지금 업그레이드하고 30% 할인 혜택을 받으세요!</div>
              </div>
              <button className="ml-auto bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600">
                업그레이드
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: '생성된 프로젝트', value: '12개', icon: Briefcase },
                { label: '팀 멤버', value: '5명', icon: Users },
                { label: '이번 달 활동', value: '234회', icon: TrendingUp },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-4 border">
                  <stat.icon className="w-5 h-5 text-slate-400 mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold mb-4">최근 활동</h3>
              <div className="space-y-3">
                {['프로젝트 A 업데이트', '새 팀원 초대', '보고서 생성'].map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    <span>{activity}</span>
                    <span className="text-slate-400 ml-auto">{i + 1}시간 전</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }
    }

    if (industryId === 'realestate') {
      if (scenarioId === 'realestate-listing') {
        return (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-[4/3] bg-slate-200 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-200 flex items-center justify-center">
                  <Home className="w-16 h-16 text-slate-400" />
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                  <Eye className="w-3 h-3" /> 1/12
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-xs font-medium">월세</span>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-medium">신축</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">강남역 초역세권 오피스텔</h2>
                <div className="text-3xl font-bold text-primary-600 mb-3">
                  보증금 1억 / 월세 150만
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> 강남역 도보 3분</div>
                  <div className="flex items-center gap-2"><Home className="w-4 h-4 text-slate-400" /> 전용 28㎡ (8.5평)</div>
                  <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /> 15층/20층</div>
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> 즉시 입주 가능</div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600">
                    방문 예약
                  </button>
                  <button className="px-4 py-3 border rounded-lg hover:bg-slate-50">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      } else {
        return (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <input
                type="text"
                placeholder="강남구"
                className="flex-1 px-4 py-3 border rounded-xl"
                readOnly
              />
              <button className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium">
                검색
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-slate-200 relative">
                    <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-0.5 rounded text-xs">월세</div>
                  </div>
                  <div className="p-4">
                    <div className="font-bold mb-1">강남역 오피스텔 {i}호</div>
                    <div className="text-primary-600 font-bold">1억/150만</div>
                    <div className="text-sm text-slate-500">전용 28㎡ · 10층</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }
    }

    if (industryId === 'education') {
      if (scenarioId === 'edu-course') {
        return (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Play className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">[왕초보] 6개월 완성 영어회화 마스터</h2>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 4.9 (2,847)</span>
                  <span>· 수강생 15,000+</span>
                  <span>· 6개월 과정</span>
                </div>
                <div className="prose prose-sm">
                  <h3>과정 소개</h3>
                  <p>영어 울렁증이 있으신 분들을 위한 왕초보 맞춤 커리큘럼입니다. 원어민 강사와 1:1 회화 연습으로 자신감을 키워보세요!</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border p-6 h-fit sticky top-24">
                <div className="text-3xl font-bold text-primary-600 mb-1">월 198,000원</div>
                <div className="text-sm text-slate-500 mb-4">6개월 과정 기준</div>
                <button className="w-full py-3 bg-primary-500 text-white rounded-lg font-semibold mb-3 hover:bg-primary-600">
                  수강 신청하기
                </button>
                <button className="w-full py-3 border rounded-lg font-medium hover:bg-slate-50">
                  무료 레벨 테스트
                </button>
              </div>
            </div>
          </div>
        )
      } else {
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">수강생 후기</h2>
            <div className="space-y-4">
              {[
                { name: '김**', rating: 5, content: '3개월 만에 영어 울렁증 극복했어요! 원어민 강사님이 정말 친절하세요.', date: '2024.01.15' },
                { name: '이**', rating: 5, content: '직장인도 다니기 편한 시간대가 많아서 좋아요. 온라인으로도 수강 가능해서 편리합니다.', date: '2024.01.10' },
                { name: '박**', rating: 4, content: '체계적인 커리큘럼 덕분에 실력이 많이 늘었어요. 조금 비싸긴 하지만 투자할 가치 있습니다.', date: '2024.01.05' },
              ].map((review, i) => (
                <div key={i} className="bg-white rounded-xl border p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="font-medium">{review.name}</span>
                    <span className="text-sm text-slate-400 ml-auto">{review.date}</span>
                  </div>
                  <p className="text-slate-600">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        )
      }
    }

    if (industryId === 'ecommerce') {
      if (scenarioId === 'ecom-cart') {
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">장바구니</h2>
            <div className="bg-white rounded-xl border divide-y">
              {[
                { name: '프리미엄 무선 이어폰', option: '화이트', price: 129000, qty: 1 },
                { name: '고급 가죽 케이스', option: '블랙', price: 45000, qty: 2 },
              ].map((item, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-slate-500">옵션: {item.option}</div>
                    <div className="text-sm text-slate-500">수량: {item.qty}</div>
                  </div>
                  <div className="font-bold">₩{(item.price * item.qty).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border mt-4 p-4">
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">상품 금액</span>
                <span>₩219,000</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">배송비</span>
                <span className="text-emerald-600">무료</span>
              </div>
              <div className="border-t pt-3 mt-3 flex justify-between">
                <span className="font-bold">총 결제금액</span>
                <span className="text-2xl font-bold text-primary-600">₩219,000</span>
              </div>
            </div>
            <button className="w-full mt-4 py-4 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600">
              결제하기
            </button>
          </div>
        )
      } else {
        return (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-24 h-24 text-slate-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-medium">BEST</span>
                  <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded text-xs font-medium">품절임박</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">프리미엄 무선 이어폰</h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-slate-500">4.9 (2,847개 리뷰)</span>
                </div>
                <div className="text-3xl font-bold text-primary-600 mb-4">₩129,000</div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 w-16">색상</span>
                    <div className="flex gap-2">
                      {['블랙', '화이트', '네이비'].map((color) => (
                        <button key={color} className="px-3 py-1 border rounded-lg text-sm hover:border-primary-500">
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600">
                    바로 구매
                  </button>
                  <button className="flex-1 py-3 border rounded-lg font-semibold hover:bg-slate-50">
                    장바구니
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    if (industryId === 'healthcare') {
      if (scenarioId === 'health-booking') {
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">진료 예약</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold mb-4">진료과 선택</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['피부과', '내과', '정형외과', '치과'].map((dept) => (
                    <button key={dept} className={cn(
                      "px-4 py-3 rounded-lg text-sm font-medium border transition-colors",
                      dept === '피부과' ? "bg-primary-50 border-primary-500 text-primary-700" : "hover:bg-slate-50"
                    )}>
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold mb-4">날짜 선택</h3>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                    <div key={day} className="py-2 text-slate-500">{day}</div>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => (
                    <button key={i} className={cn(
                      "py-2 rounded",
                      i === 14 ? "bg-primary-500 text-white" : "hover:bg-slate-100"
                    )}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-4 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600">
              예약하기
            </button>
          </div>
        )
      } else {
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">여드름 치료</h2>
            <p className="text-slate-500 mb-6">원인부터 치료까지 전문의와 상담하세요</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { icon: Shield, title: '전문의 진료', desc: '피부과 전문의 상담' },
                { icon: Award, title: '맞춤 치료', desc: '개인별 맞춤 치료' },
                { icon: Heart, title: '사후 관리', desc: '체계적인 관리' },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl border p-4 text-center">
                  <item.icon className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                  <div className="font-semibold mb-1">{item.title}</div>
                  <div className="text-sm text-slate-500">{item.desc}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-bold mb-4">치료 프로그램</h3>
              <div className="space-y-3">
                {[
                  { name: '기본 상담', price: '15,000원', desc: '전문의 진료 및 상담' },
                  { name: '스케일링', price: '50,000원~', desc: '각질 제거 및 모공 관리' },
                  { name: '레이저 치료', price: '100,000원~', desc: '흉터 개선 및 피부 재생' },
                ].map((program) => (
                  <div key={program.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium">{program.name}</div>
                      <div className="text-sm text-slate-500">{program.desc}</div>
                    </div>
                    <div className="font-bold text-primary-600">{program.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }
    }

    if (industryId === 'travel') {
      return (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">제주도 3박4일 패키지</h2>
          <p className="text-slate-500 mb-6">베스트 상품 모음</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: '럭셔리 호텔 패키지', price: '599,000', rating: 4.9 },
              { name: '가족 펜션 여행', price: '399,000', rating: 4.7 },
              { name: '렌터카 자유여행', price: '299,000', rating: 4.8 },
              { name: '허니문 스페셜', price: '899,000', rating: 5.0 },
            ].map((pkg) => (
              <div key={pkg.name} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white">
                  <Plane className="w-12 h-12" />
                </div>
                <div className="p-4">
                  <div className="font-bold mb-1">{pkg.name}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm">{pkg.rating}</span>
                  </div>
                  <div className="text-xl font-bold text-primary-600">₩{pkg.price}~</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (industryId === 'fitness') {
      return (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">회원권 안내</h2>
          <p className="text-slate-500 mb-6">당신의 건강한 시작</p>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { period: '1개월', price: '99,000', discount: null },
              { period: '3개월', price: '249,000', discount: '17%' },
              { period: '6개월', price: '449,000', discount: '25%', popular: true },
              { period: '12개월', price: '799,000', discount: '33%' },
            ].map((plan) => (
              <div key={plan.period} className={cn(
                "rounded-xl p-5 border-2 transition-all relative text-center",
                plan.popular ? "border-primary-500 bg-primary-50" : "border-slate-200 bg-white"
              )}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    BEST
                  </div>
                )}
                <div className="font-bold text-lg mb-2">{plan.period}</div>
                <div className="text-2xl font-bold text-primary-600">₩{plan.price}</div>
                {plan.discount && (
                  <div className="text-sm text-primary-500 font-medium mt-1">{plan.discount} 할인</div>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Dumbbell, title: '최신 기구', desc: '프리미엄 웨이트 머신' },
              { icon: Users, title: 'GX 프로그램', desc: '요가/필라테스/스피닝' },
              { icon: Shield, title: '무료 주차', desc: '2시간 무료' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl border p-4 flex items-center gap-3">
                <feature.icon className="w-8 h-8 text-primary-500" />
                <div>
                  <div className="font-semibold">{feature.title}</div>
                  <div className="text-sm text-slate-500">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <currentIndustry.icon className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">{currentScenario.pageTitle}</h2>
        <p className="text-slate-500">이 영역은 고객님의 웹사이트 콘텐츠입니다</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Video className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-cyan-600 bg-clip-text text-transparent">린다애스크</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                  showSettings ? "bg-primary-50 border-primary-200 text-primary-700" : "hover:bg-slate-50"
                )}
              >
                <Settings className="w-4 h-4" />
                산업군 선택
              </button>
              <button
                onClick={() => setShowTriggerConfig(!showTriggerConfig)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                  showTriggerConfig ? "bg-violet-50 border-violet-200 text-violet-700" : "hover:bg-slate-50"
                )}
              >
                <Target className="w-4 h-4" />
                트리거 설정
              </button>
              <button
                onClick={resetDemo}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-slate-50 transition-colors text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                초기화
              </button>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-all shadow-lg shadow-primary-500/20"
              >
                무료로 시작하기
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Industry Selection Panel */}
      {showSettings && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl border w-[800px] max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">산업군별 데모 시나리오</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  실제 비즈니스 상황에서 린다애스크가 어떻게 활용되는지 체험해보세요
                </p>
              </div>
              <button onClick={() => setShowSettings(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex max-h-[60vh]">
            {/* Industry List */}
            <div className="w-56 border-r bg-slate-50 overflow-y-auto">
              {INDUSTRIES.map((industry) => {
                const Icon = industry.icon
                return (
                  <button
                    key={industry.id}
                    onClick={() => handleIndustryChange(industry.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                      selectedIndustry === industry.id
                        ? "bg-white border-r-2 border-primary-500"
                        : "hover:bg-slate-100"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center",
                      selectedIndustry === industry.id
                        ? `bg-gradient-to-br ${industry.gradient} text-white`
                        : "bg-slate-200 text-slate-500"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      selectedIndustry === industry.id ? "text-foreground" : "text-slate-600"
                    )}>
                      {industry.name}
                    </span>
                  </button>
                )
              })}
            </div>
            {/* Scenario List */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-3">
                {currentIndustry.scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => {
                      handleScenarioChange(scenario.id)
                      setShowSettings(false)
                    }}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all",
                      selectedScenario === scenario.id
                        ? "border-primary-500 bg-primary-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold">{scenario.name}</div>
                      <div className="flex gap-1">
                        {scenario.triggers.map((trigger) => (
                          <span key={trigger} className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-500">
                            {trigger === 'time' && '시간'}
                            {trigger === 'scroll' && '스크롤'}
                            {trigger === 'exit' && '이탈'}
                            {trigger === 'url' && 'URL'}
                            {trigger === 'idle' && '비활성'}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{scenario.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <LinkIcon className="w-3 h-3" />
                      {scenario.pageUrl}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Configuration Panel */}
      {showTriggerConfig && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl border w-[600px]">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">트리거 조건 설정</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  위젯이 나타나는 조건을 맞춤 설정하세요
                </p>
              </div>
              <button onClick={() => setShowTriggerConfig(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {triggerConditions.map((condition) => {
              const Icon = condition.icon
              return (
                <div key={condition.id} className="flex items-start gap-4 p-4 rounded-xl border">
                  <button
                    onClick={() => toggleTriggerCondition(condition.id)}
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      condition.enabled
                        ? "bg-primary-100 text-primary-600"
                        : "bg-slate-100 text-slate-400"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{condition.label}</span>
                      <div className={cn(
                        "w-8 h-5 rounded-full p-0.5 transition-colors cursor-pointer",
                        condition.enabled ? "bg-primary-500" : "bg-slate-300"
                      )}
                        onClick={() => toggleTriggerCondition(condition.id)}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-full bg-white transition-transform",
                          condition.enabled ? "translate-x-3" : "translate-x-0"
                        )} />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{condition.description}</p>
                    {condition.type === 'time' && (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={condition.value as number}
                          onChange={(e) => updateTriggerValue(condition.id, parseInt(e.target.value) || 0)}
                          className="w-20 px-3 py-1.5 border rounded-lg text-sm"
                          min={1}
                          max={120}
                        />
                        <span className="text-sm text-slate-500">초 이상 체류 시</span>
                      </div>
                    )}
                    {condition.type === 'scroll' && (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={condition.value as number}
                          onChange={(e) => updateTriggerValue(condition.id, parseInt(e.target.value) || 0)}
                          className="w-20 px-3 py-1.5 border rounded-lg text-sm"
                          min={10}
                          max={100}
                        />
                        <span className="text-sm text-slate-500">% 이상 스크롤 시</span>
                      </div>
                    )}
                    {condition.type === 'url' && (
                      <input
                        type="text"
                        value={condition.value as string}
                        onChange={(e) => updateTriggerValue(condition.id, e.target.value)}
                        placeholder="/pricing, /cart 등"
                        className="w-full px-3 py-1.5 border rounded-lg text-sm"
                      />
                    )}
                    {condition.type === 'idle' && (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={condition.value as number}
                          onChange={(e) => updateTriggerValue(condition.id, parseInt(e.target.value) || 0)}
                          className="w-20 px-3 py-1.5 border rounded-lg text-sm"
                          min={5}
                          max={120}
                        />
                        <span className="text-sm text-slate-500">초간 비활성 시</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="p-4 border-t bg-slate-50 flex justify-between items-center">
            <div className="text-sm text-slate-500">
              {triggerConditions.filter(t => t.enabled).length}개 조건 활성화됨
            </div>
            <button
              onClick={() => setShowTriggerConfig(false)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
            >
              적용하기
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4 border",
              `bg-gradient-to-r ${currentIndustry.gradient} text-white`
            )}>
              <currentIndustry.icon className="w-4 h-4" />
              {currentIndustry.name} - {currentScenario.name}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              실제 고객 경험을 체험해보세요
            </h1>
            <p className="text-muted-foreground">
              {currentScenario.description}에 위젯이 자동으로 나타납니다
            </p>
          </div>

          {/* Demo Browser Window */}
          <div className="bg-white rounded-2xl border shadow-2xl overflow-hidden">
            {/* Browser Chrome */}
            <div className="bg-slate-100 px-4 py-3 border-b flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white rounded-lg px-4 py-1.5 text-sm text-slate-600 border flex items-center gap-2 w-[420px]">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="truncate">{currentScenario.pageUrl}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeOnPage}초
                </span>
                <span className="flex items-center gap-1">
                  <Scroll className="w-3 h-3" />
                  {scrollDepth}%
                </span>
              </div>
            </div>

            {/* Page Content */}
            <div
              ref={pageContentRef}
              className="min-h-[600px] max-h-[600px] overflow-y-auto bg-gradient-to-b from-white to-slate-50 p-8"
            >
              {renderPageContent()}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border hover:shadow-lg transition-shadow">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", `bg-gradient-to-br ${currentIndustry.gradient}`)}>
                <Video className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold mb-1">영상으로 신뢰 형성</h3>
              <p className="text-sm text-muted-foreground">
                실제 사람의 얼굴로 전환율 3배 향상
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold mb-1">스마트 트리거</h3>
              <p className="text-sm text-muted-foreground">
                최적의 타이밍에 위젯 노출
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-3">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold mb-1">AI 24시간 응대</h3>
              <p className="text-sm text-muted-foreground">
                담당자 부재 시에도 자동 답변
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold mb-1">산업별 맞춤</h3>
              <p className="text-sm text-muted-foreground">
                업종에 최적화된 시나리오
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Widget */}
      {showWidget && (
        <div className="fixed bottom-6 right-6 z-50 animate-in">
          <div className="bg-white rounded-2xl shadow-2xl w-[360px] overflow-hidden border">
            {/* Video Section */}
            {widgetMode === 'video' && (
              <>
                {/* Video Container - Full Width */}
                <div className={cn("relative aspect-[4/3]", `bg-gradient-to-br ${currentIndustry.gradient}`)}>
                  {/* Close button */}
                  <button
                    onClick={() => setShowWidget(false)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Video Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                        {isPlaying ? (
                          <div className="w-20 h-20 rounded-full bg-white/30 animate-pulse flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/40" />
                          </div>
                        ) : (
                          <Play className="w-10 h-10 text-white ml-1" />
                        )}
                      </div>
                      <p className="text-lg font-semibold">{currentScenario.videoTitle}</p>
                      <p className="text-sm opacity-80">{currentScenario.videoSubtitle}</p>
                    </div>
                  </div>

                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-white hover:opacity-80"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full w-[65%]" />
                      </div>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-white hover:opacity-80"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Live Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white text-xs font-medium">실시간 상담</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 space-y-2">
                  <button
                    onClick={() => setWidgetMode('chat')}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-all",
                      `bg-gradient-to-r ${currentIndustry.gradient}`
                    )}
                  >
                    <MessageSquare className="w-5 h-5" />
                    채팅으로 문의하기
                  </button>
                  <button
                    onClick={handlePhoneCall}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-green-500 text-green-600 font-medium hover:bg-green-50 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    전화 상담 (010-6326-9009)
                  </button>
                  <button
                    onClick={() => {
                      setWidgetMode('calendar')
                      setBookingStep('date')
                      setSelectedDate(null)
                      setSelectedTime(null)
                      setBookingForm({ name: '', email: '', phone: '', message: '' })
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 hover:border-primary-400 hover:bg-primary-50 transition-all group"
                  >
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", `bg-gradient-to-br ${currentIndustry.gradient} opacity-15`)}>
                      <Calendar className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-sm text-slate-900">미팅 예약하기</div>
                      <div className="text-xs text-slate-500">편한 시간에 상담 예약</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </>
            )}

            {/* Chat Section */}
            {widgetMode === 'chat' && (
              <>
                {/* Chat Header */}
                <div className={cn("p-4 text-white", `bg-gradient-to-r ${currentIndustry.gradient}`)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setWidgetMode('video')}
                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4 rotate-[225deg]" />
                      </button>
                      <div>
                        <div className="font-semibold">린다애스크</div>
                        <div className="text-xs opacity-80 flex items-center gap-1">
                          <Bot className="w-3 h-3" />
                          AI 상담원 응대 중
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowWidget(false)}
                      className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="h-[300px] overflow-y-auto p-4 space-y-3 bg-slate-50">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-2",
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0", `bg-gradient-to-br ${currentIndustry.gradient}`)}>
                          <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap",
                          message.role === 'user'
                            ? "bg-primary-500 text-white rounded-br-sm"
                            : "bg-white text-foreground rounded-bl-sm shadow-sm border"
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-2 items-start">
                      <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0", `bg-gradient-to-br ${currentIndustry.gradient}`)}>
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-3 border-t bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="메시지를 입력하세요..."
                      className="flex-1 px-4 py-2.5 rounded-full border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className={cn(
                        "w-10 h-10 rounded-full text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50",
                        `bg-gradient-to-r ${currentIndustry.gradient}`
                      )}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Calendar Section */}
            {widgetMode === 'calendar' && (
              <>
                {/* Calendar Header */}
                <div className={cn("p-4 text-white", `bg-gradient-to-r ${currentIndustry.gradient}`)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (bookingStep === 'date') {
                            setWidgetMode('video')
                          } else if (bookingStep === 'time') {
                            setBookingStep('date')
                          } else if (bookingStep === 'form') {
                            setBookingStep('time')
                          }
                        }}
                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4 rotate-[225deg]" />
                      </button>
                      <div>
                        <div className="font-semibold">미팅 예약</div>
                        <div className="text-xs opacity-80">
                          {bookingStep === 'date' && '날짜를 선택해주세요'}
                          {bookingStep === 'time' && '시간을 선택해주세요'}
                          {bookingStep === 'form' && '정보를 입력해주세요'}
                          {bookingStep === 'success' && '예약이 완료되었습니다'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowWidget(false)}
                      className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Calendar Content */}
                <div className="p-4">
                  {/* Date Selection */}
                  {bookingStep === 'date' && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 mb-3">예약 가능한 날짜</p>
                      <div className="grid grid-cols-4 gap-2">
                        {getNext7Days().map((date, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedDate(date)
                              setBookingStep('time')
                            }}
                            className={cn(
                              "p-3 rounded-xl border-2 text-center transition-all hover:border-primary-400",
                              selectedDate?.toDateString() === date.toDateString()
                                ? "border-primary-500 bg-primary-50"
                                : "border-slate-200"
                            )}
                          >
                            <div className="text-xs text-slate-500">
                              {['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}
                            </div>
                            <div className="text-lg font-semibold">{date.getDate()}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Time Selection */}
                  {bookingStep === 'time' && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 mb-1">
                        {selectedDate && formatDateKr(selectedDate)} 예약 가능 시간
                      </p>
                      <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto">
                        {getTimeSlots().map((slot, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              if (slot.available) {
                                setSelectedTime(slot.time)
                                setBookingStep('form')
                              }
                            }}
                            disabled={!slot.available}
                            className={cn(
                              "py-2.5 px-3 rounded-lg border text-sm font-medium transition-all",
                              !slot.available && "opacity-40 cursor-not-allowed bg-slate-50",
                              slot.available && selectedTime === slot.time && "border-primary-500 bg-primary-50",
                              slot.available && selectedTime !== slot.time && "border-slate-200 hover:border-primary-400"
                            )}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Booking Form */}
                  {bookingStep === 'form' && (
                    <div className="space-y-4">
                      <div className="p-3 bg-primary-50 rounded-lg text-sm">
                        <span className="font-medium">{selectedDate && formatDateKr(selectedDate)}</span>
                        <span className="mx-2">·</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="이름 *"
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                        <input
                          type="email"
                          placeholder="이메일 *"
                          value={bookingForm.email}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                        <input
                          type="tel"
                          placeholder="전화번호"
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                        <textarea
                          placeholder="문의 내용 (선택)"
                          value={bookingForm.message}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, message: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm h-20 resize-none"
                        />
                      </div>

                      <button
                        onClick={handleBookingSubmit}
                        disabled={!bookingForm.name || !bookingForm.email}
                        className={cn(
                          "w-full py-3 rounded-xl text-white font-medium transition-all disabled:opacity-50",
                          `bg-gradient-to-r ${currentIndustry.gradient}`
                        )}
                      >
                        예약 확정하기
                      </button>
                    </div>
                  )}

                  {/* Success */}
                  {bookingStep === 'success' && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">예약 완료!</h3>
                      <p className="text-slate-500 text-sm">
                        {selectedDate && formatDateKr(selectedDate)} {selectedTime}
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        확인 메일을 발송해 드렸습니다.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Footer */}
            <div className="px-4 py-2 border-t bg-slate-50 text-center">
              <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Powered by 린다애스크
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
