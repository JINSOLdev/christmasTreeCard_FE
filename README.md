# 🎄 Christmas Tree Card Service

> 따뜻한 연말 메시지를 트리에 걸어 함께 채워가는 작은 이벤트성 웹 서비스 입니다. </br>

---

## 카드 생성 플로우

<p align="center" width="100%">
  <video src="https://github.com/user-attachments/assets/f2c2bc29-80f9-46e5-bc9a-68766ce6355f" width="80%" controls></video>
</p>


---

## 프로젝트 소개

부트캠프 7개월 동안 함께한 동료들, 강사님, 운영진분들께 감사한 마음을 담아 만든 **크리스마스 카드 트리 서비스**입니다.

- 사용자가 작성한 카드가 **트리 위 오너먼트 형태로 나타나며 랜덤 위치에 배치**됩니다.
- 누구나 쉽게 **카드 작성 → 트리에서 확인** 할 수 있는 단순하고 따뜻한 서비스입니다.
- 함께 공부한 사람들에게 **작은 선물과 추억을 만들기 위한 이벤트**를 만들고 싶었습니다.
- 메세지가 쌓여갈수록 트리가 더 풍성해지는 시각적 재미를 전달하고 싶었습니다.
- 연말의 따뜻함을 담아 소통하기 위한 가벼운 웹 서비스를 제공하고 싶었습니다.

---

## 주요 기능

### 1. 카드 작성
- 받는 사람, 보내는 사람, 메시지를 입력하면 서버에 저장되고  
- 카드가 트리 오너먼트로 등장합니다.

### 2. 트리 보기
- 지금까지 모인 모든 카드들이 트리 위에 아이콘 형태로 표현됩니다.
- 좌표는 서버에서 랜덤으로 계산하는 방식으로 중복 생성 방지.

### 3. 카드 모아보기
- 작성된 카드들을 리스트 형태로 모아볼 수 있습니다.

---

## 기술 스택

### Backend 
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL

### Frontend
- Vue3

---

## 구현 중 겪은 문제 & 해결

### 1. 오너먼트가 중앙에만 몰리는 문제
문제 </br>
랜덤 좌표로 오너먼트를 배치했지만 트리 중앙에만 몰리고 양 옆 영역이 비는 문제가 발생 </br>

해결 </br>
트리의 형태(삼각형)를 고려하여 y값에 따라 x범위를 다르게 설정하는 방식으로 개선 </br>
```
function getTreeBoundsForY(y: number) {
  if (y < 24) return { minX: 46, maxX: 54 }
  if (y < 36) return { minX: 40, maxX: 60 }
  if (y < 50) return { minX: 34, maxX: 66 }
  if (y < 72) return { minX: 28, maxX: 72 }
  return { minX: 44, maxX: 56 }
}
```

결과 </br>
트리 전체 영역에 자연스럽게 오너먼트가 분포되도록 개선됨

### 2. 오너먼트 겹침 문제
문제 </br>
랜덤 배치 시 오너먼트가 서로 겹치는 현상이 발생함 </br>

해결 </br>
기존 좌표들과의 거리 계산을 통해 최소 거리 이상 떨어지도록 로직을 추가함 </br>
```
const MIN_DISTANCE = 8

function isTooClose(candidate, existing) {
  return existing.some(pos => {
    const dx = pos.x - candidate.x
    const dy = pos.y - candidate.y
    return Math.sqrt(dx * dx + dy * dy) < MIN_DISTANCE
  })
}
```

결과 </br>
오너먼트 간 충돌없이 균형 잡힌 UI를 구성할 수 있게됨

### 3. 오너먼트 이모지 표시 문제

문제 </br>
카드 리스트에서 오너먼트 타입이 DOLL, GIFT 같은 문자열로 표시되는 문제 발생함 </br>

원인 </br>
- BE : OrnamentType (대문자 enum)
- FE : 필터 및 UI에서 소문자 문자열 사용

해결 </br>
데이터 표현을 분리하여 관리함
- enum -> 이모지 매핑
- 필터 -> enum 변환 매핑
```
const ornamentEmojiByType = {
  GIFT: '🎁',
  DOLL: '🧸',
}

const filterToTypeMap = {
  gift: 'GIFT',
  doll: 'DOLL',
}
```

결과 </br>
UI와 API 간 데이터 불일치 문제 해결 및 유지보수성 향상됨

### 4. TypeScript 타입 에러 해결

문제 </br>
- string | undefined 타입 오류
- enum vs string 비교 오류
- 스타일 객체 타입 오류

해결 </br>
- 명확한 타입 분리 (OrnamentType, OrnamentFilter)
- optional 값 처리
- CSSProperties 타입 명시
```
const styleObject = computed<CSSProperties>(() => ({
  position: 'absolute',
  left: `${props.x}%`,
  top: `${props.y}%`,
}))
```

