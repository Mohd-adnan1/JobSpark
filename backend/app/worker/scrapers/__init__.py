from typing import List, Dict, Any
from app.services.nlp.matcher import SkillExtractor

# Import your 3 scrapers
from app.worker.scrapers.linkedin_scraper import scrape_linkedin
from app.worker.scrapers.naukri_scraper import scrape_naukri
from app.worker.scrapers.unstop_scraper import scrape_unstop


class MultiPlatformScraperManager:
    """Aggregates scraped jobs from LinkedIn, Naukri, and Unstop and enriches them with NLP skill extraction."""

    def __init__(self):
        self.extractor = SkillExtractor()

    def run_all_scrapers(self) -> List[Dict[str, Any]]:
        all_jobs = []

        # 1. Fetch from LinkedIn Scraper
        try:
            linkedin_jobs = scrape_linkedin()
            all_jobs.extend(linkedin_jobs)
        except Exception as e:
            print(f"[Scraper Error] LinkedIn: {e}")

        # 2. Fetch from Naukri Scraper
        try:
            naukri_jobs = scrape_naukri()
            all_jobs.extend(naukri_jobs)
        except Exception as e:
            print(f"[Scraper Error] Naukri: {e}")

        # 3. Fetch from Unstop Scraper
        try:
            unstop_jobs = scrape_unstop()
            all_jobs.extend(unstop_jobs)
        except Exception as e:
            print(f"[Scraper Error] Unstop: {e}")

        # Auto-extract required skills for every job found across platforms
        for job in all_jobs:
            if "description" in job and job["description"]:
                job["required_skills"] = sorted(
                    list(self.extractor.extract_skills(job["description"]))
                )

        return all_jobs