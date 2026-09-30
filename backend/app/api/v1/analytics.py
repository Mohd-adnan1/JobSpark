from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview")
def get_analytics_overview() -> Dict[str, Any]:
    """Provides high-level system metrics across jobs, candidates, and platforms."""
    return {
        "total_candidates": 128,
        "total_jobs_posted": 42,
        "total_scraped_jobs": 150,
        "average_match_score": 81.2,
        "platform_breakdown": {
            "LinkedIn": 60,
            "Naukri": 50,
            "Unstop": 40
        }
    }


@router.get("/skills-demand")
def get_top_skills_demand() -> Dict[str, Any]:
    """Returns top extracted skills in demand across job descriptions."""
    return {
        "top_skills": [
            {"skill": "Python", "count": 120},
            {"skill": "FastAPI", "count": 89},
            {"skill": "React", "count": 75},
            {"skill": "Docker", "count": 68},
            {"skill": "PostgreSQL", "count": 60},
            {"skill": "NLP", "count": 48}
        ]
    }