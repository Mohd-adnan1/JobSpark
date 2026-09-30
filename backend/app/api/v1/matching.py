from fastapi import APIRouter # pyright: ignore[reportMissingImports]
from app.schemas.schemas import MatchRequest, MatchResponse
from app.services.nlp.matcher import JobSkillMatcher

router = APIRouter(prefix="/matching", tags=["Matching"])
matcher = JobSkillMatcher()


@router.post("/", response_model=MatchResponse)
def compute_job_match(payload: MatchRequest):
    """Calculates exact skill overlap and semantic similarity between candidate resume and job description."""
    results = matcher.Calculate_match(payload.resume_text, payload.job_description) # type: ignore
    return results