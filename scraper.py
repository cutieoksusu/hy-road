import json
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import time

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# 💡 [핵심] 식품/F&B, 패션/의류 등 모든 신규 진로에 대한 맞춤형 검색 키워드 완벽 탑재
CAREER_KEYWORDS = {
    'IT/소프트웨어': ['IT', '소프트웨어', '개발', '데이터', '프로그래밍', '앱', '웹', 'AI'],
    '기획/마케팅': ['마케팅', '기획', '콘텐츠', '서포터즈', '홍보', '브랜딩', '에디터'],
    '식품/F&B': ['식품', '외식', 'F&B', '영양', '급식', '메뉴기획', '식음료', '제과'],
    '패션/의류': ['패션', '의류', 'MD', 'VMD', '벤더', '디자인', '어패럴', '패브릭'],
    '금융/은행': ['금융', '은행', '증권', '경제', '투자', '핀테크'],
    'CPA (공인회계사)': ['회계', '세무', '재무', 'CPA', '감사'],
    '로스쿨 (법조인)': ['법', '법률', '인권', '정책', '입법'],
    '반도체/엔지니어링': ['반도체', '엔지니어', '공정', '설계', '하드웨어', '이공계'],
    '공기업 (NCS)': ['공공기관', '공기업', '공단', '재단', '한국', '공사'],
    '5급 행정고시': ['행정', '정책', '공공', '국회', '외교'],
    '5급 기술고시': ['기술', '과학', '연구', 'R&D', '이공계'],
    '언론고시 (기자/PD)': ['기자', 'PD', '방송', '미디어', '언론', '아나운서', '취재'],
    'default': ['대학생', '대외활동', '인턴', '공모전'] 
}

def get_categorized_jobs():
    categorized_data = {}
    
    for career, keywords in CAREER_KEYWORDS.items():
        print(f"\n🔍 [{career}] 직무 데이터 수집 시작...")
        career_jobs = []
        seen_urls = set() # 중복 방지 세트
        
        for keyword in keywords:
            try:
                # 1. 위비티 크롤링
                url_wevity = f"https://www.wevity.com/?c=find&s=1&gbn=viewok&ctg=21&sw={keyword}"
                res_w = requests.get(url_wevity, headers=HEADERS, timeout=10)
                if res_w.status_code == 200:
                    soup_w = BeautifulSoup(res_w.text, 'html.parser')
                    items_w = soup_w.select('.list > ul > li')
                    valid_items = [item for item in items_w if not item.select_one('.notice')]
                    
                    for item in valid_items:
                        title_elem = item.select_one('.tit a')
                        if not title_elem: continue
                        title = title_elem.text.strip()
                        link = "https://www.wevity.com/" + title_elem['href']
                        
                        if link in seen_urls: continue
                        seen_urls.add(link)
                        
                        d_day_elem = item.select_one('.day')
                        d_day = d_day_elem.text.strip() if d_day_elem else "상시"
                        
                        career_jobs.append({
                            "title": f"[{keyword}] {title}", 
                            "dDay": d_day, "views": "-", "url": link, 
                            "dynamicReason": "위비티 맞춤 공고"
                        })
                
                # 2. 캠퍼스픽 크롤링 (캠퍼스픽은 URL 파라미터가 다를 수 있으나 범용 검색으로 접근)
                # 캠퍼스픽은 보안이 강화되어 접근이 막힐 수 있으므로 예외 처리 강화
                url_campus = f"https://www.campuspick.com/activity?keyword={keyword}"
                res_c = requests.get(url_campus, headers=HEADERS, timeout=10)
                if res_c.status_code == 200:
                    soup_c = BeautifulSoup(res_c.text, 'html.parser')
                    items_c = soup_c.select('a.item')
                    
                    for item in items_c[:3]: # 최상단 3개만
                        title_elem = item.select_one('h2')
                        if not title_elem: continue
                        title = title_elem.text.strip()
                        link = "https://www.campuspick.com" + item['href']
                        
                        if link in seen_urls: continue
                        seen_urls.add(link)
                        
                        d_day_elem = item.select_one('.dday')
                        d_day = d_day_elem.text.strip() if d_day_elem else "상시"
                        
                        career_jobs.append({
                            "title": f"[{keyword}] {title}", 
                            "dDay": d_day, "views": "-", "url": link,
                            "dynamicReason": "캠퍼스픽 맞춤 공고"
                        })
                        
            except Exception as e:
                print(f"  ❌ '{keyword}' 수집 에러: {e}")
            
            time.sleep(0.5) # 서버 차단 방지 휴식
        
        # 수집된 공고가 0개일 경우, 진짜 실패를 앱에 알리기 위한 신호 데이터 삽입
        if not career_jobs:
            career_jobs.append({
                "title": f"[{keyword}] 관련 크롤링 데이터가 없습니다.", 
                "dDay": "-", "views": "-", "url": "#", "dynamicReason": "수집 실패"
            })
            
        # 가장 연관성 높은 10개만 저장
        categorized_data[career] = career_jobs[:10]
        print(f"  ✅ [{career}] 총 {len(categorized_data[career])}개 세팅 완료.")
        
    return categorized_data

def save_to_json(data):
    with open('latest_jobs.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("\n🎉 모든 키워드 공고 수집 및 JSON 저장 완료!")

if __name__ == "__main__":
    job_data = get_categorized_jobs()
    save_to_json(job_data)