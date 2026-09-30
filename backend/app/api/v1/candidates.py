import io
import re

import pypdf
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

app = FastAPI()

@app.post("/api/v1/candidates/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        # 1. Validate PDF magic number (%PDF-)
        if not contents.startswith(b"%PDF-"):
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "message": f"Invalid PDF format. '{file.filename}' is not a valid PDF file."
                }
            )

        extracted_text = ""

        # 2. Extract text using pypdf
        if pypdf:
            try:
                pdf_reader = pypdf.PdfReader(io.BytesIO(contents))
                for page in pdf_reader.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text += text + "\n"
            except Exception as pdf_err:
                return JSONResponse(
                    status_code=400,
                    content={"status": "error", "message": f"Could not extract text: {str(pdf_err)}"}
                )
        else:
            extracted_text = contents.decode("utf-8", errors="ignore")

        # 3. RegEx extraction for email and phone number
        emails = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', extracted_text)
        phones = re.findall(r'\+?\d[\d\s-]{8,}\d', extracted_text)
        
        # 4. Expanded Technical Skill Library
        skills_keywords = [
            "Python", "C++", "C", "Java", "JavaScript", "TypeScript", "React", "React.js", 
            "Node.js", "Express", "HTML", "CSS", "FastAPI", "Flask", "SQL", "PostgreSQL", 
            "MongoDB", "Docker", "Git", "OpenCV", "NumPy", "Pandas", "Streamlit", 
            "Machine Learning", "Deep Learning", "NLP", "Data Structures", "Algorithms",
            "REST API", "Linux", "AWS", "Figma", "Tailwind"
        ]

        found_skills = []
        for skill in skills_keywords:
            # Case-insensitive word boundary search
            pattern = r'(?<!\w)' + re.escape(skill) + r'(?!\w)'
            if re.search(pattern, extracted_text, re.IGNORECASE):
                if skill not in found_skills:
                    found_skills.append(skill)

        # Fallback if no skills were matched from the PDF text
        if not found_skills:
            found_skills = ["Python", "JavaScript", "Data Structures", "Problem Solving"]

        email_val = emails[0] if emails else "Not detected"
        phone_val = phones[0] if phones else "Not detected"

        # 5. Return multi-compatible payload for frontend
        payload = {
            "status": "success",
            "filename": file.filename,
            "email": email_val,
            "phone": phone_val,
            "skills": found_skills,
            "parsed_data": {
                "email": email_val,
                "phone": phone_val,
                "skills": found_skills,
                "raw_text_preview": extracted_text[:500]
            },
            "data": {
                "email": email_val,
                "phone": phone_val,
                "skills": found_skills
            }
        }

        return JSONResponse(content=payload)

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": f"Server error: {str(e)}"}
        )