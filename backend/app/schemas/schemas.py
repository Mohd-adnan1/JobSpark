from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str  # "candidate" or "recruiter"


class UserResponse(BaseModel):
    id: int
    email: str
    role: str

    class Config:
        from_attributes = True


class JobCreate(BaseModel):
    title: str
    company: str
    location: str = "Remote"
    description: str


class JobResponse(JobCreate):
    id: int
    required_skills: List[str]
    source: str
    created_at: datetime

    class Config:
        from_attributes = True


class MatchRequest(BaseModel):
    resume_text: str
    job_description: str


class MatchResponse(BaseModel):
    overall_match_percentage: float
    hard_skill_score: float
    semantic_context_score: float
    candidate_skills: List[str]
    job_required_skills: List[str]
    matched_skills: List[str]
    missing_skills: List[str]
    additional_candidate_skills: List[str]