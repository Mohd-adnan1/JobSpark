import io
import re
from typing import Dict, Any
import pdfplumber
from app.services.nlp.matcher import SkillExtractor


class ResumeParserService:
    def __init__(self):
        self.skill_extractor = SkillExtractor()

    def extract_text_from_pdf(self, file_bytes: bytes) -> str:
        text = ""
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        return text.strip()

    def parse_resume(self, file_bytes: bytes) -> Dict[str, Any]:
        raw_text = self.extract_text_from_pdf(file_bytes)

        # Regex patterns for contact details
        email_pattern = r'[a-zA-Z0-9%+-.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        phone_pattern = r'\(?\+?\d{1,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4}'

        emails = re.findall(email_pattern, raw_text)
        phones = re.findall(phone_pattern, raw_text)

        extracted_skills = self.skill_extractor.extract_skills(raw_text)

        return {
            "raw_text": raw_text,
            "contact_info": {
                "email": emails[0] if emails else None,
                "phone": phones[0] if phones else None
            },
            "extracted_skills": sorted(list(extracted_skills))
        }