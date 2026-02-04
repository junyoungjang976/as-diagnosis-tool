import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.diagnosis.deleteMany()
  await prisma.part.deleteMany()
  await prisma.checklistItem.deleteMany()
  await prisma.equipment.deleteMany()
  await prisma.equipmentCategory.deleteMany()
  await prisma.laborRate.deleteMany()
  await prisma.travelRate.deleteMany()

  console.log('✓ Cleared existing data')

  // Create categories
  const categories = await Promise.all([
    prisma.equipmentCategory.create({
      data: {
        name: '가열설비',
        description: '가스레인지, 튀김기 등 가열 조리 장비'
      }
    }),
    prisma.equipmentCategory.create({
      data: {
        name: '조리설비',
        description: '오븐, 국솥 등 조리 장비'
      }
    }),
    prisma.equipmentCategory.create({
      data: {
        name: '가공설비',
        description: '절단기, 믹서 등 식재료 가공 장비'
      }
    }),
    prisma.equipmentCategory.create({
      data: {
        name: '후드',
        description: '급배기 후드, 배기 장치'
      }
    }),
    prisma.equipmentCategory.create({
      data: {
        name: '냉장설비',
        description: '냉장고, 냉동고, 쇼케이스'
      }
    })
  ])

  console.log('✓ Created categories')

  // 가열설비 Equipment
  const gasRange = await prisma.equipment.create({
    data: {
      name: '가스레인지',
      model: '5구 테이블형',
      categoryId: categories[0].id,
      checklistItems: {
        create: [
          { item: '가스 누출 여부 확인', description: '비눗물로 연결부 점검', order: 1 },
          { item: '점화 상태 확인', description: '모든 버너 점화 테스트', order: 2 },
          { item: '화력 조절 확인', description: '밸브 조절 시 화력 변화 확인', order: 3 },
          { item: '안전장치 작동 확인', description: '과열 차단 장치 테스트', order: 4 },
          { item: '호스 및 배관 상태', description: '균열, 노후화 확인', order: 5 },
          { item: '버너 헤드 청결 상태', description: '막힘 및 오염 확인', order: 6 },
          { item: '점화 코일 상태', description: '스파크 발생 여부', order: 7 }
        ]
      },
      parts: {
        create: [
          { name: '점화 코일', partNumber: 'IC-5000', price: 35000 },
          { name: '가스 밸브', partNumber: 'GV-200', price: 85000 },
          { name: '버너 캡', partNumber: 'BC-50', price: 15000 },
          { name: '안전장치 센서', partNumber: 'SS-300', price: 65000 }
        ]
      }
    }
  })

  const induction = await prisma.equipment.create({
    data: {
      name: '인덕션',
      model: '3구 업소용',
      categoryId: categories[0].id,
      checklistItems: {
        create: [
          { item: '전원 공급 상태', description: '정격 전압 확인 (380V)', order: 1 },
          { item: '화력 조절 기능', description: '단계별 출력 테스트', order: 2 },
          { item: '과열 보호 기능', description: '온도 센서 작동 확인', order: 3 },
          { item: '조작 패널 작동', description: '버튼 및 터치 반응 확인', order: 4 },
          { item: '냉각팬 작동', description: '소음 및 회전 상태', order: 5 },
          { item: '용기 감지 기능', description: '인덕션 전용 용기 감지', order: 6 }
        ]
      },
      parts: {
        create: [
          { name: 'IGBT 모듈', partNumber: 'IG-7000', price: 250000 },
          { name: '제어 기판', partNumber: 'CB-500', price: 180000 },
          { name: '냉각팬', partNumber: 'CF-120', price: 45000 },
          { name: '온도 센서', partNumber: 'TS-100', price: 35000 }
        ]
      }
    }
  })

  const fryer = await prisma.equipment.create({
    data: {
      name: '튀김기',
      model: '1조 2구 전기식',
      categoryId: categories[0].id,
      checklistItems: {
        create: [
          { item: '온도 조절 기능', description: '설정 온도 도달 시간 측정', order: 1 },
          { item: '히터 작동 상태', description: '발열 균일도 확인', order: 2 },
          { item: '온도 센서 정확도', description: '실제 온도와 표시 온도 비교', order: 3 },
          { item: '안전 스위치 작동', description: '과열 차단 테스트', order: 4 },
          { item: '기름 배수 밸브', description: '누유 및 작동 확인', order: 5 },
          { item: '바스켓 승강 장치', description: '자동 승강 시 소음 확인', order: 6 },
          { item: '전기 연결부', description: '절연 상태 점검', order: 7 }
        ]
      },
      parts: {
        create: [
          { name: '히터', partNumber: 'HT-3000', price: 120000 },
          { name: '온도 조절기', partNumber: 'TC-400', price: 95000 },
          { name: '온도 센서', partNumber: 'TS-200', price: 42000 },
          { name: '배수 밸브', partNumber: 'DV-100', price: 38000 }
        ]
      }
    }
  })

  const griddle = await prisma.equipment.create({
    data: {
      name: '그리들',
      model: '평판 가스식',
      categoryId: categories[0].id,
      checklistItems: {
        create: [
          { item: '가스 공급 상태', description: '압력 및 누출 확인', order: 1 },
          { item: '평판 가열 균일도', description: '전체 면적 온도 측정', order: 2 },
          { item: '온도 조절 기능', description: '설정 온도 유지 확인', order: 3 },
          { item: '점화 장치', description: '자동 점화 작동 테스트', order: 4 },
          { item: '배수 홈 상태', description: '막힘 및 기울기 확인', order: 5 },
          { item: '평판 표면 상태', description: '부식, 변형 확인', order: 6 }
        ]
      },
      parts: {
        create: [
          { name: '버너 유닛', partNumber: 'BU-800', price: 150000 },
          { name: '점화 장치', partNumber: 'IG-300', price: 55000 },
          { name: '온도 조절 밸브', partNumber: 'TV-250', price: 78000 },
          { name: '평판 (스테인리스)', partNumber: 'PL-SUS', price: 280000 }
        ]
      }
    }
  })

  // 조리설비 Equipment
  const steamConvection = await prisma.equipment.create({
    data: {
      name: '스팀컨벡션오븐',
      model: '10단 전기식',
      categoryId: categories[1].id,
      checklistItems: {
        create: [
          { item: '스팀 발생 기능', description: '보일러 작동 및 스팀 분사 확인', order: 1 },
          { item: '컨벡션 팬 작동', description: '회전 속도 및 소음 확인', order: 2 },
          { item: '온도 정확도', description: '각 단별 온도 측정', order: 3 },
          { item: '타이머 기능', description: '설정 시간 정확도 확인', order: 4 },
          { item: '도어 밀폐 상태', description: '증기 누출 확인', order: 5 },
          { item: '배수 시스템', description: '자동 배수 작동 테스트', order: 6 },
          { item: '내부 청결 상태', description: '스케일 및 오염 확인', order: 7 },
          { item: '제어판 작동', description: '버튼 및 디스플레이 확인', order: 8 }
        ]
      },
      parts: {
        create: [
          { name: '보일러 유닛', partNumber: 'BL-2000', price: 380000 },
          { name: '컨벡션 모터', partNumber: 'CM-1500', price: 220000 },
          { name: '온도 센서', partNumber: 'TS-300', price: 48000 },
          { name: '도어 가스켓', partNumber: 'DG-500', price: 65000 },
          { name: '제어 기판', partNumber: 'CB-800', price: 320000 }
        ]
      }
    }
  })

  const tilting = await prisma.equipment.create({
    data: {
      name: '회전식국솥',
      model: '100L 전기식',
      categoryId: categories[1].id,
      checklistItems: {
        create: [
          { item: '가열 기능', description: '설정 온도 도달 시간 확인', order: 1 },
          { item: '회전 기능', description: '모터 작동 및 회전 속도 확인', order: 2 },
          { item: '기울임 장치', description: '유압 또는 전동 작동 테스트', order: 3 },
          { item: '온도 조절 정확도', description: '자동 온도 유지 확인', order: 4 },
          { item: '안전 잠금 장치', description: '뚜껑 잠금 시 가열 차단 확인', order: 5 },
          { item: '내솥 상태', description: '코팅 벗겨짐 확인', order: 6 }
        ]
      },
      parts: {
        create: [
          { name: '히터 유닛', partNumber: 'HU-5000', price: 280000 },
          { name: '회전 모터', partNumber: 'RM-300', price: 350000 },
          { name: '기울임 실린더', partNumber: 'TC-600', price: 420000 },
          { name: '온도 조절기', partNumber: 'TC-500', price: 125000 }
        ]
      }
    }
  })

  const autoWok = await prisma.equipment.create({
    data: {
      name: '자동볶음기',
      model: '30L 가스식',
      categoryId: categories[1].id,
      checklistItems: {
        create: [
          { item: '가스 공급 및 점화', description: '자동 점화 기능 확인', order: 1 },
          { item: '교반 날개 작동', description: '회전 및 소음 확인', order: 2 },
          { item: '온도 센서 작동', description: '온도 표시 정확도 확인', order: 3 },
          { item: '자동 배출 기능', description: '볶음 완료 후 배출 테스트', order: 4 },
          { item: '타이머 기능', description: '예약 조리 기능 확인', order: 5 },
          { item: '안전 덮개', description: '작동 중 개방 시 차단 확인', order: 6 }
        ]
      },
      parts: {
        create: [
          { name: '교반 모터', partNumber: 'SM-400', price: 280000 },
          { name: '가스 밸브 유닛', partNumber: 'GV-300', price: 95000 },
          { name: '교반 날개', partNumber: 'SB-200', price: 85000 },
          { name: '온도 센서', partNumber: 'TS-250', price: 52000 }
        ]
      }
    }
  })

  // 가공설비 Equipment
  const vegCutter = await prisma.equipment.create({
    data: {
      name: '야채절단기',
      model: '다기능 업소용',
      categoryId: categories[2].id,
      checklistItems: {
        create: [
          { item: '모터 작동 상태', description: '기동 시 소음 및 진동 확인', order: 1 },
          { item: '칼날 상태', description: '날카로움 및 고정 상태 확인', order: 2 },
          { item: '안전 스위치', description: '덮개 개방 시 정지 확인', order: 3 },
          { item: '절단 디스크 교체', description: '탈착 기능 확인', order: 4 },
          { item: '투입구 안전장치', description: '손 보호 기능 확인', order: 5 },
          { item: '청소 용이성', description: '분해 조립 확인', order: 6 }
        ]
      },
      parts: {
        create: [
          { name: '절단 모터', partNumber: 'CM-750', price: 320000 },
          { name: '절단 디스크 세트', partNumber: 'DS-SET', price: 180000 },
          { name: '안전 스위치', partNumber: 'SS-100', price: 35000 },
          { name: 'V벨트', partNumber: 'VB-A50', price: 18000 }
        ]
      }
    }
  })

  const mixer = await prisma.equipment.create({
    data: {
      name: '믹서기',
      model: '20L 업소용',
      categoryId: categories[2].id,
      checklistItems: {
        create: [
          { item: '모터 작동 확인', description: '속도별 작동 테스트', order: 1 },
          { item: '믹싱 날개 상태', description: '변형 및 마모 확인', order: 2 },
          { item: '볼 고정 장치', description: '작동 중 흔들림 확인', order: 3 },
          { item: '속도 조절 기능', description: '단계별 속도 변화 확인', order: 4 },
          { item: '과부하 보호', description: '과부하 시 자동 정지 확인', order: 5 },
          { item: '타이머 기능', description: '자동 정지 시간 확인', order: 6 }
        ]
      },
      parts: {
        create: [
          { name: '믹싱 모터', partNumber: 'MM-1200', price: 380000 },
          { name: '행성 기어', partNumber: 'PG-300', price: 220000 },
          { name: '믹싱 후크', partNumber: 'MH-200', price: 65000 },
          { name: '믹싱 비터', partNumber: 'MB-200', price: 58000 }
        ]
      }
    }
  })

  const slicer = await prisma.equipment.create({
    data: {
      name: '슬라이서',
      model: '육류용 자동',
      categoryId: categories[2].id,
      checklistItems: {
        create: [
          { item: '칼날 회전 상태', description: '일정한 속도 유지 확인', order: 1 },
          { item: '칼날 날카로움', description: '절단 품질 확인', order: 2 },
          { item: '두께 조절 기능', description: '눈금별 절단 두께 확인', order: 3 },
          { item: '안전 가드', description: '칼날 보호 장치 확인', order: 4 },
          { item: '받침대 미끄럼', description: '원활한 이동 확인', order: 5 },
          { item: '청소 및 분해', description: '일일 청소 용이성 확인', order: 6 }
        ]
      },
      parts: {
        create: [
          { name: '슬라이싱 모터', partNumber: 'SM-500', price: 280000 },
          { name: '슬라이싱 블레이드', partNumber: 'SB-300', price: 150000 },
          { name: '두께 조절 다이얼', partNumber: 'TD-100', price: 42000 },
          { name: '안전 가드', partNumber: 'SG-200', price: 55000 }
        ]
      }
    }
  })

  const vacuumPacker = await prisma.equipment.create({
    data: {
      name: '진공포장기',
      model: '챔버형 업소용',
      categoryId: categories[2].id,
      checklistItems: {
        create: [
          { item: '진공 펌프 작동', description: '진공도 측정 (-0.9bar 이상)', order: 1 },
          { item: '실링 기능', description: '밀봉 강도 및 온도 확인', order: 2 },
          { item: '챔버 밀폐 상태', description: '공기 누출 확인', order: 3 },
          { item: '제어판 작동', description: '자동/수동 모드 전환 확인', order: 4 },
          { item: '오일 레벨', description: '펌프 오일량 확인', order: 5 },
          { item: '실링 바 상태', description: '테프론 테이프 마모 확인', order: 6 }
        ]
      },
      parts: {
        create: [
          { name: '진공 펌프', partNumber: 'VP-2000', price: 550000 },
          { name: '실링 바', partNumber: 'SB-400', price: 120000 },
          { name: '테프론 테이프', partNumber: 'TT-50', price: 15000 },
          { name: '챔버 가스켓', partNumber: 'CG-300', price: 85000 }
        ]
      }
    }
  })

  // 후드 Equipment
  const supplyExhaustHood = await prisma.equipment.create({
    data: {
      name: '급배기후드',
      model: '2400mm 센서식',
      categoryId: categories[3].id,
      checklistItems: {
        create: [
          { item: '배기팬 작동', description: '풍량 및 소음 측정', order: 1 },
          { item: '급기팬 작동', description: '급기 풍량 확인', order: 2 },
          { item: '센서 작동', description: '연기 감지 자동 작동 확인', order: 3 },
          { item: '덕트 연결 상태', description: '누기 및 진동 확인', order: 4 },
          { item: '필터 청결도', description: '그리스 필터 오염도 확인', order: 5 },
          { item: '조명 작동', description: 'LED 조명 점등 확인', order: 6 },
          { item: '소화 시스템', description: '자동 소화 장치 점검', order: 7 }
        ]
      },
      parts: {
        create: [
          { name: '배기 모터', partNumber: 'EM-3000', price: 480000 },
          { name: '급기 모터', partNumber: 'SM-2000', price: 380000 },
          { name: '그리스 필터', partNumber: 'GF-600', price: 95000 },
          { name: '연기 센서', partNumber: 'SS-300', price: 120000 }
        ]
      }
    }
  })

  const exhaustHood = await prisma.equipment.create({
    data: {
      name: '배기후드',
      model: '1800mm 일반형',
      categoryId: categories[3].id,
      checklistItems: {
        create: [
          { item: '배기팬 작동', description: '회전 및 풍량 확인', order: 1 },
          { item: '모터 베어링', description: '소음 및 진동 확인', order: 2 },
          { item: '덕트 접속부', description: '누기 및 테이프 상태 확인', order: 3 },
          { item: '필터 상태', description: '막힘 및 오염도 확인', order: 4 },
          { item: '후드 본체', description: '변형 및 부식 확인', order: 5 },
          { item: '배수 트랩', description: '물 고임 및 막힘 확인', order: 6 }
        ]
      },
      parts: {
        create: [
          { name: '배기 모터', partNumber: 'EM-2000', price: 350000 },
          { name: '팬 블레이드', partNumber: 'FB-500', price: 180000 },
          { name: '그리스 필터', partNumber: 'GF-450', price: 75000 },
          { name: '벨트', partNumber: 'BT-A60', price: 22000 }
        ]
      }
    }
  })

  const airSupply = await prisma.equipment.create({
    data: {
      name: '급기장치',
      model: '외기 도입형',
      categoryId: categories[3].id,
      checklistItems: {
        create: [
          { item: '급기팬 작동', description: '풍량 측정 확인', order: 1 },
          { item: '필터 상태', description: '프리 필터 오염도 확인', order: 2 },
          { item: '댐퍼 작동', description: '개폐 원활성 확인', order: 3 },
          { item: '덕트 연결', description: '누기 확인', order: 4 },
          { item: '외기 흡입구', description: '막힘 및 청결 확인', order: 5 }
        ]
      },
      parts: {
        create: [
          { name: '급기 모터', partNumber: 'SM-1500', price: 320000 },
          { name: '프리 필터', partNumber: 'PF-300', price: 45000 },
          { name: '댐퍼 액츄에이터', partNumber: 'DA-200', price: 180000 }
        ]
      }
    }
  })

  // 냉장설비 Equipment
  const upright = await prisma.equipment.create({
    data: {
      name: '업소용냉장고',
      model: '4도어 냉장전용',
      categoryId: categories[4].id,
      checklistItems: {
        create: [
          { item: '냉장 온도 확인', description: '설정 온도 유지 확인 (0~5℃)', order: 1 },
          { item: '컴프레서 작동', description: '기동 및 소음 확인', order: 2 },
          { item: '증발기 성에', description: '성에 제거 상태 확인', order: 3 },
          { item: '응축기 청결', description: '먼지 및 오염 확인', order: 4 },
          { item: '도어 가스켓', description: '밀폐 상태 확인 (종이 테스트)', order: 5 },
          { item: '배수 호스', description: '막힘 및 누수 확인', order: 6 },
          { item: '내부 조명', description: 'LED 점등 확인', order: 7 },
          { item: '냉매 압력', description: '게이지 압력 확인', order: 8 }
        ]
      },
      parts: {
        create: [
          { name: '컴프레서', partNumber: 'CP-1200', price: 580000 },
          { name: '증발기', partNumber: 'EV-400', price: 280000 },
          { name: '응축기', partNumber: 'CD-300', price: 220000 },
          { name: '도어 가스켓', partNumber: 'DG-180', price: 45000 },
          { name: '온도 조절기', partNumber: 'TC-350', price: 95000 }
        ]
      }
    }
  })

  const freezer = await prisma.equipment.create({
    data: {
      name: '냉동고',
      model: '2도어 냉동전용',
      categoryId: categories[4].id,
      checklistItems: {
        create: [
          { item: '냉동 온도 확인', description: '설정 온도 유지 확인 (-18℃ 이하)', order: 1 },
          { item: '컴프레서 작동', description: '기동 전류 및 소음 확인', order: 2 },
          { item: '제상 타이머', description: '자동 제상 주기 확인', order: 3 },
          { item: '증발기 팬', description: '냉기 순환 확인', order: 4 },
          { item: '도어 힌지', description: '개폐 원활성 확인', order: 5 },
          { item: '단열재 상태', description: '결로 및 변형 확인', order: 6 },
          { item: '배수 히터', description: '제상수 동결 방지 확인', order: 7 }
        ]
      },
      parts: {
        create: [
          { name: '컴프레서', partNumber: 'CP-1500', price: 680000 },
          { name: '증발기 팬 모터', partNumber: 'EF-250', price: 120000 },
          { name: '제상 타이머', partNumber: 'DT-100', price: 55000 },
          { name: '배수 히터', partNumber: 'DH-50', price: 35000 }
        ]
      }
    }
  })

  const kimchiRef = await prisma.equipment.create({
    data: {
      name: '김치냉장고',
      model: '업소용 500L',
      categoryId: categories[4].id,
      checklistItems: {
        create: [
          { item: '온도 유지 확인', description: '설정 온도 편차 확인 (-1~5℃)', order: 1 },
          { item: '컴프레서 작동', description: '작동 사이클 확인', order: 2 },
          { item: '내부 습도', description: '김치 보관 최적 습도 확인', order: 3 },
          { item: '냄새 차단', description: '탈취 필터 상태 확인', order: 4 },
          { item: '도어 밀폐', description: '가스켓 상태 확인', order: 5 },
          { item: '선반 상태', description: '변형 및 부식 확인', order: 6 }
        ]
      },
      parts: {
        create: [
          { name: '컴프레서', partNumber: 'CP-1000', price: 520000 },
          { name: '탈취 필터', partNumber: 'OF-100', price: 38000 },
          { name: '온도 센서', partNumber: 'TS-300', price: 48000 },
          { name: '도어 가스켓', partNumber: 'DG-200', price: 52000 }
        ]
      }
    }
  })

  const showcase = await prisma.equipment.create({
    data: {
      name: '쇼케이스',
      model: '음료용 냉장 진열형',
      categoryId: categories[4].id,
      checklistItems: {
        create: [
          { item: '냉장 온도 확인', description: '진열 상품 온도 측정', order: 1 },
          { item: '컴프레서 작동', description: '소음 및 진동 확인', order: 2 },
          { item: '유리문 결로', description: '결로 방지 히터 작동 확인', order: 3 },
          { item: '내부 조명', description: 'LED 조명 점등 확인', order: 4 },
          { item: '증발기 팬', description: '냉기 순환 균일성 확인', order: 5 },
          { item: '도어 개폐', description: '자동 닫힘 기능 확인', order: 6 },
          { item: '외관 청결', description: '유리 및 스테인리스 상태 확인', order: 7 }
        ]
      },
      parts: {
        create: [
          { name: '컴프레서', partNumber: 'CP-800', price: 420000 },
          { name: 'LED 조명 모듈', partNumber: 'LM-300', price: 85000 },
          { name: '결로 방지 히터', partNumber: 'AH-100', price: 45000 },
          { name: '도어 힌지', partNumber: 'DH-150', price: 38000 }
        ]
      }
    }
  })

  console.log('✓ Created equipment with checklist items and parts')

  // Create labor rates
  await prisma.laborRate.createMany({
    data: [
      { name: '부품교체(단순)', rate: 30000 },
      { name: '부품교체(복잡)', rate: 50000 },
      { name: '수리작업', rate: 40000 },
      { name: '정밀점검', rate: 25000 },
      { name: '세척/청소', rate: 20000 }
    ]
  })

  console.log('✓ Created labor rates')

  // Create travel rates
  await prisma.travelRate.createMany({
    data: [
      { distance: '10km 이내', rate: 20000 },
      { distance: '20km 이내', rate: 30000 },
      { distance: '30km 이내', rate: 40000 },
      { distance: '50km 이내', rate: 60000 },
      { distance: '50km 초과', rate: 80000 }
    ]
  })

  console.log('✓ Created travel rates')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
