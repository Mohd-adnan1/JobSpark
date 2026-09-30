import requests
from typing import List, Dict, Any


def scrape_unstop(opportunity_type: str = "jobs", limit: int = 10) -> List[Dict[str, Any]]:
    """
    Scrapes opportunities from Unstop public API.
    """
    url = f"https://unstop.com/api/public/opportunity/search-result?opportunity={opportunity_type}&per_page={limit}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
    }

    jobs = []
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            payload = response.json()
            data_items = payload.get("data", {}).get("data", [])

            for item in data_items:
                title = item.get("title", "Software Developer")
                company = item.get("organisation", {}).get("name", "Unstop Partner")
                
                # Extract location
                job_detail = item.get("jobDetail") or {}
                locations = job_detail.get("locations", ["Remote"])
                loc = locations[0] if locations else "Remote"

                desc = item.get("details", f"Opportunity for {title} hosted on Unstop.")
                seo_url = item.get("seo_url", "")

                jobs.append({
                    "title": title,
                    "company": company,
                    "location": loc,
                    "description": desc,
                    "url": seo_url,
                    "source": "Unstop"
                })
        else:
            print(f"[Unstop] Response status: {response.status_code}")
    except Exception as e:
        print(f"[Unstop Scraper Error]: {e}")

    return jobs


if __name__ == "__main__":
    results = scrape_unstop("jobs", 5)
    print(f"Unstop Scraped {len(results)} jobs.")