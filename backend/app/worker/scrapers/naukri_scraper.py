import requests
from typing import List, Dict, Any


def scrape_naukri(keywords: str = "python developer", location: str = "India", limit: int = 10) -> List[Dict[str, Any]]:
    """
    Scrapes job listings from Naukri via public API endpoint.
    """
    url = "https://www.naukri.com/jobapi/v3/search"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "AppId": "109",
        "SystemId": "109",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    params = {
        "noOfResults": limit,
        "keyword": keywords,
        "location": location,
        "pageNo": 1
    }

    jobs = []
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            job_details = data.get("jobDetails", [])

            for item in job_details:
                title = item.get("title", "Developer")
                company = item.get("companyName", "Naukri Listed Partner")
                placeholders = item.get("placeholders", [])
                loc = placeholders[0].get("label", location) if placeholders else location
                desc = item.get("jobDescription", f"Opening for {title} at {company}.")
                jd_url = item.get("jdURL", "")
                full_url = f"https://www.naukri.com{jd_url}" if jd_url else ""

                jobs.append({
                    "title": title,
                    "company": company,
                    "location": loc,
                    "description": desc,
                    "url": full_url,
                    "source": "Naukri"
                })
        else:
            print(f"[Naukri] API Response Code: {response.status_code}")
    except Exception as e:
        print(f"[Naukri Scraper Error]: {e}")

    return jobs


if __name__ == "__main__":
    results = scrape_naukri("Full Stack Engineer", "India", 5)
    print(f"Naukri Scraped {len(results)} jobs.")