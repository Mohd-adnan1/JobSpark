import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any


def scrape_linkedin(keywords: str = "software engineer", location: str = "India", limit: int = 10) -> List[Dict[str, Any]]:
    """
    Scrapes public LinkedIn job listings via LinkedIn Guest API.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    }
    
    search_url = f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords={keywords}&location={location}&start=0"
    jobs = []

    try:
        response = requests.get(search_url, headers=headers, timeout=10)
        if response.status_code != 200:
            print(f"[LinkedIn] Error status: {response.status_code}")
            return jobs

        soup = BeautifulSoup(response.text, "html.parser")
        job_cards = soup.find_all("li")

        for card in job_cards[:limit]:
            try:
                title_elem = card.find("h3", class_="base-search-card__title")
                company_elem = card.find("h4", class_="base-search-card__subtitle")
                location_elem = card.find("span", class_="job-search-card__location")
                link_elem = card.find("a", class_="base-card__full-link")

                title = title_elem.text.strip() if title_elem else "Software Engineer"
                company = company_elem.text.strip() if company_elem else "Confidential"
                loc = location_elem.text.strip() if location_elem else location
                job_url = link_elem["href"] if link_elem and "href" in link_elem.attrs else ""

                description = f"Role: {title} at {company}. Location: {loc}."

                # Optional: Fetch detailed job description page
                if job_url:
                    try:
                        detail_res = requests.get(job_url, headers=headers, timeout=5) # type: ignore
                        if detail_res.status_code == 200:
                            detail_soup = BeautifulSoup(detail_res.text, "html.parser")
                            desc_elem = detail_soup.find("div", class_="show-more-less-html__markup")
                            if desc_elem:
                                description = desc_elem.text.strip()
                    except Exception:
                        pass

                jobs.append({
                    "title": title,
                    "company": company,
                    "location": loc,
                    "description": description,
                    "url": job_url,
                    "source": "LinkedIn"
                })
            except Exception as inner_e:
                continue

    except Exception as e:
        print(f"[LinkedIn Scraper Error]: {e}")

    return jobs


if __name__ == "__main__":
    results = scrape_linkedin("Python Developer", "India", 5)
    print(f"LinkedIn Scraped {len(results)} jobs.")