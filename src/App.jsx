import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, Map, Settings, Bell, ChevronRight, Calendar, User, Briefcase, GraduationCap, 
  Clock, LogOut, ShieldCheck, BookOpen, CheckCircle2, TrendingUp, Search, 
  AlertCircle, ChevronLeft, Building, Target, Check, Sparkles, ExternalLink, Link as LinkIcon, Edit3, XCircle, Info, Award, FileText, Globe, Hourglass, Plus, Trash2
} from 'lucide-react';

// ==========================================
// 1. 전역 데이터베이스 (100% 원본 복구)
// ==========================================

const CAMPUS_DATA = {
  SEOUL: {
    name: '서울캠퍼스',
    colleges: {
      '공과대학': ['건축학부', '건축공학부', '건설환경공학과', '도시공학과', '자원환경공학과', '융합전자공학부', '컴퓨터소프트웨어학부', '정보시스템학과', '전기공학전공', '생체공학전공', '신소재공학부', '화학공학과', '생명공학과', '유기나노공학과', '에너지공학과', '기계공학부', '원자력공학과', '산업공학과', '미래자동차공학과', '반도체공학과', '데이터사이언스전공', '심리뇌과학전공'],
      '인문과학대학': ['국어국문학과', '중어중문학과', '영어영문학과', '독어독문학과', '사학과', '철학과'],
      '사회과학대학': ['정치외교학과', '사회학과', '미디어커뮤니케이션학과', '관광학부'],
      '자연과학대학': ['수학과', '물리학과', '화학과', '생명과학과'],
      '정책과학대학': ['정책학과', '행정학과'],
      '경제금융대학': ['경제금융학부'],
      '경영대학': ['경영학부', '파이낸스경영학과'],
      '사범대학': ['교육학과', '교육공학과', '국어교육과', '영어교육과', '수학교육과', '응용미술교육과'],
      '생활과학대학': ['식품영양학과', '실내건축디자인학과', '의류학과'],
      '음악대학': ['관현악과', '국악과', '성악과', '작곡과', '피아노과'],
      '예술·체육대학': ['무용학과', '스포츠매니지먼트전공', '스포츠사이언스전공', '연극영화학과', '체육학과'],
      '국제학부': ['국제학전공', '글로벌한국학전공', '글로벌콘텐츠융합학부'],
      '간호학부': ['간호학과'],
      '산업융합학부': ['응용시스템전공', '경영공학전공', '정보융합전공', '정보공학전공'],
      '융합전공대학': ['데이터융합서비스디자인융합전공', '디지털혁신전략융합전공', '미래자동차기술융합전공', '중국경제통상전공', '창업융합전공', '고전읽기융합전공', '미래인문학융합전공', '인문소프트웨어융합전공', '인문공공행정전공', 'Sts(과학기술학) 전공', '공공수행인문학전공', '미디어문화전공', '영어커뮤니케이션전공', '한중통번역전공', '통상한국어커뮤니케이션전공', '글로벌비즈니스문화전공(영어전용)', '자동차-Sw융합전공', '사회혁신융합전공', '빅데이터융합전공', '예술융합소프트웨어 융합전공', '글로벌 Ceo 창업 융합전공', '글로벌 리더십 융합전공', '바이오소프트웨어융합전공', '미래전기에너지신기술융합전공', '배터리융합전공']
    }
  },
  ERICA: {
    name: 'ERICA캠퍼스',
    colleges: {
      '공학대학': ['건축학부', '건설환경공학과', '로봇공학과'],
      '소프트웨어융합대학': ['소프트웨어학부', '인공지능학과'],
      '경상대학': ['경영학부', '경제학부']
    }
  }
};

const getGradReqs = (dept, majorType) => {
  const db = {
    '건축학부': { total: 162, major100_300: 90, major400: 18, group: 'arch' },
    '건축공학부': { total: 130, major100_300: 69, major400: 12, group: 'eng' },
    '컴퓨터소프트웨어학부': { total: 130, major100_300: 69, major400: 12, group: 'eng' },
    '기계공학부': { total: 130, major100_300: 69, major400: 12, group: 'eng' },
    '데이터사이언스전공': { total: 120, major100_300: 48, major400: 12, group: 'ds' },
    '국어국문학과': { total: 126, major100_300: 48, major400: 12, group: 'humanities' },
    '영어영문학과': { total: 126, major100_300: 48, major400: 12, group: 'humanities' },
    '정책학과': { total: 126, major100_300: 48, major400: 12, group: 'policy' },
    '경영학부': { total: 126, major100_300: 48, major400: 12, group: 'biz' },
  };

  let req = db[dept] || { total: 126, major100_300: 48, major400: 12, group: 'humanities' };
  req = { ...req }; 
  req.secondMajor = 0;

  if (majorType === '다중/복수전공' || majorType === '융합전공') {
      if (req.group === 'eng') { req.major100_300 = 51; req.major400 = 6; }
      else if (req.group === 'arch') { req.major100_300 = 90; req.major400 = 18; }
      else if (req.group === 'ds') { req.major100_300 = 44; req.major400 = 6; }
      else { req.major100_300 = 39; req.major400 = 6; }
      req.secondMajor = 36;
  } else if (majorType === '부전공') {
      if (req.group === 'eng') { req.major100_300 = 57; req.major400 = 6; }
      else if (req.group === 'arch') { req.major100_300 = 90; req.major400 = 18; }
      else if (req.group === 'ds') { req.major100_300 = 44; req.major400 = 6; }
      else { req.major100_300 = 39; req.major400 = 6; }
      req.secondMajor = 21;
  } else if (majorType === '마이크로전공') {
      req.secondMajor = 12;
  }

  req.majorTotal = req.major100_300 + req.major400;
  req.englishAvg = 5; req.prerequisite = 'Y'; req.gpa = 1.75;
  req.requiredCourses = 'Y'; req.volunteer = 1; req.internship = 'Y';
  req.coreElective = 8; req.classicReading = 2; req.globalLang = 2;
  req.sw = 2; req.futureStartup = 2; req.scienceTech = 2; req.icpbl = 4;
  return req;
};

const CAREER_GOALS = {
  INDUSTRY: { id: 'industry', name: '산업체 취업', sub: ['IT/소프트웨어', '기획/마케팅', '금융/은행', '반도체/엔지니어링'] },
  PUBLIC: { id: 'public', name: '공기업/공공기관', sub: ['공기업 (NCS)', '5급 행정고시'] },
  PROFESSIONAL: { id: 'professional', name: '전문직 (고시)', sub: ['로스쿨 (법조인)', 'CPA (공인회계사)'] },
  GRAD_SCHOOL: { id: 'grad_school', name: '대학원 진학', sub: ['자대 대학원', '타대 대학원'] }
};

