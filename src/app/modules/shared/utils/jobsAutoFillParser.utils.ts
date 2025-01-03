import { FormArray, FormControl } from '@angular/forms';

// Extract min and max values from a range object
export function extractRange(range: { min: string | null, max: string | null }): { min: number | null, max: number | null } {
  if (!range || (range.min === "Not Mentioned" && range.max === "Not Mentioned")) {
    return { min: null, max: null };
  }

  const min = (range.min && range.min !== "Not Mentioned") ? parseInt(range.min, 10) : null;
  const max = (range.max && range.max !== "Not Mentioned") ? parseInt(range.max, 10) : null;

  return { min: min !== null && isNaN(min) ? null : min, max: max !== null && isNaN(max) ? null : max };
}

// Populate a FormArray with a list of skills, filtering out long ones
export function populateFormArray(formArray: FormArray, skills: string[]): void {
  formArray.clear(); // Clear the existing values in the FormArray
  skills
    .filter(skill => skill.length <= 30) // Skip skills longer than 30 characters
    .forEach(skill => formArray.push(new FormControl(skill))); // Add only valid skills
}

// Autofill job details into the form
export function autofillJobDetailsToForm(job: any, newJd: string, jobForm: any): void {
  // Extract and process ranges
  const experienceRange = extractRange(job.experienceRange || {});
  const salaryRange = extractRange(job.salaryRange || {});

  // Patch values to the form
  jobForm.patchValue({
    jobDescription: newJd,
    jobTitle: job.jobTitle || '',
    location: job.location.toLowerCase() || '',
    workMode: job.workMode.toLowerCase() || '',
    noticePeriod: job.noticePeriod || 'Not Mentioned',
    typeofEmployment: job.typeOfEmployment || '',
    department: job.department || '',
    salaryRange: {
      min: salaryRange.min,
      max: salaryRange.max,
    },
    experienceRange: {
      min: experienceRange.min,
      max: experienceRange.max,
    },
  });
  // Populate FormArrays for skills
  populateFormArray(jobForm.get('coreSkills') as FormArray, job.coreSkills || []);
  populateFormArray(jobForm.get('softSkills') as FormArray, job.softSkills || []);
  populateFormArray(jobForm.get('technicalSkills') as FormArray, job.technicalSkills || []);

  // Handle "mislaneiousSkills" if present
  if (job.goodToHaveSkills) {
    populateFormArray(jobForm.get('mislaneiousSkills') as FormArray, job.goodToHaveSkills || []);
  }
}
