import json
import re
from typing import Any, Dict, List, Optional, Set

import numpy as np
import spacy
from sentence_transformers import SentenceTransformer, util
from spacy.matcher import PhraseMatcher


class SkillExtractor:
    """Extracts hard technical and soft skills from raw text using spaCy Phrase Matching."""

    def __init__(self, skill_taxonomy: Optional[List[str]] = None):
        # Load lightweight spacy model
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            from spacy.cli.download import download

            download("en_core_web_sm")
            self.nlp = spacy.load("en_core_web_sm")

        # Default taxonomy if none provided
        if skill_taxonomy is None:
            self.skill_taxonomy = [
                "Python", "FastAPI", "Flask", "Django", "React", "Node.js", "JavaScript",
                "TypeScript", "SQL", "PostgreSQL", "MongoDB", "Docker", "Kubernetes",
                "AWS", "GCP", "Azure", "Machine Learning", "Deep Learning", "NLP",
                "spaCy", "PyTorch", "TensorFlow", "Pandas", "NumPy", "Scikit-Learn",
                "Git", "REST API", "GraphQL", "C++", "Java", "HTML", "CSS", "Tailwind"
            ]
        else:
            self.skill_taxonomy = skill_taxonomy

        self.matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")
        patterns = [self.nlp.make_doc(text) for text in self.skill_taxonomy]
        self.matcher.add("SKILL_PATTERNS", patterns)

    def extract_skills(self, text: str) -> Set[str]:
        doc = self.nlp(text)
        matches = self.matcher(doc)
        extracted = set()
        for _, start, end in matches:
            span = doc[start:end]
            extracted.add(span.text.title())
        return extracted


class JobSkillMatcher:
    """Computes exact skill overlap and semantic context similarity using embeddings."""

    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.extractor = SkillExtractor()
        self.embedder = SentenceTransformer(model_name)

    def calculate_match(
        self,
        resume_text: str,
        job_description: str,
        w_exact: float = 0.6,
        w_semantic: float = 0.4
    ) -> Dict[str, Any]:
        # 1. Skill Extraction
        candidate_skills = self.extractor.extract_skills(resume_text)
        job_skills = self.extractor.extract_skills(job_description)

        # Exact Skill Math
        if job_skills:
            matched_skills = candidate_skills.intersection(job_skills)
            missing_skills = job_skills - candidate_skills
            exact_score = (len(matched_skills) / len(job_skills)) * 100.0
        else:
            matched_skills = candidate_skills
            missing_skills = set()
            exact_score = 100.0 if candidate_skills else 0.0

        extra_skills = candidate_skills - job_skills

        # 2. Semantic Embedding Similarity
        resume_emb = self.embedder.encode(resume_text, convert_to_tensor=True)
        job_emb = self.embedder.encode(job_description, convert_to_tensor=True)

        cosine_sim = util.cos_sim(resume_emb, job_emb).item()
        semantic_score = max(0.0, min(100.0, float(cosine_sim * 100.0)))

        # 3. Overall Weighted Score
        overall_score = round((w_exact * exact_score) + (w_semantic * semantic_score), 2)

        return {
            "overall_match_percentage": overall_score,
            "hard_skill_score": round(exact_score, 2),
            "semantic_context_score": round(semantic_score, 2),
            "candidate_skills": sorted(list(candidate_skills)),
            "job_required_skills": sorted(list(job_skills)),
            "matched_skills": sorted(list(matched_skills)),
            "missing_skills": sorted(list(missing_skills)),
            "additional_candidate_skills": sorted(list(extra_skills)),
        }


# --- QUICK TEST DEMO ---
if __name__ == "__main__":
    matcher = JobSkillMatcher()

    sample_resume = """
    Mohd Adnan - Software Engineer
    Proficient in Python, FastAPI, PostgreSQL, and Git.
    Built machine learning pipelines using PyTorch, spaCy, Pandas, and Scikit-Learn.
    Experience working with Docker containers and REST APIs.
    """

    sample_job = """
    We are looking for a Backend / ML Engineer.
    Requirements:
    - Experience in Python and FastAPI to build REST APIs.
    - Knowledge of PostgreSQL and Docker.
    - Familiarity with Machine Learning, NLP, and spaCy.
    - AWS and Kubernetes knowledge is a plus.
    """

    results = matcher.calculate_match(sample_resume, sample_job)
    print(json.dumps(results, indent=2))