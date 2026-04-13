import json
import requests
from bs4 import BeautifulSoup
from datetime import datetime

# 브라우저 위장 헤더 (봇 차단 방지)
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"
}

def get_wevity_jobs():
    jobs = []
    try:
        print("🌐 위비티(Wevity) 접속 중...")
        url = "https://www.wevity.com/?c=find&s=1&gbn=viewok&ctg=21" # 대외활동/서포터즈 탭
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        items = soup.select('.list > ul > li')
        valid_items = [item for item in items if not item.select_one('.notice')] # 공지사항 제외
        
        for item in valid_items[:5]: # 최신 5개만
            title_elem = item.select_one('.tit a')
            if not title_elem: continue
                
            title = "[위비티] " + title_elem.text.strip()
            link = "https://www.wevity.com/" + title_elem['href']
            
            d_day_elem = item.select_one('.day')
            d_day = d_day_elem.text.strip() if d_day_elem else "상시"
            
            view_elem = item.select_one('.read')
            views = view_elem.text.strip() if view_elem else "0"
            
            jobs.append({
                "title": title, "dDay": d_day, "views": views, 
                "url": link, "updated": datetime.now().strftime("%m/%d %H:%M")
            })
    except Exception as e:
        print(f"❌ 위비티 크롤링 실패: {e}")
    return jobs

def get_campuspick_jobs():
    jobs = []
    try:
        print("🌐 캠퍼스픽(CampusPick) 접속 중...")
        # 캠퍼스픽 대외활동 탭
        url = "https://www.campuspick.com/activity" 
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        items = soup.select('a.item') # 캠퍼스픽 공고 아이템 클래스
        
        for item in items[:5]: # 최신 5개만
            title_elem = item.select_one('h2')
            if not title_elem: continue
            
            title = "[캠퍼스픽] " + title_elem.text.strip()
            link = "https://www.campuspick.com" + item['href']
            
            d_day_elem = item.select_one('.dday')
            d_day = d_day_elem.text.strip() if d_day_elem else "상시"
            
            # 캠퍼스픽은 조회수가 텍스트에 섞여있는 경우가 많아 기본값 처리
            jobs.append({
                "title": title, "dDay": d_day, "views": "-", 
                "url": link, "updated": datetime.now().strftime("%m/%d %H:%M")
            })
    except Exception as e:
        print(f"❌ 캠퍼스픽 크롤링 실패: {e}")
    return jobs

def save_to_json(data):
    with open('latest_jobs.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ 총 {len(data)}개의 공고 크롤링 및 latest_jobs.json 저장 완료!")

if __name__ == "__main__":
    # 두 사이트의 데이터를 수집하여 하나의 리스트로 합침
    all_jobs = get_wevity_jobs() + get_campuspick_jobs()
    
    if all_jobs:
        save_to_json(all_jobs)
    else:
        print("⚠️ 수집된 데이터가 없습니다.")
        # 만약 둘 다 실패할 경우를 대비한 비상용 예비 데이터
        save_to_json([{
            "title": "🚨 현재 실시간 공고를 불러올 수 없습니다. (사이트 점검 중)", 
            "dDay": "-", "views": "-", "url": "#", "updated": datetime.now().strftime("%m/%d %H:%M")
        }])