결과 </br>
타입 안정성 확보 및 런타임 오류 예방

### 5. 카드 모아보기 필터링 오류

문제 </br>
필터 버튼은 동작하지만 실제 카드 필터링이 적용되지 않음

해결 </br>
필터 값을 enum 값으로 변환 후 비교하도록 수정
```
const targetType = filterToTypeMap[ornamentFilter.value]

list = list.filter(card => card.ornamentType === targetType)
```

결과 </br>
필터 기능 정상 동작

### 6. 배포 환경 DB 초기 데이터 문제

문제 </br>
Render DB에는 초기 데이터(Seed)가 없어 카드 생성 시 에러 발생함 ```Tree not found for Slug```

해결 </br>
트리가 없으면 자동 생성하도록 로직 수정
```
let tree = await tx.tree.findFirst({ where: { slug } })

if (!tree) {
  tree = await tx.tree.create({
    data: {
      name: '2025 크리스마스 트리',
      slug,
    },
  })
}
```

결과 </br>
- seed 없이도 서비스 정상 동작
- 첫 카드 생성 시 트리 자동 생성

### 7. 트리 중복 생성 오류 (slug unique 에러)

문제 </br>
카드 생성 시 마다 트리를 생성하려고 하면서 slug 중복 에러 발생 ```Unique constraint filed on the fileds: ('slug')```

해결 </br>
- 기존의 upsert 방식 제거
- fine -> 없으면 create 구조로 변경

결과 </br>
트리 1개를 기준으로 카드가 정상적으로 누적 생성됨

---

## 회고 
- 단순히 UI를 구현하는 것을 넘어, 프론트엔드와 백엔드를 연결하여 하나의 서비스를 완성하는 전체 흐름을 경험할 수 있었던 작업이었다. 처음에는 단순히 카드를 트리에 걸어준다는 단순한 아이디어에서 시작했지만, 실제 구현과정에서는 좌표 계산, 데이터 구조 설계, API 연동, 배포 환경 등의 문제까지 다양한 이슈를 마주하게 되었다.</br>
- 특히 인상 깊었던 부분은 UI를 데이터로 제어해야 하는 순간들이었다. 오너먼트를 랜덤으로 배치했을 때 중앙에만 몰리거나 서로 겹치는 문제가 발생했는데, 이를 해결하기 위해 단순 랜덤이 아니라 트리의 형태를 고려한 좌표 계산과 거리 기반 충돌 방지 로직을 직접 설계해야 했다. 이 과정을 통해 보이는 UI도 결국은 데이터와 로직으로 제어된다는 점을 체감할 수 있었다.
- 또한 프론트와 백엔드 간의 데이터 정합성 문제도 중요한 경험이었다. 오너먼트 타입이 대문자 enum과 소문자 문자열로 나뉘어 있어 발생한 문제를 해결하면서, API 설계 단계에서부터 데이터 규칙을 명확히 정의하는 것이 얼마나 중요한지를 새삼 느꼈다. 단순히 화면에 보여주는 것이 아니라, 데이터의 표현과 흐름을 어떻게 일관되게 유지할 것인가에 대해 고민하게 된 계기였다.
- 배포 과정에서도 예상하지 못한 문제를 겪었다. Render 환경에서 seed 데이터를 사용할 수 없어 트리가 존재하지 않아 카드 생성이 실패했는데, 이를 통해 배포 환경에서는 데이터가 없는 상태를 기본으로 설계해야 한다는 점을 다시 한 번 체감했다. 이후 트리를 자동으로 생성하도록 로직을 수정하면서 서비스의 안정성을 높일 수 있었다.
- 그리고 함께 공부했던 동료들이 실제로 서비스를 이용해 크리스마스 카드를 작성하고, 트리가 점점 채워지는 모습을 보면서 내가 만든 서비스가 실제로 사용되고 있다는 점에서 큰 재미와 성취감을 느낄 수 있었다. 단순한 개인 프롲게트를 넘어, 사용자 경험이 있는 서비스로 확장된 순간이었다는 점에서 더욱 의미있는 작업이었다.
- 작은 프로젝트였지만, 실제 서비스처럼 동작하도록 만들면서 UI 로직 설계, 상태 관리, 타입 안정성, 배포 환경 대응 등의 전 과정을 경험할 수 있었다. 그 과젖ㅇ에서 당연하게 여겼던 부분들을 다시 점검하고, 보다 안정적인 구조를 고민하게 된 의미있는 작업이었다. 

## 향후 기능 추가 예정

- 카드 상세 페이지  
- 카드 템플릿 선택  
- 트리 여러 개 생성 및 선택 기능  
- 반응형 개선  
- 애니메이션 추가  

---

## 라이선스
MIT License

