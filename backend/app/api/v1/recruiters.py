from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import List, Optional

router = APIRouter(prefix="/recruiters", tags=["Recruiters"])


class RecruiterProfile(BaseModel):
    name: str
    email: EmailStr
    company: str


class ContactCandidateRequest(BaseModel):
    candidate_email: EmailStr
    job_id: int
    message: str


@router.get("/profile")
def get_recruiter_profile():
    """Retrieve recruiter profile details."""
    return {
        "id": 1,
        "name": "Recruiter Lead",
        "email": "recruiter@company.com",
        "company": "TechCorp Solutions"
    }


@router.post("/contact-candidate")
def contact_candidate(payload: ContactCandidateRequest):
    """Dispatch email/notification to a matched candidate."""
    return {
        "status": "success",
        "message": f"Message sent to {payload.candidate_email} regarding Job ID {payload.job_id}."
    }


@router.get("/candidates/shortlist")
def get_shortlisted_candidates():
    """Retrieve candidates shortlisted by recruiters."""
    return {
        "shortlisted": [
            {"candidate_id": 1, "name": "Adnan Zohaib", "match_score": 94.0, "status": "Under Review"},
            {"candidate_id": 2, "name": "Priya Sharma", "match_score": 88.5, "status": "Interview Scheduled"}
        ]
    }