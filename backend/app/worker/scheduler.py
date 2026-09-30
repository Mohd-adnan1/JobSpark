from typing import List, Dict, Any
from app.services.nlp.matcher import SkillExtractor
from app.worker.scrapers.linkedin_scraper import scrape_linkedin
from app.worker.scrapers.naukri_scraper import scrape_naukri
from app.worker.scrapers.unstop_scraper import scrape_unstop


class ScraperManager:
    def __init__(self):
        self.extractor = SkillExtractor()

    def fetch_and_process_all(self, keywords: str = "software engineer") -> List[Dict[str, Any]]:
        all_jobs = []

        # Run scrapers safely
        for scraper_func, name in [(scrape_linkedin, "LinkedIn"), (scrape_naukri, "Naukri"), (scrape_unstop, "Unstop")]:
            try:
                results = scraper_func(keywords=keywords, limit=10) if name != "Unstop" else scraper_func(limit=10)
                all_jobs.extend(results)
            except Exception as e:
                print(f"Failed to scrape {name}: {e}")

        # Extract NLP skills for each job description
        for job in all_jobs:
            if "description" in job and job["description"]:
                extracted = self.extractor.extract_skills(job["description"])
                job["required_skills"] = sorted(list(extracted))

        return all_jobs