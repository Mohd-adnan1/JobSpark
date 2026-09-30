from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from app.services.nlp.matcher import SkillExtractor

router = APIRouter(prefix="/resume-builder", tags=["AI Resume Builder"])
extractor = SkillExtractor()

# --- Request & Response Models ---

class SummaryRequest(BaseModel):
    job_title: str = Field(..., json_schema_extra={"example": "Software Engineer"})
    years_of_experience: int = Field(..., json_schema_extra={"example": 3})
    skills: List[str] = Field(..., json_schema_extra={"example": ["Python", "FastAPI", "Docker", "PostgreSQL"]})
    tone: Optional[str] = Field("impact", json_schema_extra={"example": "impact"})  # Options: impact, concise, executive


class BulletPointRequest(BaseModel):
    role_title: str = Field(..., json_schema_extra={"example": "Backend Developer"})
    raw_bullet: str = Field(..., json_schema_extra={"example": "Built python APIs and fixed database slow queries"})
    metrics: Optional[str] = Field(None, json_schema_extra={"example": "35% latency reduction"})


class TailorRequest(BaseModel):
    resume_text: str = Field(..., json_schema_extra={"example": "Experienced Python developer specializing in FastAPI, REST APIs, and PostgreSQL."})
    job_description: str = Field(..., json_schema_extra={"example": "Seeking a Senior ML/Backend Engineer with expertise in Python, PyTorch, Docker, Kubernetes, and FastAPI."})


class FullResumeRequest(BaseModel):
    full_name: str = Field(..., json_schema_extra={"example": "Mohd Adnan Zohaib"})
    email: str = Field(..., json_schema_extra={"example": "adnan@example.com"})
    target_role: str = Field(..., json_schema_extra={"example": "Full Stack Data Engineer"})
    years_experience: int = Field(..., json_schema_extra={"example": 2})
    skills: List[str] = Field(..., json_schema_extra={"example": ["Python", "React", "FastAPI", "OpenCV"]})
    work_experience: List[Dict[str, Any]] = Field(
        ...,
        json_schema_extra={
            "example": [
                {
                    "company": "TechCorp",
                    "role": "Software Engineer",
                    "duration": "2024 - Present",
                    "description": "Developed backend APIs and managed automated ML pipelines."
                }
            ]
        }
    )

# --- AI Helper Functions ---

ACTION_VERBS = [
    "Architected", "Engineered", "Implemented", "Spearheaded", 
    "Optimized", "Automated", "Streamlined", "Deployed", "Orchestrated"
]

def enrich_bullet_point(role: str, raw: str, metrics: Optional[str] = None) -> List[str]:
    clean_raw = raw.strip().rstrip(".")
    metric_str = f", resulting in {metrics}" if metrics else " to maximize performance and scalability"
    
    variations = [
        f"Engineered end-to-end backend solutions for {role} role by improving {clean_raw}{metric_str}.",
        f"Spearheaded core technical initiatives: {clean_raw}{metric_str}.",
        f"Optimized system architecture by redesigning {clean_raw}{metric_str}."
    ]
    return variations

# --- Endpoints ---

@router.post("/generate-summary")
def generate_summary(payload: SummaryRequest) -> Dict[str, Any]:
    """Generates AI professional summary options based on role, skills, and experience level."""
    skills_formatted = ", ".join(payload.skills) if payload.skills else "modern software tools"
    
    summaries = {
        "impact": f"Results-driven {payload.job_title} with {payload.years_of_experience}+ years of hands-on experience building scalable solutions. Proven expertise in {skills_formatted}. Passionate about deploying efficient, high-performance systems and driving core business value.",
        "executive": f"Accomplished {payload.job_title} bringing {payload.years_of_experience}+ years of technical leadership and hands-on skill in {skills_formatted}. Track record of architecting reliable, production-grade applications and optimizing developer workflows.",
        "concise": f"{payload.job_title} with {payload.years_of_experience}+ years experience specializing in {skills_formatted}. Skilled in clean code principles, performance tuning, and cross-functional team collaboration."
    }
    
    selected_summary = summaries.get((payload.tone or "impact").lower(), summaries["impact"])
    
    return {
        "status": "success",
        "job_title": payload.job_title,
        "selected_tone": payload.tone,
        "generated_summary": selected_summary,
        "alternative_options": summaries
    }


@router.post("/optimize-bullet")
def optimize_bullet_point(payload: BulletPointRequest) -> Dict[str, Any]:
    """Transforms raw resume experience bullet points into high-impact STAR action statements."""
    if not payload.raw_bullet.strip():
        raise HTTPException(status_code=400, detail="Bullet point text cannot be empty.")
        
    extracted_skills = list(extractor.extract_skills(payload.raw_bullet))
    suggestions = enrich_bullet_point(payload.role_title, payload.raw_bullet, payload.metrics)
    
    return {
        "original": payload.raw_bullet,
        "detected_skills": sorted(extracted_skills),
        "ai_optimized_bullets": suggestions
    }


@router.post("/tailor-resume")
def tailor_resume_to_jd(payload: TailorRequest) -> Dict[str, Any]:
    """Compares current resume text against a target Job Description (JD) to identify skill matches and gaps."""
    resume_skills = set(extractor.extract_skills(payload.resume_text))
    jd_skills = set(extractor.extract_skills(payload.job_description))

    matching_skills = sorted(list(resume_skills.intersection(jd_skills)))
    missing_skills = sorted(list(jd_skills.difference(resume_skills)))

    if jd_skills:
        match_score = round((len(matching_skills) / len(jd_skills)) * 100, 1)
    else:
        match_score = 100.0

    recommendations = []
    if missing_skills:
        recommendations.append(f"Add projects or experience highlighting: {', '.join(missing_skills[:5])}.")
    if match_score < 70:
        recommendations.append("Align resume terminology and keywords more closely with the job requirements.")
    else:
        recommendations.append("Strong keyword alignment! Ensure impact metrics are quantified.")

    return {
        "keyword_match_score": match_score,
        "matching_skills": matching_skills,
        "missing_skills_in_resume": missing_skills,
        "tailoring_recommendations": recommendations
    }


@router.post("/generate-full")
def generate_full_ai_resume(payload: FullResumeRequest) -> Dict[str, Any]:
    """Generates a complete structured resume object with AI-enhanced summaries and formatted bullet points."""
    
    # 1. Generate Summary
    skills_str = ", ".join(payload.skills)
    ai_summary = f"Results-driven {payload.target_role} with {payload.years_experience}+ years of experience building reliable software solutions. Proficient in {skills_str} with a focus on system optimization and clean architecture."

    # 2. Enrich Work Experience Bullets
    formatted_experience = []
    for exp in payload.work_experience:
        raw_desc = exp.get("description", "")
        detected = sorted(list(extractor.extract_skills(raw_desc)))
        
        formatted_experience.append({
            "company": exp.get("company"),
            "role": exp.get("role"),
            "duration": exp.get("duration"),
            "original_description": raw_desc,
            "detected_skills": detected,
            "ai_bullet_points": [
                f"Spearheaded engineering initiatives at {exp.get('company')} using {', '.join(detected) if detected else 'modern technologies'}.",
                f"Developed scalable application features: {raw_desc.rstrip('.')}."
            ]
        })

    return {
        "candidate_info": {
            "full_name": payload.full_name,
            "email": payload.email,
            "target_role": payload.target_role,
        },
        "ai_summary": ai_summary,
        "skills": payload.skills,
        "experience": formatted_experience
    }