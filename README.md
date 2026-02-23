# 🎲 Mock Data Generator

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

## 📝 소개 (About)

**Mock Data Generator**는 개발 및 테스트 환경을 구축할 때 필요한 **맞춤형 더미 데이터(Dummy Data)**를 브라우저에서 즉시 생성해 주는 도구입니다.

복잡하고 무거운 외부 라이브러리(`faker.js` 등)에 의존하지 않고 순수 Native JavaScript 로직만으로 가볍고 빠르게 동작하며, 생성된 데이터는 SQL `INSERT` 문이나 `JSON` 배열 형태로 간편하게 클립보드에 복사할 수 있습니다.

<br/>

## ✨ 주요 기능 (Features)

- **Zero-Dependency ⚡️:** 무거운 라이브러리 없이 자체 내장된 유틸리티 함수로 가볍게 구동됩니다.
- **디테일한 타입 설정 ⚙️:** PK(UUID/Number), Enum(목록형), Number(Min/Max 범위), Date 등 다양한 컬럼 옵션을 지원합니다.
- **멀티 포맷 내보내기 💾:** \* `SQL`: SQL Editor나 DBeaver에서 바로 실행 가능한 `INSERT` 문 제공
  - `JSON`: Postman, Swagger 등 API 테스트에서 바로 활용 가능한 배열 포맷 제공
- **안전한 이메일 생성 🛡️:** 실제 사용자에게 테스트 메일이 발송되는 사고를 막기 위해 표준 `@example.com` 도메인을 사용합니다.

<br/>

## 🛠 기술 스택 (Tech Stack)

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, Shadcn UI (Radix UI)
- **Testing:** Vitest

<br/>

## 🚀 시작하기 (Getting Started)

프로젝트를 로컬 환경에서 실행하는 방법입니다.

### 1. 요구 사항

- Node.js 22.x 이상
- npm 또는 pnpm

### 2. 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/choedo/mockstack.git

# 2. 프로젝트 폴더 진입
cd mockstack

# 3. 의존성 패키지 설치
npm install

# 4. 로컬 개발 서버 실행
npm run dev
```