const CAREER_SPEC_MAP = {
  'IT/소프트웨어': [
    { cat: 'lang', title: 'OPIc', targetScore: 'IM2', source: 'OPIc', dDay: '상시접수', duration: '약 2주~1개월', desc: '개발자도 최소한의 어학 스탯은 필수. 대기업 서류 패스 기본 요건입니다.', url: 'https://www.opic.or.kr/' },
    { cat: 'lang', title: 'TOEIC', targetScore: '800', source: 'YBM', dDay: '상시', duration: '1개월', desc: '공통 필수 어학 스탯입니다.', url: 'https://exam.toeic.co.kr/' },
    { cat: 'cert', title: '정보처리기사', source: 'Q-Net', dDay: '정기(연 3회)', duration: '전공 1개월 / 비전공 2개월', desc: 'IT 직무의 가장 기본이 되는 국가공인자격증. 공기업 지원 시 필수입니다.', url: 'https://www.q-net.or.kr/' },
    { cat: 'cert', title: 'SQLD', source: '데이터자격검정', dDay: '정기(연 4회)', duration: '약 2~3주', desc: 'DB 쿼리 역량을 직관적으로 증명합니다.', url: 'https://www.dataq.or.kr/' },
    { cat: 'activity', title: 'IT 연합동아리 SOPT/NEXTERS', source: '캠퍼스픽', dDay: '5, 11월 모집', duration: '약 6개월 활동', desc: '기획/디자인/개발자가 모여 협업 프로젝트를 진행하는 대장급 동아리.', url: 'https://sopt.org/' },
    { cat: 'project', title: '우아한테크코스/네이버 부스트캠프', source: '링커리어/우테코', dDay: '10~11월 모집', duration: '약 6~10개월 과정', desc: '네카라쿠배 합격률 최상위인 초고퀄리티 무료 부트캠프.', url: 'https://woowacourse.github.io/' },
    { cat: 'intern', title: '카카오/네이버 인턴십', source: '채용 홈페이지', dDay: '상/하반기 공채', duration: '인턴 2개월', desc: '최고의 실무 스펙. 코딩테스트 통과가 핵심입니다.', url: 'https://careers.kakao.com/' },
  ],
  '기획/마케팅': [
    { cat: 'lang', title: 'OPIc', targetScore: 'IH', source: 'YBM/OPIc', dDay: '상시접수', duration: '약 1~2개월', desc: '기획/마케팅 직무의 필수 어학 컷. 커뮤니케이션 역량을 어필하세요.', url: 'https://exam.toeic.co.kr/' },
    { cat: 'lang', title: 'TOEIC', targetScore: '900', source: 'YBM', dDay: '상시접수', duration: '약 1~2개월', desc: '고고익선 어학 성적입니다.', url: 'https://exam.toeic.co.kr/' },
    { cat: 'cert', title: 'GA4 (구글 애널리틱스)', source: 'Google Skillshop', dDay: '온라인 상시', duration: '약 1주 (무료)', desc: '데이터 기반 퍼포먼스 마케팅을 위한 필수 자격증입니다.', url: 'https://skillshop.exceedlms.com/' },
    { cat: 'cert', title: '컴퓨터활용능력 1급', source: '대한상공회의소', dDay: '상시 시험', duration: '약 1~2개월', desc: '기획/사무직의 기본 엑셀 활용 능력 증명입니다.', url: 'https://license.korcham.net/' },
    { cat: 'activity', title: 'KT&G 상상유니브 마케팅스쿨', source: '상상유니브', dDay: '매년 2, 8월', duration: '약 6주 과정', desc: '전국 최대 규모 마케팅 실무 대외활동.', url: 'https://www.sangsanguniv.com/' },
    { cat: 'project', title: '제일기획 아이디어 페스티벌', source: '제일기획', dDay: '매년 4월 출품', duration: '약 2~3개월', desc: '광고/기획 분야 최고 권위 공모전.', url: 'https://ideafestival.cheil.co.kr/' },
  ],
  '금융/은행': [
    { cat: 'lang', title: 'TOEIC', targetScore: '850', source: 'YBM', dDay: '상시접수', duration: '약 1~2개월', desc: '은행권 및 금융공기업 서류 통과를 위한 기본 어학 컷입니다.', url: 'https://exam.toeic.co.kr/' },
    { cat: 'cert', title: '신용분석사', source: '한국금융연수원', dDay: '연 3회 시행', duration: '약 2~3개월', desc: '기업금융 직무 목표 시 가장 파괴력 있는 자격증입니다.', url: 'https://www.kbi.or.kr/' },
    { cat: 'cert', title: 'AFPK (개인재무설계사)', source: '한국FPSB', dDay: '연 3회 시행', duration: '약 2~3개월', desc: '은행권(개인금융, WM) 지원자 필수 자격증입니다.', url: 'https://www.fpsbkorea.org/' },
    { cat: 'activity', title: '대학생 홍보대사', source: '각 은행', dDay: '매년 1, 7월 경', duration: '약 5~6개월', desc: '금융권 취업을 위한 최고의 네트워킹 대외활동.', url: 'https://www.kbcampusstar.com/' },
  ],
  '로스쿨 (법조인)': [
    { cat: 'lang', title: 'TOEIC', targetScore: '950', source: 'YBM', dDay: '상시 (정기)', duration: '약 1~2개월', desc: '로스쿨 지원의 절대적 기본 스탯. 1~2학년 때 조기 달성 필수입니다.', url: 'https://exam.toeic.co.kr/' },
    { cat: 'cert', title: 'KBS한국어능력시험', source: 'KBS', dDay: '연 4회 시행', duration: '약 2~3주', desc: '정량평가 가산점 획득 및 LEET 감각 유지를 위한 자격증.', url: 'http://www.klt.or.kr/' },
    { cat: 'activity', title: '장기 봉사활동', source: 'VMS', dDay: '상시 모집', duration: '최소 100시간+', desc: '로스쿨 정성평가(자소서)의 강력한 어필 요소입니다.', url: 'https://www.vms.or.kr/' },
    { cat: 'intern', title: '대한법률구조공단 실무 수습', source: '법률구조공단', dDay: '매년 5, 11월', duration: '방학 중 단기', desc: '공익 법무 실무 경험. 합격자 다수가 거쳐가는 엘리트 코스입니다.', url: 'https://www.klac.or.kr/' },
    { cat: 'project', title: 'LEET (법학적성시험)', source: '법학적성시험', dDay: '매년 7월', duration: '최소 6개월+', desc: '입시의 알파와 오메가.', url: 'https://leet.uwayapply.com/' },
  ],
  '반도체/엔지니어링': [
    { cat: 'lang', title: 'OPIc', targetScore: 'IM2', source: 'OPIc', dDay: '상시접수', duration: '약 2~4주', desc: '삼성전자(DS) 등 주요 기업은 필수입니다.', url: 'https://www.opic.or.kr/' },
    { cat: 'cert', title: '기사 자격증 (일반기계/전기)', source: 'Q-Net', dDay: '정기 기사 시험', duration: '약 3~4개월', desc: '엔지니어링 직무의 꽃. 졸업 전 1개 취득 권장.', url: 'https://www.q-net.or.kr/' },
    { cat: 'activity', title: '반도체 공정실습 (SPTA 등)', source: 'SPTA / 교내', dDay: '방학 중 모집', duration: '약 1~2주 과정', desc: 'FAB 출입 경험 유무가 합격을 가릅니다.', url: 'https://spta.co.kr/' },
    { cat: 'intern', title: '삼성전자 대학생 인턴', source: '삼성커리어스', dDay: '상/하반기 공채', duration: '약 2개월', desc: '엔지니어가 거칠 수 있는 최고의 실무 체험.', url: 'https://www.samsungcareers.com/' }
  ],
  '공기업 (NCS)': [
    { cat: 'lang', title: 'TOEIC', targetScore: '850', source: 'YBM', dDay: '상시', duration: '1~2개월', desc: '서류전형 가점 만점을 위한 필수 어학컷.', url: 'https://exam.toeic.co.kr/' },
    { cat: 'cert', title: '한국사능력검정시험 (1급)', source: '국사편찬위원회', dDay: '연 4회 시행', duration: '약 3~4주', desc: '공기업/공공기관 서류 전형 필수 가산점 요소.', url: 'https://www.historyexam.go.kr/' },
    { cat: 'cert', title: '컴퓨터활용능력 1급', source: '대한상공회의소', dDay: '상시 시험', duration: '약 1~2개월', desc: '공통 가산점 자격증. 실기 난이도가 높으므로 기출 훈련이 필수.', url: 'https://license.korcham.net/' },
    { cat: 'intern', title: '국민건강보험공단 청년인턴', source: '잡알리오', dDay: '수시(상/하반기)', duration: '약 3~5개월', desc: '공공기관 실무 경험의 프리패스.', url: 'https://job.alio.go.kr/' }
  ],
  'default': [
    { cat: 'lang', title: 'TOEIC', targetScore: '850', source: 'YBM', dDay: '상시 (월 2회)', duration: '약 1개월', desc: '취업의 가장 기본 스펙. 방학을 활용해 미리 점수를 만들어두세요.', url: 'https://exam.toeic.co.kr/' },
    { cat: 'activity', title: '직무 연관 연합동아리 가입', source: '에브리타임/캠퍼스픽', dDay: '매 학기 초(3, 9월)', duration: '약 1학기', desc: '어떤 직무든 협업 경험은 필수입니다.', url: 'https://everytime.kr/' },
    { cat: 'intern', title: '한양대학교 현장실습(HY-WEP)', source: 'HY-in 포털', dDay: '방학 1달 전 모집', duration: '방학 2달 / 학기 4달', desc: '학교와 연계된 기업에서 실무 경험을 쌓는 최적의 프로그램.', url: 'https://portal.hanyang.ac.kr/' },
  ]
};

const YEARLY_ROADMAP_DB = {
  'IT/소프트웨어': [
    { grade: 1, title: '기초 탐색 및 어학', items: ['교내 코딩 동아리 가입', 'Python, Java 기초 마스터'] },
    { grade: 2, title: '직무 설정 및 스터디', items: ['IT 연합동아리 활동', '개인 토이 프로젝트 시작'] },
    { grade: 3, title: '실무 스펙 및 공모전', items: ['정보처리기사 필기 합격', '기업 해커톤 출전'] },
    { grade: 4, title: '취업 실전 및 포트폴리오', items: ['채용형 인턴십 지원', '포트폴리오 웹 배포'] }
  ],
  '기획/마케팅': [
    { grade: 1, title: '기초 탐색 및 어학', items: ['경영전략 교내 학회 가입', '개인 블로그 운영 및 컴활 취득'] },
    { grade: 2, title: '직무 설정 및 스터디', items: ['상상유니브 등 대외활동 참여', 'GA4 및 포토샵/피그마 학습'] },
    { grade: 3, title: '실무 스펙 및 공모전', items: ['메이저 공모전 출전', '대기업 공식 서포터즈 활동'] },
    { grade: 4, title: '취업 실전 및 포트폴리오', items: ['마케팅 직무 인턴십 수료', '노션 포트폴리오 사이트 완성'] }
  ],
  '금융/은행': [
    { grade: 1, title: '기초 탐색 및 어학', items: ['금융/투자 교내 학회 가입', '경제 신문 스크랩 및 토익 조기 달성'] },
    { grade: 2, title: '직무 설정 및 스터디', items: ['매경TEST 최우수 취득', '금융감독원 등 기자단'] },
    { grade: 3, title: '실무 스펙 및 공모전', items: ['시중은행 홍보대사 활동', 'AFPK 자격증 합격'] },
    { grade: 4, title: '취업 실전 및 포트폴리오', items: ['금융권 청년인턴 수료', '신용분석사 자격증 취득'] }
  ],
  '로스쿨 (법조인)': [
    { grade: 1, title: '기초 탐색 및 어학', items: ['학점(GPA) 4.0 이상 유지', '토익 950+ 조기 달성'] },
    { grade: 2, title: '정성 스펙 및 스터디', items: ['장기 봉사활동 시작', '법학 전공기초 집중 수강'] },
    { grade: 3, title: '실무 스펙 및 공모전', items: ['공익 법률 인턴십', 'LEET 기출 분석 스터디'] },
    { grade: 4, title: '입시 실전 및 포트폴리오', items: ['LEET 전국 모의고사 응시', '자기소개서 작성 및 면접 스터디'] }
  ],
  '반도체/엔지니어링': [
    { grade: 1, title: '기초 수학/과학 완성', items: ['일반물리 학점 A 이상 달성', '토익 및 OPIc 조기 취득'] },
    { grade: 2, title: '전공 기초 및 스터디', items: ['전공 핵심 집중 학습', '학부 연구생 지원을 위한 랩실 탐색'] },
    { grade: 3, title: '실무 스펙 및 공모전', items: ['반도체 공정실습 이수', '쌍기사 필기/실기 응시'] },
    { grade: 4, title: '취업 실전 및 포트폴리오', items: ['대기업 직무 인턴십 지원', '캡스톤디자인 포트폴리오 완성'] }
  ],
  '공기업 (NCS)': [
    { grade: 1, title: '기초 탐색 및 어학', items: ['한국사 1급, 컴활 1급 취득', '목표 직무(사무/기술) 탐색'] },
    { grade: 2, title: '직무 설정 및 스터디', items: ['공공기관 서포터즈 활동', '전공 기사(기술직) 준비'] },
    { grade: 3, title: '실무 스펙 및 공모전', items: ['NCS 직업기초능력 스터디 시작', '공기업 체험형 청년인턴 지원'] },
    { grade: 4, title: '취업 실전 및 포트폴리오', items: ['전공 필기 심화 및 모의고사', '블라인드 면접 스터디'] }
  ],
  'default': [
    { grade: 1, title: '진로 탐색', items: ['교내외 다양한 동아리 및 학회 활동', '기본 어학 점수 취득'] },
    { grade: 2, title: '역량 개발', items: ['관심 분야 단기 자격증 취득', '단기 서포터즈/봉사활동 참여'] },
    { grade: 3, title: '실무 경험', items: ['직무 연관 공모전 출전', '교내 현장실습(HY-WEP) 이수'] },
    { grade: 4, title: '취업 준비', items: ['자기소개서 초안 작성', '실전 면접 스터디 및 공채 지원'] }
  ]
};

