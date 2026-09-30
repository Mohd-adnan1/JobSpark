from fastapi import APIRouter, Depends, HTTPException # pyright: ignore[reportMissingImports]
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import JobPosting
from app.schemas.schemas import JobCreate, JobResponse
from app.services.nlp.matcher import SkillExtractor

router = APIRouter(prefix="/jobs", tags=["Jobs"])
extractor = SkillExtractor()


@router.post("/", response_model=JobResponse)
def create_job_posting(job: JobCreate, db: Session = Depends(get_db)):
    """Posts a new job and automatically extracts required skills using spaCy."""
    extracted = sorted(list(extractor.extract_skills(job.description)))

    db_job = JobPosting(
        title=job.title,
        company=job.company,
        location=job.location,
        description=job.description,
        required_skills=extracted,
        source="Platform"
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job


@router.get("/", response_model=List[JobResponse])
def list_jobs(db: Session = Depends(get_db)):
    """Lists all available job postings for candidates."""
    return db.query(JobPosting).all()