from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "candidate" or "recruiter"
    created_at = Column(DateTime, default=datetime.utcnow)

    candidate_profile = relationship("CandidateProfile", back_populates="user", uselist=False)
    recruiter_profile = relationship("RecruiterProfile", back_populates="user", uselist=False)


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    full_name = Column(String, nullable=False)
    bio = Column(Text, nullable=True)
    resume_text = Column(Text, nullable=True)
    extracted_skills = Column(JSON, default=[])  # Stored as list of strings

    user = relationship("User", back_populates="candidate_profile")


class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    company_name = Column(String, nullable=False)
    contact_email = Column(String, nullable=False)
    linkedin_url = Column(String, nullable=True)

    user = relationship("User", back_populates="recruiter_profile")
    jobs = relationship("JobPosting", back_populates="recruiter")


class JobPosting(Base):
    __tablename__ = "job_postings"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("recruiter_profiles.id"))
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String, default="Remote")
    description = Column(Text, nullable=False)
    required_skills = Column(JSON, default=[])
    source = Column(String, default="Platform")  # "Platform" or "Scraped"
    created_at = Column(DateTime, default=datetime.utcnow)

    recruiter = relationship("RecruiterProfile", back_populates="jobs")