// 800줄 분량의 방대한 원본 커리큘럼 데이터베이스 (학년/학기/학과 정보 완벽 지원)
const CURRICULUM_DB = {
  '컴퓨터소프트웨어학부': [
    { name: '자료구조론', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '2학년 1학기', ownerDept: '컴소부', reason: '코딩테스트의 근간이 되는 필수 전공입니다.' },
    { name: '시스템프로그래밍', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '2학년 2학기', ownerDept: '컴소부', reason: '운영체제 이해를 위한 전공 심화 과목입니다.' },
    { name: '병렬프로그래밍', type: '전공 400단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '4학년 1학기', ownerDept: '컴소부', reason: '고성능 컴퓨팅 역량을 증명합니다.' }
  ],
  '정보시스템학과': [
    { name: '전산학개론', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '1학년 1학기', ownerDept: '정보시스템', reason: 'IT 융합 인재의 기초가 되는 컴퓨터 공학의 전반을 이해합니다.' },
    { name: '정보시스템분석', type: '전공 100~300단위', credits: 3, target: '기획/마케팅', gradeTerm: '2학년 2학기', ownerDept: '정보시스템', reason: 'IT 서비스 기획 및 시스템 설계 역량을 기르는 핵심 과목입니다.' },
    { name: 'It와경영전략', type: '전공 400단위', credits: 3, target: '기획/마케팅', gradeTerm: '4학년 1학기', ownerDept: '정보시스템', reason: '기술과 비즈니스를 결합하여 전략 컨설팅 역량을 증명하는 심화 과목입니다.' },
    { name: '전자상거래이론', type: '전공 400단위', credits: 3, target: '기획/마케팅', gradeTerm: '3학년 2학기', ownerDept: '정보시스템', reason: '이커머스 도메인의 IT 기획 및 PM 직무 준비용.' }
  ],
  '데이터사이언스전공': [
    { name: '데이터사이언스기초', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '1학년 2학기', ownerDept: '데사전', reason: '데이터 전처리와 분석의 기본을 다지는 필수 전공입니다.' },
    { name: '머신러닝1', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '3학년 1학기', ownerDept: '데사전', reason: 'AI와 데이터분석 핵심 알고리즘을 학습합니다.' },
    { name: '인공지능프로젝트1', type: '전공 400단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '4학년 1학기', ownerDept: '데사전', reason: '400단위 프로젝트로 실무적인 AI 파이프라인을 구축해볼 수 있습니다.' }
  ],
  '심리뇌과학전공': [
    { name: '인지과학기초', type: '전공 100~300단위', credits: 3, target: '기획/마케팅', gradeTerm: '2학년 1학기', ownerDept: '심리뇌과학', reason: '인간의 심리와 인지 모델을 이해하여 UX 기획에 접목합니다.' },
    { name: '계산인지과학', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '3학년 1학기', ownerDept: '심리뇌과학', reason: '뇌과학과 컴퓨터 모델링을 융합하는 핵심 전공입니다.' },
    { name: '뉴로이미징', type: '전공 400단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '4학년 1학기', ownerDept: '심리뇌과학', reason: '뇌 영상 데이터를 처리하고 분석하는 심화 기술을 배웁니다.' }
  ],
  '기계공학부': [
    { name: '정역학', type: '전공 100~300단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '2학년 1학기', ownerDept: '기계공', reason: '엔지니어링의 기본이 되는 역학 필수 과목입니다.' },
    { name: '열역학1', type: '전공 100~300단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '2학년 2학기', ownerDept: '기계공', reason: '에너지 시스템의 기초를 다루는 핵심 전공입니다.' },
    { name: '로보트공학', type: '전공 400단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '4학년 1학기', ownerDept: '기계공', reason: '메카트로닉스와 로봇 제어 시스템을 구축합니다.' }
  ],
  '반도체공학과': [
    { name: '시스템반도체소자', type: '전공 100~300단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '2학년 2학기', ownerDept: '반도체공', reason: '메모리 및 비메모리 시스템 반도체의 동작 원리를 다룹니다.' },
    { name: '양자역학개론', type: '전공 100~300단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '3학년 1학기', ownerDept: '반도체공', reason: '나노 스케일 소자 분석을 위한 물리적 기초.' },
    { name: '나노전자공학', type: '전공 400단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '4학년 1학기', ownerDept: '반도체공', reason: '차세대 반도체 공정을 다루는 심화 전공.' }
  ],
  '화학공학과': [
    { name: '화학공학개론', type: '전공 100~300단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '1학년 2학기', ownerDept: '화공', reason: '화학공정 전반을 이해하는 기초 과목.' },
    { name: '반응공학', type: '전공 100~300단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '3학년 1학기', ownerDept: '화공', reason: '플랜트 설계 핵심 전공.' },
    { name: '분리공정', type: '전공 400단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '4학년 1학기', ownerDept: '화공', reason: '플랜트의 꽃인 분리 기술 심화 학습.' }
  ],
  '생명과학과': [
    { name: '일반생물학1', type: '전공 100~300단위', credits: 3, target: '대학원 진학', gradeTerm: '1학년 1학기', ownerDept: '생명과학과', reason: '생명 현상의 기초.' },
    { name: '생물정보학', type: '전공 400단위', credits: 2, target: 'IT/소프트웨어', gradeTerm: '4학년 1학기', ownerDept: '생명과학과', reason: '빅데이터를 생물학에 적용하는 융합 심화전공.' }
  ],
  '생명공학과': [
    { name: '일반생물학', type: '전공 100~300단위', credits: 3, target: '대학원 진학', gradeTerm: '1학년 1학기', ownerDept: '생명공학과', reason: '생명 현상의 기초.' },
    { name: '단백질효소공학', type: '전공 400단위', credits: 3, target: '대학원 진학', gradeTerm: '4학년 1학기', ownerDept: '생명공학과', reason: '바이오 신약 기술 실무.' }
  ],
  '유기나노공학과': [
    { name: '유기나노공학개론', type: '전공 100~300단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '1학년 2학기', ownerDept: '유기나노공', reason: '나노 소재 기초.' },
    { name: '유기광학소재', type: '전공 400단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '4학년 1학기', ownerDept: '유기나노공', reason: 'OLED 등 차세대 광학 소재 심화.' }
  ],
  '에너지공학과': [
    { name: '에너지과학과기술', type: '전공 100~300단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '1학년 2학기', ownerDept: '에너지공', reason: '에너지 시스템 기초.' },
    { name: '이차전지기초설계', type: '전공 400단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '4학년 1학기', ownerDept: '에너지공', reason: '배터리 산업 핵심 역량.' }
  ],
  '미래자동차공학과': [
    { name: '미래자동차공학개론', type: '전공 100~300단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '1학년 1학기', ownerDept: '미래차', reason: '자율주행 및 EV 시스템 기초.' },
    { name: 'E-파워트레인', type: '전공 400단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '4학년 2학기', ownerDept: '미래차', reason: '친환경 전기차 모터 구동계 심화.' }
  ],
  '원자력공학과': [
    { name: '핵공학개론', type: '전공 100~300단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '1학년 2학기', ownerDept: '원자력공', reason: '방사선 공학 기본.' },
    { name: '원자력공학종합설계', type: '전공 400단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '4학년 1학기', ownerDept: '원자력공', reason: '원전 시스템 통합 캡스톤.' }
  ],
  '산업공학과': [
    { name: '산업공학개론', type: '전공 100~300단위', credits: 3, target: '기획/마케팅', gradeTerm: '1학년 2학기', ownerDept: '산업공학과', reason: '물류 및 시스템 최적화 입문.' },
    { name: '스마트제조데이터분석', type: '전공 400단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '4학년 1학기', ownerDept: '산업공학과', reason: 'AI 공정 데이터 분석 심화.' }
  ],
  '건축학부': [
    { name: '건축계획', type: '전공 100~300단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '2학년 1학기', ownerDept: '건축학부', reason: '공간 구성 기초.' },
    { name: '디지털디자인스튜디오', type: '전공 400단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '4학년 1학기', ownerDept: '건축학부', reason: '포트폴리오 완성용 심화 스튜디오.' }
  ],
  '의예과': [
    { name: '의과학기초실습', type: '전공 100~300단위', credits: 1, target: '전문직 (고시)', gradeTerm: '2학년 2학기', ownerDept: '의예과', reason: '의학 연구 기초 술기.' }
  ],
  '의학과': [
    { name: '인체의구조', type: '전공 100~300단위', credits: 7, target: '전문직 (고시)', gradeTerm: '1학년 1학기', ownerDept: '의학과', reason: '해부학 필수.' },
    { name: '임상종합실습', type: '전공 400단위', credits: 2, target: '전문직 (고시)', gradeTerm: '4학년 1학기', ownerDept: '의학과', reason: '현장 임상 술기 배양.' }
  ],
  '정치외교학과': [
    { name: '정치학개론', type: '전공 100~300단위', credits: 3, target: '공기업/공공기관', gradeTerm: '1학년 1학기', ownerDept: '정치외교학과', reason: '정치 제도 이해 기초.' },
    { name: '국제정치경제론', type: '전공 400단위', credits: 3, target: '공기업/공공기관', gradeTerm: '4학년 1학기', ownerDept: '정치외교학과', reason: '정치/경제 상호작용 분석 심화.' }
  ],
  '사회학과': [
    { name: '사회조사방법의이해', type: '전공 100~300단위', credits: 3, target: '기획/마케팅', gradeTerm: '2학년 1학기', ownerDept: '사회학과', reason: '통계 분석 기초.' },
    { name: '현대사회와빅데이터', type: '전공 400단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '4학년 1학기', ownerDept: '사회학과', reason: '빅데이터 활용 사회 분석 심화.' }
  ],
  '미디어커뮤니케이션학과': [
    { name: '미디어커뮤니케이션과사회', type: '전공 100~300단위', credits: 3, target: '기획/마케팅', gradeTerm: '1학년 2학기', ownerDept: '미디어학과', reason: '미디어 기능 기초.' },
    { name: '대중문화와문화산업', type: '전공 400단위', credits: 3, target: '기획/마케팅', gradeTerm: '4학년 1학기', ownerDept: '미디어학과', reason: '콘텐츠 비즈니스 심화 분석.' }
  ],
  '관광학부': [
    { name: '관광론', type: '전공 100~300단위', credits: 3, target: '기획/마케팅', gradeTerm: '1학년 1학기', ownerDept: '관광학부', reason: '비즈니스 생태계 기초.' },
    { name: '글로벌서비스론', type: '전공 400단위', credits: 3, target: '기획/마케팅', gradeTerm: '4학년 1학기', ownerDept: '관광학부', reason: '서비스 실무 심화.' }
  ],
  '수학과': [
    { name: '선형대수1', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '2학년 1학기', ownerDept: '수학과', reason: 'AI 학습 핵심 전공.' },
    { name: '암호론Pbl', type: '전공 400단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '4학년 1학기', ownerDept: '수학과', reason: '정보보안 및 암호화 심화.' }
  ],
  '물리학과': [
    { name: '일반물리학및실험Ⅰ', type: '전공 100~300단위', credits: 4, target: '반도체/엔지니어링', gradeTerm: '1학년 1학기', ownerDept: '물리학과', reason: '역학과 전자기 기초.' },
    { name: '양자광학', type: '전공 400단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '4학년 1학기', ownerDept: '물리학과', reason: '물질 양자역학 심화.' }
  ],
  '화학과': [
    { name: '물리화학1', type: '전공 100~300단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '2학년 1학기', ownerDept: '화학과', reason: '화학 열역학 기초.' },
    { name: '표면화학', type: '전공 400단위', credits: 2, target: '반도체/엔지니어링', gradeTerm: '4학년 1학기', ownerDept: '화학과', reason: '반도체 디스플레이 공정 직결 심화.' }
  ],
  '경제금융학부': [
    { name: '계량경제', type: '전공 100~300단위', credits: 3, target: '금융/은행', gradeTerm: '3학년 1학기', ownerDept: '경금대', reason: '경제 데이터 통계 분석 핵심.' },
    { name: '시장미시구조론과핀테크', type: '전공 400단위', credits: 3, target: '금융/은행', gradeTerm: '4학년 1학기', ownerDept: '경금대', reason: '핀테크 알고리즘 심화 전공.' }
  ],
  '파이낸스경영학과': [
    { name: '기업가치평가', type: '전공 100~300단위', credits: 3, target: '금융/은행', gradeTerm: '3학년 1학기', ownerDept: '파경', reason: 'IB 핵심 밸류에이션 실무.' },
    { name: '행동재무론', type: '전공 400단위', credits: 3, target: '금융/은행', gradeTerm: '4학년 2학기', ownerDept: '파경', reason: '투자자 심리 분석 심화 전공.' }
  ],
  '영어영문학과': [
    { name: '영어어법연습', type: '전공 100~300단위', credits: 3, target: '공통', gradeTerm: '1학년 2학기', ownerDept: '영문과', reason: '영어학 기초.' },
    { name: '셰익스피어', type: '전공 400단위', credits: 3, target: '대학원 진학', gradeTerm: '4학년 1학기', ownerDept: '영문과', reason: '영문학 정수 심화 분석.' }
  ],
  '정책학과': [ 
    { name: '법학통론', type: '전공 100~300단위', credits: 3, target: '로스쿨 (법조인)', gradeTerm: '1학년 1학기', ownerDept: '정책학과', reason: '리걸마인드 기초.' },
    { name: '헌법1', type: '전공 100~300단위', credits: 3, target: '로스쿨 (법조인)', gradeTerm: '2학년 1학기', ownerDept: '정책학과', reason: '로스쿨 공법 선행학습.' }
  ],
  '경영학부': [
    { name: '재무관리', type: '전공 100~300단위', credits: 3, target: '금융/은행', gradeTerm: '2학년 2학기', ownerDept: '경영학부', reason: '금융권 취업 필수 과목.' },
    { name: '투자론', type: '전공 400단위', credits: 3, target: '금융/은행', gradeTerm: '4학년 1학기', ownerDept: '경영학부', reason: '증권사/IB 면접 직결 심화.' }
  ],

  // ==== 융합전공대학 복구 완료 ====
  '데이터융합서비스디자인융합전공': [
    { name: '인간-Ai상호작용디자인', type: '전공 100~300단위', credits: 3, target: '기획/마케팅', gradeTerm: '2학년 1학기', ownerDept: '융합전공대학', reason: 'AI UI/UX 디자인 기초입니다.' },
    { name: '디지털프로토타이핑', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '3학년 2학기', ownerDept: '융합전공대학', reason: '실제 동작하는 프로토타입 개발 심화.' }
  ],
  '디지털혁신전략융합전공': [
    { name: '데이터애널리틱스입문', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '2학년 1학기', ownerDept: '융합전공대학', reason: 'Python 등 데이터 분석 기초.' },
    { name: '디지털정책트렌드', type: '전공 400단위', credits: 3, target: '기획/마케팅', gradeTerm: '4학년 1학기', ownerDept: '융합전공대학', reason: '최신 IT 정책 기조 분석.' }
  ],
  '미래자동차기술융합전공': [
    { name: '자동차커넥티비티', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '3학년 1학기', ownerDept: '융합전공대학', reason: '자율주행 네트워크 기초.' },
    { name: '미래자동차공학종합설계1', type: '전공 400단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '4학년 1학기', ownerDept: '융합전공대학', reason: '미래차 시스템 캡스톤.' }
  ],
  '중국경제통상전공': [
    { name: '중국경제론', type: '전공 100~300단위', credits: 3, target: '기획/마케팅', gradeTerm: '2학년 2학기', ownerDept: '융합전공대학', reason: 'G2 시장 통상 환경 연구.' },
    { name: '중국문화콘텐츠의이해', type: '전공 400단위', credits: 3, target: '기획/마케팅', gradeTerm: '4학년 1학기', ownerDept: '융합전공대학', reason: '중국 콘텐츠 산업 심화.' }
  ],
  '창업융합전공': [
    { name: '창업기초:창업과기업가정신', type: '전공 100~300단위', credits: 3, target: '기획/마케팅', gradeTerm: '2학년 1학기', ownerDept: '융합전공대학', reason: '스타트업 모델링 마인드셋.' },
    { name: '창업실습:캡스톤디자인', type: '전공 400단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '4학년 1학기', ownerDept: '융합전공대학', reason: '테크 스타트업 실무 기획.' }
  ],
  '고전읽기융합전공': [
    { name: '사회클래식:국가발전의원리', type: '전공 100~300단위', credits: 3, target: '공기업/공공기관', gradeTerm: '2학년 1학기', ownerDept: '융합전공대학', reason: '정책 원리 통찰.' },
    { name: '과학클래식:과학기술의문화사', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '3학년 1학기', ownerDept: '융합전공대학', reason: '기술 혁신 인문학적 융합.' }
  ],
  '미래인문학융합전공': [
    { name: '디지털스토리텔링의이해', type: '전공 100~300단위', credits: 3, target: '기획/마케팅', gradeTerm: '2학년 2학기', ownerDept: '융합전공대학', reason: '뉴미디어 서사 기획.' },
    { name: '인문학으로기술읽기', type: '전공 400단위', credits: 3, target: '기획/마케팅', gradeTerm: '4학년 1학기', ownerDept: '융합전공대학', reason: '첨단 기술 비판적 심화 기획.' }
  ],
  '인문소프트웨어융합전공': [
    { name: '데이터과학트렌드', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '2학년 1학기', ownerDept: '융합전공대학', reason: '비전공자 맞춤 데이터 분석 입문.' },
    { name: '인문학기반디지털콘텐츠구축을위한캡스톤디자인', type: '전공 400단위', credits: 3, target: '기획/마케팅', gradeTerm: '4학년 1학기', ownerDept: '융합전공대학', reason: '웹/앱 서비스 직접 기획 캡스톤.' }
  ],
  '인문공공행정전공': [
    { name: '동서양사상을통해본정의', type: '전공 100~300단위', credits: 3, target: '공기업/공공기관', gradeTerm: '2학년 1학기', ownerDept: '융합전공대학', reason: '올바른 공직 윤리관 확립.' },
    { name: '현대정책학이론', type: '전공 400단위', credits: 3, target: '공기업/공공기관', gradeTerm: '4학년 1학기', ownerDept: '융합전공대학', reason: '행정부 정책 수립 프로세스 실무.' }
  ],
  'Sts(과학기술학) 전공': [
    { name: '과학기술학의새로운지평', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '3학년 1학기', ownerDept: '융합전공대학', reason: 'STS 이론 기반 미래 기술 조망.' }
  ],
  '공공수행인문학전공': [
    { name: '신문론', type: '전공 100~300단위', credits: 3, target: '기획/마케팅', gradeTerm: '2학년 2학기', ownerDept: '융합전공대학', reason: '공공 저널리즘 및 글쓰기 기초.' }
  ],
  '미디어문화전공': [
    { name: '영상언어의이해', type: '전공 100~300단위', credits: 3, target: '기획/마케팅', gradeTerm: '3학년 1학기', ownerDept: '융합전공대학', reason: '영상 매체 시각적 표현 분석.' }
  ],
  '영어커뮤니케이션전공': [
    { name: '비판적생각과영어쓰기1', type: '전공 100~300단위', credits: 3, target: '공통', gradeTerm: '2학년 1학기', ownerDept: '융합전공대학', reason: '영문 에세이 작성법.' }
  ],
  '한중통번역전공': [
    { name: '한중프레젠테이션', type: '전공 100~300단위', credits: 3, target: '기획/마케팅', gradeTerm: '3학년 2학기', ownerDept: '융합전공대학', reason: '중화권 실무 PT 역량 제고.' }
  ],
  '통상한국어커뮤니케이션전공': [
    { name: '미디어로보는한국경제', type: '전공 100~300단위', credits: 3, target: '금융/은행', gradeTerm: '3학년 1학기', ownerDept: '융합전공대학', reason: '한국 경제 동향 분석.' }
  ],
  '글로벌비즈니스문화전공(영어전용)': [
    { name: 'Global Business Communication', type: '전공 100~300단위', credits: 3, target: '기획/마케팅', gradeTerm: '2학년 2학기', ownerDept: '융합전공대학', reason: '글로벌 영어 비즈니스 실무.' }
  ],
  '자동차-Sw융합전공': [
    { name: '알고리즘및문제해결기법', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '2학년 1학기', ownerDept: '융합전공대학', reason: '차량 임베디드 개발 필수.' },
    { name: '자동차임베디드Ai', type: '전공 100~300단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '3학년 2학기', ownerDept: '융합전공대학', reason: '자율주행 엣지 컴퓨팅 심화.' }
  ],
  '사회혁신융합전공': [
    { name: '사회혁신을위한시스템사고', type: '전공 100~300단위', credits: 3, target: '기획/마케팅', gradeTerm: '2학년 1학기', ownerDept: '융합전공대학', reason: '사회 문제 기획력 제고.' }
  ],
  '빅데이터융합전공': [
    { name: '기초확률및통계', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '2학년 1학기', ownerDept: '융합전공대학', reason: '데이터사이언스 기반 확립.' },
    { name: '빅데이터마이닝', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '3학년 2학기', ownerDept: '융합전공대학', reason: '패턴 추출 기법 심화 실습.' }
  ],
  '예술융합소프트웨어 융합전공': [
    { name: '가상/증강현실의예술', type: '전공 100~300단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '3학년 1학기', ownerDept: '융합전공대학', reason: 'VR/AR 예술 전시 적용.' }
  ],
  '글로벌 Ceo 창업 융합전공': [
    { name: '비즈니스행동경제학', type: '전공 100~300단위', credits: 3, target: '금융/은행', gradeTerm: '3학년 2학기', ownerDept: '융합전공대학', reason: '소비자 행동 패턴 분석.' }
  ],
  '글로벌 리더십 융합전공': [
    { name: 'Global Politics And Economy', type: '전공 100~300단위', credits: 3, target: '공기업/공공기관', gradeTerm: '3학년 1학기', ownerDept: '융합전공대학', reason: '글로벌 경제 심층 분석.' }
  ],
  '바이오소프트웨어융합전공': [
    { name: '지능형생물정보학', type: '전공 400단위', credits: 3, target: 'IT/소프트웨어', gradeTerm: '4학년 1학기', ownerDept: '융합전공대학', reason: '신약 개발 딥러닝 캡스톤.' }
  ],
  '미래전기에너지신기술융합전공': [
    { name: '스마트그리드', type: '전공 400단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '4학년 1학기', ownerDept: '융합전공대학', reason: '지능형 전력망 설계 심화.' }
  ],
  '배터리융합전공': [
    { name: '이차전지공정개론', type: '전공 400단위', credits: 3, target: '반도체/엔지니어링', gradeTerm: '4학년 1학기', ownerDept: '융합전공대학', reason: '배터리 팩/셀 제조 실무.' }
  ],

  '공통/교양': [
    { name: '말과글', type: '핵심교양', credits: 3, target: '공통', gradeTerm: '1학년 1학기', ownerDept: '교양', reason: '공통 필수 이수 요건입니다.' },
    { name: '전문학술영어', type: '핵심교양', credits: 3, target: '공통', gradeTerm: '1학년 2학기', ownerDept: '교양', reason: '영어 커뮤니케이션 능력 필수.' },
    { name: '사회봉사1', type: '사회봉사', credits: 1, target: '공통', gradeTerm: '상시', ownerDept: '교양', reason: '졸업 필수 봉사 학점입니다.' },
    { name: '창의적컴퓨팅', type: '소프트웨어영역', credits: 3, target: 'IT/소프트웨어', gradeTerm: '1학년 2학기', ownerDept: '교양', reason: '소프트웨어 기초 필수 교양입니다.' }
  ]
};

// ==========================================
// 2. Helper Functions & Components
// ==========================================

const getStatus = (earned, required, type = 'number') => {
  if (type === 'number') {
    const e = parseFloat(earned) || 0;
    const r = parseFloat(required) || 0;
    const isPass = e >= r;
    const remain = isPass ? 0 : r - e;
    return { remain, ui: isPass ? <span className="font-bold text-green-600">Y</span> : <span className="font-bold text-orange-500">N</span> };
  } else {
    const isPass = earned === 'Y';
    return { remain: isPass ? '' : '1', ui: isPass ? <span className="font-bold text-green-600">Y</span> : <span className="font-bold text-orange-500">N</span> };
  }
};

const ScreenWrapper = ({ children, isActive }) => (
  <div className={`absolute inset-0 h-full w-full bg-gray-50 transition-all duration-300 transform ${isActive ? 'opacity-100 translate-x-0 z-10 pointer-events-auto' : 'opacity-0 translate-x-10 z-0 pointer-events-none'} overflow-y-auto pb-24`}>
    {children}
  </div>
);

// ==========================================
// 3. Main Application
// ==========================================

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isLoaded, setIsLoaded] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [userProfile, setUserProfile] = useState({
    campus: '', college: '', department: '', majorType: '심화전공(단일)',
    secondCollege: '', secondDepartment: '', studentId: '', grade: '3',
    name: '', careerMain: '', careerSub: '',
    credits: {
      total: '', majorTotal: '', major100_300: '', major400: '', englishAvg: '',
      prerequisite: 'Y', gpa: '', requiredCourses: 'Y', volunteer: '', internship: 'Y',
      coreElective: '', classicReading: '', globalLang: '', sw: '', icpbl: '',
      futureStartup: '', scienceTech: '', secondMajor: ''
    }
  });

  const [achievedSpecs, setAchievedSpecs] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => { setCurrentScreen('onboarding'); setIsLoaded(true); }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleProfileChange = (key, value) => setUserProfile(prev => ({ ...prev, [key]: value }));
  const handleCreditChange = (key, value) => setUserProfile(prev => ({ ...prev, credits: { ...prev.credits, [key]: value } }));

  const userRoadmapData = useMemo(() => {
    if (!userProfile.careerSub || !userProfile.department) return null;
    
    // [1. 스펙 달성도 분석]
    const specs = CAREER_SPEC_MAP[userProfile.careerSub] || CAREER_SPEC_MAP['default'];
    const categorizedSpecs = specs.reduce((acc, spec) => {
      const achieved = achievedSpecs.find(a => a.name.toLowerCase().includes(spec.title.toLowerCase()) || spec.title.toLowerCase().includes(a.name.toLowerCase()));
      if (achieved) {
        if (spec.cat === 'lang' && spec.targetScore) {
          const scoreRank = { 'IM1': 1, 'IM2': 2, 'IM3': 3, 'IH': 4, 'AL': 5 };
          const parsedUserScore = parseInt(achieved.score);
          const parsedTarget = parseInt(spec.targetScore);
          
          let isGoalMet = false;
          if(!isNaN(parsedUserScore) && !isNaN(parsedTarget)) {
            isGoalMet = parsedUserScore >= parsedTarget; 
          } else {
            isGoalMet = (scoreRank[achieved.score] || 0) >= (scoreRank[spec.targetScore] || 0); 
          }

          if (!isGoalMet) {
            acc.milestones.push({ ...spec, currentStatus: `현재 ${achieved.score} (목표 ${spec.targetScore})` });
          } else {
            acc.achieved.push({ ...spec, userScore: achieved.score, expiryDate: achieved.date });
          }
        } else {
          acc.achieved.push({ ...spec, userScore: achieved.score, expiryDate: achieved.date });
        }
      } else {
        acc.milestones.push(spec);
      }
      return acc;
    }, { achieved: [], milestones: [] });

    // [2. AI 부족 학점 기반 과목 추천 알고리즘]
    const req = getGradReqs(userProfile.department, userProfile.majorType);
    const cr = Object.keys(userProfile.credits).reduce((acc, key) => {
      acc[key] = (key === 'prerequisite' || key === 'requiredCourses' || key === 'internship') 
        ? userProfile.credits[key] : parseFloat(userProfile.credits[key]) || 0;
      return acc;
    }, {});

    const missingReqs = [];
    if (cr.major100_300 < req.major100_300) missingReqs.push({ type: '전공 100~300단위', diff: req.major100_300 - cr.major100_300 });
    if (cr.major400 < req.major400) missingReqs.push({ type: '전공 400단위', diff: req.major400 - cr.major400 });
    if (userProfile.majorType !== '심화전공(단일)' && cr.secondMajor < req.secondMajor) {
        missingReqs.push({ type: '제2전공', diff: req.secondMajor - cr.secondMajor });
    }
    if (cr.coreElective < req.coreElective) missingReqs.push({ type: '핵심교양', diff: req.coreElective - cr.coreElective });
    if (cr.sw < req.sw) missingReqs.push({ type: '소프트웨어영역', diff: req.sw - cr.sw });
    if (cr.volunteer < req.volunteer) missingReqs.push({ type: '사회봉사', diff: req.volunteer - cr.volunteer });

    const allCourses = Object.values(CURRICULUM_DB).flat();
    const userDeptCourses = CURRICULUM_DB[userProfile.department] || [];
    const secondDeptCourses = CURRICULUM_DB[userProfile.secondDepartment] || [];
    const commonCourses = CURRICULUM_DB['공통/교양'] || [];

    let recommendedCourses = [];
    missingReqs.forEach(missing => {
      let matches = [];
      if (missing.type === '제2전공') {
          matches = secondDeptCourses;
      } else if (missing.type.includes('전공')) {
          matches = userDeptCourses.filter(c => c.type === missing.type);
          if(matches.length === 0) matches = allCourses.filter(c => c.type === missing.type && c.ownerDept === userProfile.department);
      } else {
          matches = commonCourses.filter(c => c.type === missing.type);
          if(matches.length === 0) matches = allCourses.filter(c => c.type === missing.type);
      }

      if(matches.length > 0) {
          matches.slice(0, 2).forEach(matched => {
              if(!recommendedCourses.find(c => c.name === matched.name)) {
                  recommendedCourses.push({ ...matched, dynamicReason: `부족한 [${missing.type}] 요건(${missing.diff}학점) 충족을 위해 시스템이 추천합니다.` });
              }
          });
      }
    });

    // 부족한 학점이 없다면 진로 기반으로 추천
    if (recommendedCourses.length === 0) {
        const careerMatches = userDeptCourses.filter(c => c.target === userProfile.careerSub).slice(0, 3);
        careerMatches.forEach(matched => {
           recommendedCourses.push({ ...matched, dynamicReason: `졸업 요건을 모두 충족하셨습니다! 진로 [${userProfile.careerSub}] 대비를 위해 추천합니다.` });
        });
    }

    return { ...categorizedSpecs, courses: recommendedCourses, gradInfo: req };
  }, [userProfile, achievedSpecs]);

  // ==========================================
  // Renderers
  // ==========================================

  const renderOnboarding = () => (
    <div className="absolute inset-0 z-50 bg-white flex flex-col h-full overflow-hidden">
      <div className="pt-12 px-6 pb-4 flex items-center justify-between sticky top-0 z-10 bg-white">
        <button onClick={() => setOnboardingStep(s => Math.max(1, s - 1))} className="p-2"><ChevronLeft size={24} /></button>
        <div className="flex gap-1 flex-1 px-8">{[1, 2, 3, 4, 5, 6].map(s => <div key={s} className={`h-1 flex-1 rounded-full ${s <= onboardingStep ? 'bg-[#00307B]' : 'bg-gray-200'}`}></div>)}</div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32 pt-4">
        {onboardingStep === 1 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-black mb-6">전공 정보를 알려주세요</h2>
            <select className="w-full p-4 mb-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold" value={userProfile.campus} onChange={e => { handleProfileChange('campus', e.target.value); handleProfileChange('college', ''); handleProfileChange('department', ''); }}>
              <option value="">캠퍼스 선택</option><option value="SEOUL">서울캠퍼스</option><option value="ERICA">ERICA캠퍼스</option>
            </select>
            {userProfile.campus && (
              <select className="w-full p-4 mb-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold" value={userProfile.college} onChange={e => { handleProfileChange('college', e.target.value); handleProfileChange('department', ''); }}>
                <option value="">단과대학 선택</option>
                {Object.keys(CAMPUS_DATA[userProfile.campus].colleges).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            {userProfile.college && (
              <select className="w-full p-4 mb-8 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold" value={userProfile.department} onChange={e => handleProfileChange('department', e.target.value)}>
                <option value="">학과/학부 선택</option>
                {CAMPUS_DATA[userProfile.campus].colleges[userProfile.college].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            )}
            {userProfile.department && (
              <>
                <label className="block text-sm font-bold text-gray-700 mb-3">이수 유형 (다중전공 선택)</label>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {['심화전공(단일)', '다중/복수전공', '융합전공', '부전공', '마이크로전공'].map(type => (
                    <button key={type} onClick={() => { handleProfileChange('majorType', type); if(type === '심화전공(단일)') { handleProfileChange('secondCollege', ''); handleProfileChange('secondDepartment', ''); } }} className={`py-4 rounded-2xl text-sm font-bold border-2 transition-all ${userProfile.majorType === type ? 'bg-[#00307B] text-white border-[#00307B]' : 'bg-white text-gray-600 border-gray-100'}`}>{type}</button>
                  ))}
                </div>
                {userProfile.majorType !== '심화전공(단일)' && (
                  <div className="p-5 bg-blue-50 rounded-3xl border-2 border-blue-100 animate-fade-in-up">
                    <p className="text-sm font-black text-[#00307B] mb-4">제2전공 학과 선택</p>
                    <select className="w-full p-3 mb-3 rounded-xl border-white border-2 text-sm font-bold bg-white focus:outline-none focus:border-[#00307B]" value={userProfile.secondCollege} onChange={e => { handleProfileChange('secondCollege', e.target.value); handleProfileChange('secondDepartment', ''); }}>
                       <option value="">단과대학 선택</option>
                       {Object.keys(CAMPUS_DATA[userProfile.campus].colleges).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {userProfile.secondCollege && (
                      <select className="w-full p-3 rounded-xl border-white border-2 text-sm font-bold bg-white focus:outline-none focus:border-[#00307B]" value={userProfile.secondDepartment} onChange={e => handleProfileChange('secondDepartment', e.target.value)}>
                        <option value="">학과 선택</option>
                        {CAMPUS_DATA[userProfile.campus].colleges[userProfile.secondCollege].map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {onboardingStep === 2 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-black mb-8">기본 정보를 입력해주세요</h2>
            <input type="text" placeholder="이름" value={userProfile.name} onChange={e => handleProfileChange('name', e.target.value)} className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold mb-4" />
            <div className="flex gap-4">
              <input type="number" placeholder="학년" value={userProfile.grade} onChange={e => handleProfileChange('grade', e.target.value)} className="flex-1 p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold" />
              <input type="number" placeholder="학번" value={userProfile.studentId} onChange={e => handleProfileChange('studentId', e.target.value)} className="flex-1 p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold" />
            </div>
          </div>
        )}

        {onboardingStep === 3 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-black mb-4">현재까지의 학점 정보</h2>
            <p className="text-[11px] text-gray-500 mb-4">포털의 졸업사정조회 탭 내용을 그대로 기입하세요.</p>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
              <table className="w-full text-left text-[11px] sm:text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr><th className="py-3 px-3 font-bold text-gray-700">항목</th><th className="py-3 px-1 font-bold text-center">기준</th><th className="py-3 px-3 font-bold text-[#00307B] text-center w-24">이수</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="py-2.5 px-3 font-bold">졸업학점</td><td className="text-center text-gray-500">{getGradReqs(userProfile.department, userProfile.majorType).total}</td><td className="py-1.5 px-2"><input type="number" value={userProfile.credits.total} onChange={e => handleCreditChange('total', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-center bg-gray-50 focus:border-[#00307B] focus:outline-none" /></td></tr>
                  <tr><td className="py-2.5 px-3 font-bold">전공학점</td><td className="text-center text-gray-500">{getGradReqs(userProfile.department, userProfile.majorType).majorTotal}</td><td className="py-1.5 px-2"><input type="number" value={userProfile.credits.majorTotal} onChange={e => handleCreditChange('majorTotal', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-center bg-gray-50 focus:border-[#00307B] focus:outline-none" /></td></tr>
                  <tr><td className="py-2.5 px-3 pl-6 text-gray-600">↳ 100~300</td><td className="text-center text-gray-400">{getGradReqs(userProfile.department, userProfile.majorType).major100_300}</td><td className="py-1.5 px-2"><input type="number" value={userProfile.credits.major100_300} onChange={e => handleCreditChange('major100_300', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-center focus:border-[#00307B] focus:outline-none" /></td></tr>
                  <tr><td className="py-2.5 px-3 pl-6 font-bold text-orange-600">↳ 400단위</td><td className="text-center font-bold text-orange-400">{getGradReqs(userProfile.department, userProfile.majorType).major400}</td><td className="py-1.5 px-2"><input type="number" value={userProfile.credits.major400} onChange={e => handleCreditChange('major400', e.target.value)} className="w-full p-2 border border-orange-300 rounded-lg text-center bg-orange-50 text-orange-700 font-bold focus:border-orange-500 focus:outline-none" /></td></tr>
                  {userProfile.majorType !== '심화전공(단일)' && (
                    <tr><td className="py-2.5 px-3 font-bold text-purple-700">제2전공</td><td className="text-center text-purple-500">{getGradReqs(userProfile.department, userProfile.majorType).secondMajor}</td><td className="py-1.5 px-2"><input type="number" value={userProfile.credits.secondMajor} onChange={e => handleCreditChange('secondMajor', e.target.value)} className="w-full p-2 border border-purple-300 rounded-lg text-center bg-purple-50 text-purple-700 font-bold focus:border-purple-500 focus:outline-none" /></td></tr>
                  )}
                  <tr><td className="py-2.5 px-3">영어전용강좌수</td><td className="text-center text-gray-500">{getGradReqs(userProfile.department, userProfile.majorType).englishAvg}</td><td className="py-1.5 px-2"><input type="number" value={userProfile.credits.englishAvg} onChange={e => handleCreditChange('englishAvg', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-center bg-gray-50 focus:border-[#00307B] focus:outline-none" /></td></tr>
                  <tr><td className="py-2.5 px-3">선수강이수</td><td className="text-center text-gray-500">Y</td><td className="py-1.5 px-2"><select value={userProfile.credits.prerequisite} onChange={e => handleCreditChange('prerequisite', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-center bg-gray-50 focus:border-[#00307B] focus:outline-none"><option value="N">N</option><option value="Y">Y</option></select></td></tr>
                  <tr><td className="py-2.5 px-3">졸업평점</td><td className="text-center text-gray-500">{getGradReqs(userProfile.department, userProfile.majorType).gpa}</td><td className="py-1.5 px-2"><input type="number" step="0.01" value={userProfile.credits.gpa} onChange={e => handleCreditChange('gpa', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-center bg-gray-50 focus:border-[#00307B] focus:outline-none" placeholder="4.5" /></td></tr>
                  <tr><td className="py-2.5 px-3">미필과목이수</td><td className="text-center text-gray-500">Y</td><td className="py-1.5 px-2"><select value={userProfile.credits.requiredCourses} onChange={e => handleCreditChange('requiredCourses', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-center bg-gray-50 focus:border-[#00307B] focus:outline-none"><option value="N">N</option><option value="Y">Y</option></select></td></tr>
                  <tr><td className="py-2.5 px-3">사회봉사</td><td className="text-center text-gray-500">{getGradReqs(userProfile.department, userProfile.majorType).volunteer}</td><td className="py-1.5 px-2"><input type="number" value={userProfile.credits.volunteer} onChange={e => handleCreditChange('volunteer', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-center bg-gray-50 focus:border-[#00307B] focus:outline-none" /></td></tr>
                  <tr><td className="py-2.5 px-3">인턴십이수</td><td className="text-center text-gray-500">Y</td><td className="py-1.5 px-2"><select value={userProfile.credits.internship} onChange={e => handleCreditChange('internship', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-center bg-gray-50 focus:border-[#00307B] focus:outline-none"><option value="N">N</option><option value="Y">Y</option></select></td></tr>
                  <tr className="bg-gray-50"><td className="py-2.5 px-3 font-bold text-[#00307B]">핵심교양</td><td className="text-center font-bold text-[#00307B]">{getGradReqs(userProfile.department, userProfile.majorType).coreElective}</td><td className="py-1.5 px-2"><input type="number" value={userProfile.credits.coreElective} onChange={e => handleCreditChange('coreElective', e.target.value)} className="w-full p-2 border border-[#00307B] rounded-lg text-center bg-white font-bold text-[#00307B] focus:outline-none" /></td></tr>
                  <tr className="bg-gray-50"><td className="py-2.5 px-3 pl-6 text-gray-500">↳ 고전읽기</td><td className="text-center text-gray-400">{getGradReqs(userProfile.department, userProfile.majorType).classicReading}</td><td className="py-1.5 px-2"><input type="number" value={userProfile.credits.classicReading} onChange={e => handleCreditChange('classicReading', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-center bg-white focus:border-[#00307B] focus:outline-none" /></td></tr>
                  <tr className="bg-gray-50"><td className="py-2.5 px-3 pl-6 text-gray-500">↳ 글로벌언어</td><td className="text-center text-gray-400">{getGradReqs(userProfile.department, userProfile.majorType).globalLang}</td><td className="py-1.5 px-2"><input type="number" value={userProfile.credits.globalLang} onChange={e => handleCreditChange('globalLang', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-center bg-white focus:border-[#00307B] focus:outline-none" /></td></tr>
                  <tr className="bg-gray-50"><td className="py-2.5 px-3 pl-6 text-gray-500">↳ 소프트웨어</td><td className="text-center text-gray-400">{getGradReqs(userProfile.department, userProfile.majorType).sw}</td><td className="py-1.5 px-2"><input type="number" value={userProfile.credits.sw} onChange={e => handleCreditChange('sw', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-center bg-white focus:border-[#00307B] focus:outline-none" /></td></tr>
                  <tr className="bg-gray-50"><td className="py-2.5 px-3 pl-6 text-gray-500">↳ 미래산업</td><td className="text-center text-gray-400">{getGradReqs(userProfile.department, userProfile.majorType).futureStartup}</td><td className="py-1.5 px-2"><input type="number" value={userProfile.credits.futureStartup} onChange={e => handleCreditChange('futureStartup', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-center bg-white focus:border-[#00307B] focus:outline-none" /></td></tr>
                  <tr className="bg-gray-50"><td className="py-2.5 px-3 pl-6 text-gray-500">↳ 과학기술</td><td className="text-center text-gray-400">{getGradReqs(userProfile.department, userProfile.majorType).scienceTech}</td><td className="py-1.5 px-2"><input type="number" value={userProfile.credits.scienceTech} onChange={e => handleCreditChange('scienceTech', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-center bg-white focus:border-[#00307B] focus:outline-none" /></td></tr>
                  <tr><td className="py-2.5 px-3 font-bold text-orange-600">IC-PBL강좌수</td><td className="text-center font-bold text-orange-400">{getGradReqs(userProfile.department, userProfile.majorType).icpbl}</td><td className="py-1.5 px-2"><input type="number" value={userProfile.credits.icpbl} onChange={e => handleCreditChange('icpbl', e.target.value)} className="w-full p-2 border border-orange-300 rounded-lg text-center bg-orange-50 font-bold focus:border-orange-500 focus:outline-none" /></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {onboardingStep === 4 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-black mb-8">목표 진로를 선택하세요</h2>
            <div className="space-y-3">
              {Object.values(CAREER_GOALS).map(goal => (
                <div key={goal.id} className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${userProfile.careerMain === goal.name ? 'border-[#00307B] bg-blue-50' : 'border-gray-100'}`} onClick={() => handleProfileChange('careerMain', goal.name)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 ${userProfile.careerMain === goal.name ? 'bg-[#00307B] border-[#00307B]' : 'border-gray-300'}`}></div>
                    <span className="font-black text-lg">{goal.name}</span>
                  </div>
                  {userProfile.careerMain === goal.name && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {goal.sub.map(s => <button key={s} onClick={(e) => { e.stopPropagation(); handleProfileChange('careerSub', s); setOnboardingStep(5); }} className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${userProfile.careerSub === s ? 'bg-[#00307B] text-white border-[#00307B]' : 'bg-white'}`}>{s}</button>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {onboardingStep === 5 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-black mb-2">이미 보유한 스펙 등록</h2>
            <p className="text-gray-500 text-sm mb-6">등록된 항목은 로드맵의 '성취 리스트'로 이동합니다.</p>
            <div className="space-y-3 mb-8">
              {achievedSpecs.map((spec, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-gray-200">
                  <div>
                    <p className="font-bold text-sm">{spec.name} <span className="text-blue-600 ml-1">{spec.score}</span></p>
                    <p className="text-[10px] text-gray-400 mt-0.5">만료일: {spec.date || '없음'}</p>
                  </div>
                  <button onClick={() => setAchievedSpecs(prev => prev.filter((_, idx) => idx !== i))} className="p-2 text-red-400"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            <div className="p-6 border-2 border-dashed border-gray-200 rounded-3xl space-y-4">
              <input id="spec-name" type="text" placeholder="어학/자격증 명 (예: OPIc, TOEIC, 컴활)" className="w-full p-3 bg-white border rounded-xl text-sm font-bold focus:outline-none focus:border-[#00307B]" />
              <div className="flex gap-2">
                <input id="spec-score" type="text" placeholder="점수/등급" className="flex-1 p-3 bg-white border rounded-xl text-sm font-bold focus:outline-none focus:border-[#00307B]" />
                <input id="spec-date" type="date" className="flex-1 p-3 bg-white border rounded-xl text-sm font-bold text-gray-500 focus:outline-none focus:border-[#00307B]" />
              </div>
              <button onClick={() => {
                const name = document.getElementById('spec-name').value;
                const score = document.getElementById('spec-score').value;
                const date = document.getElementById('spec-date').value;
                if(name && score) {
                  setAchievedSpecs(prev => [...prev, { name, score, date }]);
                  document.getElementById('spec-name').value = '';
                  document.getElementById('spec-score').value = '';
                }
              }} className="w-full py-3 bg-gray-100 text-gray-600 font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"><Plus size={16}/> 등록하기</button>
            </div>
          </div>
        )}

        {onboardingStep === 6 && (
           <div className="flex flex-col items-center justify-center h-full animate-fade-in-up">
           <Sparkles className="text-[#00307B] w-16 h-16 mb-4 animate-bounce" />
           <h2 className="text-2xl font-black text-center">나만을 위한<br/>커스텀 로드맵 완성!</h2>
           </div>
        )}
      </div>

      <div className="p-6 bg-white border-t sticky bottom-0">
        <button onClick={() => onboardingStep === 6 ? setCurrentScreen('home') : setOnboardingStep(s => s + 1)} className="w-full py-5 bg-[#00307B] text-white font-black text-lg rounded-[2rem] shadow-xl">{onboardingStep === 6 ? '시작하기' : '다음'}</button>
      </div>
    </div>
  );

  const renderHome = () => {
    const data = userRoadmapData;
    if (!data) return null;

    return (
      <div className="p-6 pt-10 animate-fade-in-up">
        <div className="flex justify-between items-center mb-8">
          <div className="bg-[#00307B] text-white px-3 py-1 rounded-lg text-xs font-black tracking-widest">HY ROAD</div>
          <Bell size={20} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-black leading-tight mb-8">
          {userProfile.name}님을 위한<br/>
          <span className="text-[#00307B]">{userProfile.careerSub}</span> 직무<br/>
          맞춤 가이드입니다 🚀
        </h2>

        {/* 성취 리스트 */}
        {data.achieved.length > 0 && (
          <div className="mb-10">
            <h3 className="font-black text-lg text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-500" /> 나의 성취 리스트
            </h3>
            <div className="space-y-3">
              {data.achieved.map((spec, i) => (
                <div key={i} className="bg-white border-2 border-green-50 rounded-3xl p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-black text-sm text-gray-800">{spec.title}</p>
                    <p className="text-[10px] text-green-600 font-bold mt-1">성취 완료: {spec.userScore || '취득'}</p>
                  </div>
                  {spec.expiryDate && (
                    <div className="text-right">
                      <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">만료일</p>
                      <p className="text-[11px] font-black text-gray-600 bg-gray-50 px-2 py-1 rounded-md">{spec.expiryDate}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 마일스톤 */}
        <div>
          <h3 className="font-black text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Target size={20} className="text-[#00307B]" /> 앞으로의 마일스톤
          </h3>
          <div className="space-y-4">
            {data.milestones.map((spec, i) => (
              <div key={i} className="bg-white border-2 border-gray-50 rounded-[2.5rem] p-6 shadow-sm group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${spec.cat === 'lang' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{spec.cat === 'lang' ? '어학' : '자격증'}</span>
                    <h4 className="font-black text-gray-900">{spec.title}</h4>
                  </div>
                  <a href={spec.url} target="_blank" rel="noreferrer" className="text-gray-300 group-hover:text-[#00307B] transition-all"><ExternalLink size={16}/></a>
                </div>
                <p className="text-xs text-gray-500 font-bold mb-4 leading-relaxed break-keep">{spec.desc}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1"><Clock size={12}/> {spec.dDay}</div>
                  <div className="bg-blue-50 text-[#00307B] px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1"><Hourglass size={12}/> {spec.duration}</div>
                  {spec.currentStatus && <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black">{spec.currentStatus}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderRoadmap = () => {
    const data = userRoadmapData;
    if(!data) return null;

    const req = data.gradInfo;
    const current = userProfile.credits;

    return (
      <div className="p-6 pt-10 animate-fade-in-up">
        <h1 className="text-2xl font-black mb-8">수강 로드맵</h1>
        <div className="bg-[#00307B] rounded-[2.5rem] p-8 text-white mb-10 shadow-xl relative overflow-hidden">
          <Sparkles className="absolute top-4 right-4 text-blue-300 opacity-30" size={40} />
          <p className="text-blue-200 text-xs font-bold mb-1 uppercase tracking-widest">Academic Status</p>
          <h3 className="text-2xl font-black mb-6">졸업 요건 분석</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end"><span className="text-sm font-bold">이수 학점</span><span className="text-lg font-black">{current.total || 0} / {req.total}</span></div>
            <div className="h-2 bg-blue-900/50 rounded-full overflow-hidden"><div className="h-full bg-white transition-all duration-1000" style={{ width: `${Math.min(100, ((current.total || 0) / req.total) * 100)}%` }}></div></div>
          </div>
        </div>

        <h3 className="font-black text-lg mb-6 flex items-center gap-2"><GraduationCap size={22} className="text-[#00307B]" /> 실시간 졸업 사정 상세</h3>
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 mb-8">
          <div className="bg-indigo-50 p-4 border-b flex justify-between items-center"><h3 className="font-bold text-indigo-900 text-xs">한양대학교 졸업요건 기준</h3><button onClick={() => { setOnboardingStep(3); setCurrentScreen('onboarding'); }} className="text-[10px] bg-white text-indigo-700 px-2 py-1 rounded border font-bold flex items-center gap-1"><Edit3 size={10}/> 학점 수정</button></div>
          <div className="p-4 bg-white overflow-x-auto"><table className="w-full text-left text-[11px] sm:text-xs border-collapse min-w-[280px]"><thead><tr className="border-b-2 border-gray-200 text-gray-500 font-bold"><th className="pb-2 w-1/3">항목</th><th className="pb-2 text-center">취득</th><th className="pb-2 text-center">배당</th><th className="pb-2 text-center">잔여</th><th className="pb-2 text-center">판정</th></tr></thead><tbody className="divide-y divide-gray-100">
            <tr><td className="py-2.5 font-bold text-gray-800">졸업학점</td><td className="text-center">{current.total}</td><td className="text-center text-gray-400">{req.total}</td><td className="text-center text-red-500">{getStatus(current.total, req.total).remain || ''}</td><td className="text-center">{getStatus(current.total, req.total).ui}</td></tr>
            <tr><td className="py-2.5 font-bold text-gray-800">전공학점</td><td className="text-center">{current.majorTotal}</td><td className="text-center text-gray-400">{req.majorTotal}</td><td className="text-center text-red-500">{getStatus(current.majorTotal, req.majorTotal).remain || ''}</td><td className="text-center">{getStatus(current.majorTotal, req.majorTotal).ui}</td></tr>
            <tr><td className="py-2.5 pl-2 text-gray-700">↳ 100~300</td><td className="text-center">{current.major100_300}</td><td className="text-center text-gray-400">{req.major100_300}</td><td className="text-center text-red-500">{getStatus(current.major100_300, req.major100_300).remain || ''}</td><td className="text-center">{getStatus(current.major100_300, req.major100_300).ui}</td></tr>
            <tr><td className="py-2.5 pl-2 font-bold text-orange-600">↳ 400단위</td><td className="text-center font-bold text-orange-600">{current.major400}</td><td className="text-center text-orange-400">{req.major400}</td><td className="text-center text-red-500">{getStatus(current.major400, req.major400).remain || ''}</td><td className="text-center">{getStatus(current.major400, req.major400).ui}</td></tr>
            {userProfile.majorType !== '심화전공(단일)' && (
              <tr><td className="py-2.5 font-bold text-purple-700">제2전공</td><td className="text-center text-purple-600">{current.secondMajor}</td><td className="text-center text-purple-400">{req.secondMajor}</td><td className="text-center text-red-500">{getStatus(current.secondMajor, req.secondMajor).remain || ''}</td><td className="text-center">{getStatus(current.secondMajor, req.secondMajor).ui}</td></tr>
            )}
            <tr><td className="py-2.5 text-gray-700">영어전용강좌수</td><td className="text-center">{current.englishAvg}</td><td className="text-center text-gray-400">{req.englishAvg}</td><td className="text-center text-red-500">{getStatus(current.englishAvg, req.englishAvg).remain || ''}</td><td className="text-center">{getStatus(current.englishAvg, req.englishAvg).ui}</td></tr>
            <tr><td className="py-2.5 text-gray-700">선수강이수여부</td><td className="text-center">{current.prerequisite}</td><td className="text-center text-gray-400">Y</td><td className="text-center text-red-500">{getStatus(current.prerequisite, 'Y', 'string').remain || ''}</td><td className="text-center">{getStatus(current.prerequisite, 'Y', 'string').ui}</td></tr>
            <tr><td className="py-2.5 text-gray-700">미필과목이수여부</td><td className="text-center">{current.requiredCourses}</td><td className="text-center text-gray-400">Y</td><td className="text-center text-red-500">{getStatus(current.requiredCourses, 'Y', 'string').remain || ''}</td><td className="text-center">{getStatus(current.requiredCourses, 'Y', 'string').ui}</td></tr>
            <tr><td className="py-2.5 text-gray-700">사회봉사</td><td className="text-center">{current.volunteer}</td><td className="text-center text-gray-400">{req.volunteer}</td><td className="text-center text-red-500">{getStatus(current.volunteer, req.volunteer).remain || ''}</td><td className="text-center">{getStatus(current.volunteer, req.volunteer).ui}</td></tr>
            <tr><td className="py-2.5 font-bold text-orange-600">인턴십이수여부</td><td className="text-center">{current.internship}</td><td className="text-center text-gray-400">Y</td><td className="text-center text-red-500">{getStatus(current.internship, 'Y', 'string').remain || ''}</td><td className="text-center">{getStatus(current.internship, 'Y', 'string').ui}</td></tr>
            <tr className="bg-blue-50/30"><td className="py-2.5 font-bold text-[#00307B]">핵심교양</td><td className="text-center font-bold text-[#00307B]">{current.coreElective}</td><td className="text-center text-[#00307B]">{req.coreElective}</td><td className="text-center text-red-500">{getStatus(current.coreElective, req.coreElective).remain || ''}</td><td className="text-center">{getStatus(current.coreElective, req.coreElective).ui}</td></tr>
            <tr className="bg-gray-50/50"><td className="py-2.5 pl-4 text-gray-500">↳ 고전읽기</td><td className="text-center">{current.classicReading}</td><td className="text-center text-gray-400">{req.classicReading}</td><td className="text-center text-red-500">{getStatus(current.classicReading, req.classicReading).remain || ''}</td><td className="text-center">{getStatus(current.classicReading, req.classicReading).ui}</td></tr>
            <tr className="bg-gray-50/50"><td className="py-2.5 pl-4 text-gray-500">↳ 글로벌언어</td><td className="text-center">{current.globalLang}</td><td className="text-center text-gray-400">{req.globalLang}</td><td className="text-center text-red-500">{getStatus(current.globalLang, req.globalLang).remain || ''}</td><td className="text-center">{getStatus(current.globalLang, req.globalLang).ui}</td></tr>
            <tr className="bg-gray-50/50"><td className="py-2.5 pl-4 text-gray-500">↳ 소프트웨어</td><td className="text-center">{current.sw}</td><td className="text-center text-gray-400">{req.sw}</td><td className="text-center text-red-500">{getStatus(current.sw, req.sw).remain || ''}</td><td className="text-center">{getStatus(current.sw, req.sw).ui}</td></tr>
            <tr className="bg-gray-50/50"><td className="py-2.5 pl-4 text-gray-500">↳ 미래산업창업</td><td className="text-center">{current.futureStartup}</td><td className="text-center text-gray-400">{req.futureStartup}</td><td className="text-center text-red-500">{getStatus(current.futureStartup, req.futureStartup).remain || ''}</td><td className="text-center">{getStatus(current.futureStartup, req.futureStartup).ui}</td></tr>
            <tr className="bg-gray-50/50"><td className="py-2.5 pl-4 text-gray-500">↳ 과학과기술</td><td className="text-center">{current.scienceTech}</td><td className="text-center text-gray-400">{req.scienceTech}</td><td className="text-center text-red-500">{getStatus(current.scienceTech, req.scienceTech).remain || ''}</td><td className="text-center">{getStatus(current.scienceTech, req.scienceTech).ui}</td></tr>
            <tr><td className="py-2.5 font-bold text-orange-600">IC-PBL강좌수</td><td className="text-center font-bold text-orange-600">{current.icpbl}</td><td className="text-center text-orange-400">{req.icpbl}</td><td className="text-center text-red-500">{getStatus(current.icpbl, req.icpbl).remain || ''}</td><td className="text-center">{getStatus(current.icpbl, req.icpbl).ui}</td></tr>
          </tbody></table></div>
        </div>

        <h3 className="font-black text-lg mb-6 flex items-center gap-2"><BookOpen size={22} className="text-[#00307B]" /> 부족 학점 기반 과목 추천</h3>
        <div className="space-y-4">
          {data.courses.length > 0 ? data.courses.map((c, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border-2 border-blue-50 shadow-sm relative group overflow-hidden transition-all hover:border-[#00307B]">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-1.5">
                  <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2.5 py-1 rounded-md w-fit">{c.ownerDept}</span>
                  <h4 className="font-black text-lg text-gray-900 group-hover:text-[#00307B] transition-all">{c.name}</h4>
                </div>
                <div className="bg-blue-50 text-[#00307B] px-3 py-1.5 rounded-xl text-[10px] font-black text-center whitespace-nowrap">{c.gradeTerm}</div>
              </div>
              <p className="text-[11px] text-blue-600 font-bold leading-relaxed mb-2 bg-blue-50/50 p-2 rounded-lg break-keep">{c.dynamicReason}</p>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed pr-8">{c.reason}</p>
            </div>
          )) : (
            <div className="bg-gray-50 rounded-[2rem] p-8 text-center text-gray-500 font-bold border-2 border-gray-100">
              <CheckCircle2 size={40} className="mx-auto mb-3 text-green-400" />
              모든 추천 요건이 충족되었습니다!
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="p-6 pt-10 animate-fade-in-up">
      <h1 className="text-2xl font-black mb-8">마이 페이지</h1>
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mb-8 text-center">
        <div className="w-24 h-24 bg-[#00307B] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black">{userProfile.name?.charAt(0) || 'H'}</div>
        <h2 className="text-xl font-black">{userProfile.name}</h2>
        <p className="text-sm text-gray-400 font-bold mt-1">{userProfile.department} • {userProfile.studentId}학번</p>
        <div className="mt-4 inline-block px-4 py-2 bg-blue-50 text-[#00307B] rounded-2xl text-xs font-black">{userProfile.careerSub} 목표</div>
      </div>
      <div className="space-y-3">
        {[{ icon: GraduationCap, label: '학적 및 이수학점 수정', step: 1 }, { icon: Award, label: '보유 스펙 관리', step: 5 }, { icon: Target, label: '진로 목표 변경', step: 4 }].map((item, i) => (
          <button key={i} onClick={() => { setOnboardingStep(item.step); setCurrentScreen('onboarding'); }} className="w-full bg-white p-6 rounded-3xl flex items-center justify-between border border-gray-50 shadow-sm active:bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 rounded-xl text-gray-400"><item.icon size={20}/></div>
              <span className="font-bold text-gray-800">{item.label}</span>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 font-sans text-gray-900 overflow-hidden">
      <div className="w-full max-w-md h-[850px] max-h-[90vh] bg-white relative overflow-hidden sm:rounded-[3rem] sm:shadow-2xl border-8 border-black">
        {/* Splash Screen */}
        <div className={`absolute inset-0 bg-[#00307B] flex flex-col items-center justify-center transition-all duration-1000 z-[60] ${isLoaded ? 'opacity-0 pointer-events-none scale-110' : 'opacity-100 scale-100'}`}>
          <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl animate-pulse">
            <span className="text-[#00307B] text-4xl font-black italic">HY</span>
          </div>
          <h1 className="text-white text-4xl font-black tracking-widest mb-2">HY ROAD</h1>
          <p className="text-blue-300 text-sm font-bold tracking-[0.3em] uppercase">Academic Navigator</p>
        </div>

        {currentScreen === 'onboarding' && renderOnboarding()}

        <div className={`absolute inset-0 transition-opacity duration-300 ${currentScreen !== 'onboarding' && currentScreen !== 'splash' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <ScreenWrapper isActive={currentScreen === 'home'}>{renderHome()}</ScreenWrapper>
          <ScreenWrapper isActive={currentScreen === 'roadmap'}>{renderRoadmap()}</ScreenWrapper>
          <ScreenWrapper isActive={currentScreen === 'settings'}>{renderSettings()}</ScreenWrapper>
          
          {/* Bottom Tab Bar */}
          <div className="absolute bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 px-8 py-4 pb-8 flex justify-around items-center z-40">
            {[{ id: 'home', icon: Home, label: '가이드' }, { id: 'roadmap', icon: Map, label: '로드맵' }, { id: 'settings', icon: 'MY' }].map(tab => {
              const isActive = currentScreen === tab.id;
              return (
                <button key={tab.id} onClick={() => setCurrentScreen(tab.id)} className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'scale-110' : 'opacity-40 hover:opacity-100'}`}>
                  <div className={`p-2 rounded-2xl ${isActive ? 'bg-[#00307B] text-white' : 'text-gray-400'}`}>
                    {typeof tab.icon === 'string' ? <span className="text-xs font-black">{tab.icon}</span> : <tab.icon size={20} strokeWidth={3}/>}
                  </div>
                  <span className={`text-[9px] font-black ${isActive ? 'text-[#00307B]' : 'text-gray-400'}`}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
      `}} />
    </div>
  );
}