import json
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import time

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# 💡 [핵심 업그레이드] 진로별로 가능한 한 다양한 연관 키워드를 모두 리스트로 묶었습니다.
CAREER_KEYWORDS = {
    'IT/소프트웨어': ['IT', '소프트웨어', '개발', '데이터', '프로그래밍', '앱', '웹', 'AI'],
    '기획/마케팅': ['마케팅', '기획', '콘텐츠', '서포터즈', '홍보', '브랜딩', '에디터'],
    '금융/은행': ['금융', '은행', '증권', '경제', '투자', '핀테크'],
    'CPA (공인회계사)': ['회계', '세무', '재무', 'CPA', '감사'],
    '로스쿨 (법조인)': ['법', '법률', '인권', '정책', '입법'],
    '반도체/엔지니어링': ['반도체', '엔지니어', '공정', '설계', '하드웨어', '이공계'],
    '공기업 (NCS)': ['공공기관', '공기업', '공단', '재단', '한국', '공사'],
    '5급 행정고시': ['행정', '정책', '공공', '국회', '외교'],
    '5급 기술고시': ['기술', '과학', '연구', 'R&D', '이공계'],
    '언론고시 (기자/PD)': ['기자', 'PD', '방송', '미디어', '언론', '아나운서', '취재'],
    'default': ['대학생', '대외활동', '인턴', '공모전'] # 매칭 안 될 때 쓸 범용 키워드
}

def get_categorized_jobs():
    categorized_data = {}
    
    for career, keywords in CAREER_KEYWORDS.items():
        print(f"\n🔍 [{career}] 직무 데이터 수집 시작...")
        
        career_jobs = []
        seen_urls = set() # 중복 공고를 걸러내기 위한 세트(Set)
        
        # 해당 진로에 속한 모든 키워드를 하나씩 순회하며 검색
        for keyword in keywords:
            try:
                # 위비티 검색 URL 적용 (&sw=키워드)
                url = f"https://www.wevity.com/?c=find&s=1&gbn=viewok&ctg=21&sw={keyword}"
                response = requests.get(url, headers=HEADERS, timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'html.parser')
                items = soup.select('.list > ul > li')
                valid_items = [item for item in items if not item.select_one('.notice')]
                
                for item in valid_items: 
                    title_elem = item.select_one('.tit a')
                    if not title_elem: continue
                        
                    title = title_elem.text.strip()
                    link = "https://www.wevity.com/" + title_elem['href']
                    
                    # 💡 [중복 제거 로직] 이미 다른 키워드에서 찾은 공고면 패스!
                    if link in seen_urls:
                        continue
                    
                    seen_urls.add(link)
                    
                    d_day_elem = item.select_one('.day')
                    d_day = d_day_elem.text.strip() if d_day_elem else "상시"
                    
                    view_elem = item.select_one('.read')
                    views = view_elem.text.strip() if view_elem else "0"
                    
                    career_jobs.append({
                        "title": f"[{keyword}] {title}", # 어떤 키워드로 잡혔는지 표시
                        "dDay": d_day, 
                        "views": views, 
                        "url": link, 
                        "updated": datetime.now().strftime("%m/%d %H:%M")
                    })
            except Exception as e:
                print(f"  ❌ '{keyword}' 수집 에러: {e}")
            
            time.sleep(0.5) # 서버 차단(IP 밴)을 막기 위해 검색 1번당 0.5초씩 휴식
        
        # 수집된 공고가 없다면 텅 빈 화면 대신 안내 문구 삽입
        if not career_jobs:
            career_jobs.append({
                "title": f"현재 맞춤 추천 공고가 없습니다. 직접 사이트에서 확인해보세요!", 
                "dDay": "-", "views": "-", "url": "https://www.wevity.com/", "updated": datetime.now().strftime("%m/%d %H:%M")
            })
            
        # 가장 연관성 높은/최신 공고 순서대로 최대 10개까지만 잘라서 저장
        categorized_data[career] = career_jobs[:10]
        print(f"  ✅ [{career}] 총 {len(categorized_data[career])}개 세팅 완료.")
        
    return categorized_data

def save_to_json(data):
    with open('latest_jobs.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("\n🎉 모든 다중 키워드 공고 수집 및 JSON 저장 완료!")

if __name__ == "__main__":
    job_data = get_categorized_jobs()
    save_to_json(job_data)