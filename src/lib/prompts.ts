export const COVER_LETTER_PROMPT = (resume: string, job: string) => `
Act as a career coach. Write a concise, tailored cover letter (180–250 words) using the resume and job description.
- Prioritize measurable achievements
- Match tone to job seniority
- Use European spelling
RESUME:
${resume}

JOB DESCRIPTION:
${job}
`;

export const INTERVIEW_PREP_PROMPT = (role: string, jd: string) => `
You're an interview coach. Create 8 targeted questions for the role "${role}".
For each, include a bullet with what a strong answer covers.
JOB DESCRIPTION:
${jd}
`;

export const DAILY_FOCUS_PROMPT = (metrics: string) => `
You are a job-search planner. Based on the user's recent activity metrics, output a 1-day plan with:
- 3 focus tasks
- 1 networking action
- 1 learning action
Keep it brief and motivating.
METRICS:
${metrics}
`;
