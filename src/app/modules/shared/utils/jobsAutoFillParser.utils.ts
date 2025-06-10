import { FormArray, FormControl } from "@angular/forms";

// Extract min and max values from a range object
export function extractRange(range: { min: string | null; max: string | null }): { min: number | null; max: number | null } {
  if (!range || (range.min === "Not Mentioned" && range.max === "Not Mentioned")) {
    return { min: null, max: null };
  }

  const min = range.min && range.min !== "Not Mentioned" ? parseInt(range.min, 10) : null;
  const max = range.max && range.max !== "Not Mentioned" ? parseInt(range.max, 10) : null;

  return {
    min: min !== null && isNaN(min) ? null : min,
    max: max !== null && isNaN(max) ? null : max,
  };
}

// Populate a FormArray with a list of skills, filtering out long ones
export function populateFormArray(formArray: FormArray, skills: string[]): void {
  formArray.clear(); // Clear the existing values in the FormArray
  // Check if the skills array contains only "Not Mentioned" or is empty
  if (!skills || skills.length === 0 || (skills.length === 1 && skills[0] === "Not Mentioned")) {
    return; // Leave the FormArray empty (reset)
  }

  skills
    .filter((skill) => skill.length <= 30) // Skip skills longer than 30 characters
    .forEach((skill) => formArray.push(new FormControl(skill))); // Add only valid skills
}

// Autofill job details into the form
export function autofillJobDetailsToForm(job: any, jobForm: any): void {
  // Extract and process ranges
  const experienceRange = extractRange(job.experienceRange || {});
  const salaryRange = extractRange(job.salaryRange || {});

  // Patch values to the form
  jobForm.patchValue({
    htmlJobDescription: job?.formattedHTML ? job.formattedHTML : "",
    jobTitle: job.jobTitle !== "Not Mentioned" ? job.jobTitle : null,
    cityControl: job.location !== "Not Mentioned" ? job.location : null,
    workMode: job.workMode !== "Not Mentioned" ? job.workMode : null,
    typeofEmployment: job.typeOfEmployment !== "Not Mentioned" ? job.typeOfEmployment : null,
    department: job.department !== "Not Mentioned" ? job.department : null,
    salaryRange: {
      min: salaryRange.min,
      max: salaryRange.max,
    },
    experienceRange: {
      min: experienceRange.min,
      max: experienceRange.max,
    },
  });

  populateFormArray(jobForm.get("coreSkills") as FormArray, job.coreSkills || []);
  populateFormArray(jobForm.get("softSkills") as FormArray, job.softSkills || []);
  populateFormArray(jobForm.get("technicalSkills") as FormArray, job.technicalSkills || []);
  populateFormArray(jobForm.get("miscellaneousSkills") as FormArray, job.goodToHaveSkills || []);
}
