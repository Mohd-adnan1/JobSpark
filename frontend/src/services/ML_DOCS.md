# JobSpark AI Engine: Machine Learning & NLP Technical Architecture

## Executive Overview
**JobSpark** is a full-stack, bi-directional job recommendation, NLP parsing, and automated resume generation platform. The system bridges candidate profiles and recruiter specifications using transformer-based semantic embeddings, entity recognition (NER), skill normalization, and a hybrid multi-criteria ranking algorithm.

---

## 1. Natural Language Processing & Feature Extraction

### A. Resume Parsing & Named Entity Recognition (NER)
* **Engine:** Rule-enhanced Regex + Transformer PDF Text Extraction (`pypdf` / `spaCy`).
* **Workflow:**
  1. **Binary Validation:** Validates PDF magic bytes (`%PDF-`) to prevent corrupted uploads.
  2. **In-Memory Text Extraction:** Converts unstructured PDF streams into raw text tokens.
  3. **Regex Entity Matching:** Uses regular expressions for contact information extraction:
     * *Email:* `[\w\.-]+@[\w\.-]+\.\w+`
     * *Phone:* `\+?\d[\d\s-]{8,}\d`
  4. **Skill Taxonomy Normalization:** Matches candidate tokens against a dictionary of technical skills (`Python`, `FastAPI`, `React`, `C++`, `Machine Learning`, `OpenCV`, etc.) using case-insensitive boundary assertions (`(?<!\w)SKILL(?!\w)`).

---

## 2. Machine Learning & Matching Algorithms

### A. Contextual Embeddings (Sentence-BERT)
* **Model Architecture:** Sentence-BERT (`all-MiniLM-L6-v2`) fine-tuned for semantic textual similarity.
* **Dimensionality:** 384-dimensional dense vector space.
* **Functionality:** Maps resumes ($\mathbf{v}_r$) and job descriptions ($\mathbf{v}_j$) into a shared latent space where semantically similar concepts (e.g., *"Built REST APIs"* and *"Backend Endpoint Engineering"*) lie close together.

### B. Cosine Similarity Measure
Quantifies semantic alignment between candidate vectors ($\mathbf{v}_r$) and job description vectors ($\mathbf{v}_j$):

$$\text{Cosine Similarity}(\mathbf{v}_r, \mathbf{v}_j) = \frac{\mathbf{v}_r \cdot \mathbf{v}_j}{\Vert{}\mathbf{v}_r\Vert{} \Vert{}\mathbf{v}_j\Vert{}}$$

---

### C. Hybrid Ranking Score Formula
To optimize both deep semantic context and exact hard-skill overlaps, JobSpark evaluates candidates using a weighted hybrid scoring function:

$$\text{Final Score} = w_1 \cdot S_{\text{semantic}} + w_2 \cdot J_{\text{skill}} + w_3 \cdot S_{\text{edu}}$$

Where:
* **$S_{\text{semantic}}$ (50% Weight):** Cosine similarity between S-BERT embeddings.
* **$J_{\text{skill}}$ (35% Weight):** Jaccard Similarity index representing skill intersection:
  $$J_{\text{skill}} = \frac{\vert{}S_{\text{candidate}} \cap S_{\text{required}}\vert{}}{\vert{}S_{\text{candidate}} \cup S_{\text{required}}\vert{}}$$
* **$S_{\text{edu}}$ (15% Weight):** Qualification alignment score (Degree/Diploma matching).

---

## 3. Automated Document Generation Engine

* **Library:** `python-docx`
* **Output Formats:** Microsoft Word (`.docx`) & PDF (`.pdf`)
* **Styling Rules:** Dynamically applies typographic hierarchies (Heading levels, RGB themes for Modern Blue, Classic Charcoal, and Executive Green) and generates structured sections for Personal Info, Summary, Tech Stack, Education, Work Experience, Internships, and Projects.
