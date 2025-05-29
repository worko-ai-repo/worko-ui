import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-add-company-form',
  templateUrl: './admin-add-company-form.component.html',
  styleUrls: ['./admin-add-company-form.component.scss']
})
export class AdminAddCompanyFormComponent {

  @Input() title: string = "Add Company"; // Default title
  @Input() companyData: any; // Company details from parent
  @Input() actionType: any;
  @Output() formSubmitted = new EventEmitter<any>(); // Event to send data to parent

  @ViewChild('hiddenFileInput') fileInput!: ElementRef; // Reference to the hidden file input

  ngxSummerConfig: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      link: [["link", ["linkDialogShow", "unlink"]]],
    },
    height: "200px",
    uploadImagePath: "/api/upload",
    toolbar: [
      ["misc", ["undo", "redo"]],
      ["font", ["bold", "italic", "underline", "strikethrough", "superscript", "subscript", "clear"]],
      ["fontsize", ["fontname", "fontsize", "color"]],
      ["para", ["style", "ul", "ol", "paragraph", "height"]],
      ["insert", ["link", "hr"]]
    ],
  };

  companyForm: FormGroup;

  logoFileName: string = ''; // Store file name
  selectedLogoFile: File | null = null;
  logoError: string | null = null;

  teamSizeOptions: any = [
    {
      name: "<100",
      value: "0-100"
    },
    {
      name: "100-500",
      value: "100-500"
    },
    {
      name: "500-1000",
      value: "500-1000"
    },
    {
      name: "1000-5000",
      value: "1000-5000"
    },
    {
      name: "5000-10000",
      value: "5000-10000"
    },
    {
      name: "10000-50000",
      value: "10000-50000"
    },
    {
      name: "50000-100000",
      value: "50000-100000"
    },
    {
      name: "100000+",
      value: "100000"
    },
  ]


  industryTypeOptions: any = [

    { name: "Accounting / Auditing", value: "Accounting / Auditing" },
    { name: "Advertising & Marketing", value: "Advertising & Marketing" },
    { name: "Agriculture / Forestry / Fishing", value: "Agriculture / Forestry / Fishing" },
    { name: "Analytics / KPO / Research", value: "Analytics / KPO / Research" },
    { name: "Animation & VFX", value: "Animation & VFX" },
    { name: "Architecture / Interior Design", value: "Architecture / Interior Design" },
    { name: "Auto Components", value: "Auto Components" },
    { name: "Aviation", value: "Aviation" },
    { name: "Automobile", value: "Automobile" },
    { name: "Banking", value: "Banking" },
    { name: "Beauty & Personal Care", value: "Beauty & Personal Care" },
    { name: "Beverage", value: "Beverage" },
    { name: "Biotechnology", value: "Biotechnology" },
    { name: "BPO / Call Centre", value: "BPO / Call Centre" },
    { name: "Building Material", value: "Building Material" },
    { name: "Chemicals", value: "Chemicals" },
    { name: "Clinical Research / Contract Research", value: "Clinical Research / Contract Research" },
    { name: "Consumer Electronics & Appliances", value: "Consumer Electronics & Appliances" },
    { name: "Content Development / Language", value: "Content Development / Language " },
    { name: "Courier / Logistics", value: "Courier / Logistics" },
    { name: "Defence & Aerospace", value: "Defence & Aerospace" },
    { name: "Design", value: "Design" },
    { name: "E-commerce", value: "E-commerce" },
    { name: "E-Learning / EdTech", value: "e-Learning / EdTech" },
    { name: "Education / Training", value: "Education / Training" },
    { name: "Electrical Equipment", value: "Electrical Equipment" },
    { name: "Electronic Components / Semiconductors", value: "Electronic Components / Semiconductors" },
    { name: "Electronics Manufacturing", value: "Electronics Manufacturing" },
    { name: "Emerging Technologies", value: "Emerging Technologies" },
    { name: "Engineering & Construction", value: "Engineering & Construction" },
    { name: "Events / Live Entertainment", value: "Events / Live Entertainment" },
    { name: "D2C", value: "D2C" },
    { name: "Facility Management Services", value: "Facility Management Services" },
    { name: "Fertilizers / Pesticides / Agro chemicals", value: "Fertilizers / Pesticides / Agro chemicals" },
    { name: "Film / Music / Entertainment", value: "Film / Music / Entertainment" },
    { name: "Financial Services", value: "Financial Services" },
    { name: "FinTech / Payments", value: "FinTech / Payments" },
    { name: "Fitness & Wellness", value: "Fitness & Wellness" },
    { name: "FMCG", value: "FMCG" },
    { name: "Food Processing", value: "Food Processing" },
    { name: "Furniture & Furnishing", value: "Furniture & Furnishing" },
    { name: "Gaming", value: "Gaming" },
    { name: "Gems & Jewellery", value: "Gems & Jewellery" },
    { name: "Hardware & Networking", value: "Hardware & Networking" },
    { name: "Hospitality", value: "Hospitality" },
    { name: "Hotels & Restaurants", value: "Hotels & Restaurants" },
    { name: "Import & Export", value: "Import & Export" },
    { name: "Industrial Automation", value: "Industrial Automation" },
    { name: "Industrial Equipment / Machinery", value: "Industrial Equipment / Machinery" },
    { name: "Insurance", value: "Insurance" },
    { name: "Internet", value: "Internet" },
    { name: "Investment Banking / Venture Capital / Private Equity", value: "Investment Banking / Venture Capital / Private Equity" },
    { name: "Manufacturing", value: "Manufacturing" },
    { name: "Iron & Steel", value: "Iron & Steel" },
    { name: "IT Services & Consulting", value: "IT Services & Consulting" },
    { name: "Law Enforcement / Security Services", value: "Law Enforcement / Security Services" },
    { name: "Leather", value: "Leather" },
    { name: "Legal", value: "Legal" },
    { name: "Management Consulting", value: "Management Consulting" },
    { name: "Manufacturing", value: "Manufacturing" },
    { name: "Medical Devices & Equipment", value: "Medical Devices & Equipment" },
    { name: "Medical Services / Hospital", value: "Medical Services / Hospital" },
    { name: "Metals & Mining", value: "Metals & Mining" },
    { name: "Miscellaneous", value: "Miscellaneous" },
    { name: "NBFC", value: "NBFC" },
    { name: "NGO / Social Services / Industry Associations", value: "NGO / Social Services / Industry Associations" },
    { name: "Oil & Gas", value: "Oil & Gas" },
    { name: "Packaging & Containers", value: "Packaging & Containers" },
    { name: "Petrochemical / Plastics / Rubber", value: "Petrochemical / Plastics / Rubber" },
    { name: "Pharmaceutical & Life Sciences", value: "Pharmaceutical & Life Sciences" },
    { name: "Ports & Shipping", value: "Ports & Shipping" },
    { name: "Power", value: "Power" },
    { name: "Professional Services / Project Management", value: "Professional Services / Project Management" },
    { name: "Printing & Publishing", value: "Printing & Publishing" },
    { name: "Pulp & Paper", value: "Pulp & Paper" },
    { name: "Railways", value: "Railways" },
    { name: "Real Estate", value: "Real Estate" },
    { name: "Recruitment / Staffing", value: "Recruitment / Staffing" },
    { name: "Retail", value: "Retail" },
    { name: "SAAS", value: "SAAS" },
    { name: "Software Product", value: "Software Product" },
    { name: "Sports / Leisure & Recreation", value: "Sports / Leisure & Recreation" },
    { name: "Stock Broking", value: "Stock broking" },
    { name: "Telecom / ISP", value: "Telecom / ISP" },
    { name: "Textile & Apparel ", value: "Textile & Apparel" },
    { name: "Travel & Tourism", value: "Travel & Tourism" },
    { name: "Taxi / Mobility", value: "Taxi / Mobility" },
    { name: "TV / Radio", value: "TV / Radio" },
    { name: "Transport / Logistics", value: "Transport / Logistics" },
    { name: "Warehousing", value: "Warehousing" },
    { name: "Water Treatment / Waste Management", value: "Water Treatment / Waste Management" },
  ]


  constructor(private fb: FormBuilder) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      website: ['', [Validators.pattern(/https?:\/\/.+/)]],
      linkedIn: ['', [Validators.required, Validators.pattern(/^(https?:\/\/((www|[in]{2})\.)?linkedin\.com\/(company\/[a-zA-Z0-9_\-&]+|in\/[a-zA-Z0-9-]+)\/?)$/)]],
      carrierPage: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]],
      industry: ['', Validators.required],
      teamSize: ['', [Validators.required, Validators.min(1)]], // Ensure number input with min value,
      aboutCompany: ['', [Validators.minLength(100)]],
    });
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['companyData'] && this.companyData) {
  //     this.populateForm(this.companyData);
  //   }
  // }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['companyData']) {
      if (this.companyData) {
        this.populateForm(this.companyData);
      } else {
        this.companyForm.reset();  // Clear form when no company data is provided
      }
    }
  }

  populateForm(company: any) {

    if (this.actionType === 'approve' && this.companyData?.companyDetail) {
      company = this.companyData.companyDetail;
    }

    // console.log("Industry Options:", this.industryTypeOptions);
    // console.log("Company Industry:", company.industry);

    // Ensure company.industry is a trimmed lowercase string
    const industryValue = company.industry ? company.industry.toLowerCase().trim() : '';

    // const matchedIndustry = this.industryTypeOptions.find((industry: any) =>
    //   industry.value.toLowerCase().trim().includes(industryValue)
    // );

    // Find the exact match
    const matchedIndustry = this.industryTypeOptions.find((industry: any) =>
      industry.value.toLowerCase().trim() === industryValue
    );

    // console.log("Matched Industry:", matchedIndustry); // Debug matched industry


    this.companyForm.patchValue({
      name: company.name || '',
      website: company.website || '',
      linkedIn: company.linkedIn || '',
      carrierPage: company.carrierPage || '',
      industry: matchedIndustry ? matchedIndustry.value : '', // Match value from options,
      teamSize: company.teamSize || '',
      aboutCompany: company.aboutCompany || '',
    });

    this.logoFileName = company.logo || "";
  }

  /** Opens the hidden file input */
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelect(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];

      // Only accept valid image types
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        this.logoError = 'Only JPG and PNG image formats are allowed.';
        this.clearLogo();
        return;
      }

      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        this.logoError = 'File size must be less than 5MB.';
        this.clearLogo();
        return;
      }

      this.selectedLogoFile = file;
      this.logoFileName = file.name;
      this.logoError = null;
    }
  }

  clearLogo() {
    this.selectedLogoFile = null;
    this.logoFileName = '';
  }


  /**
  * Checks if a form control is invalid, touched, or dirty.
  * @param controlName - The name of the control to check.
  * @returns `true` if the control is invalid and touched/dirty, otherwise `false`.
  */
  isInvalid(controlName: string): boolean {
    const control = this.companyForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  /**
   * Retrieves the error message for a given form control.
   * @param controlName - The name of the control to retrieve the error message for.
   * @returns The error message string.
   */
  getErrorMessage(controlName: string): string {
    const control = this.companyForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required.';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Minimum ${minLength} characters are required.`;
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid URL.';
    }
    if (controlName === 'teamSize' && control?.hasError('min')) {
      return 'Team size must be at least 1.';
    }

    return '';
  }

  // onSubmit() {
  //   if (this.companyForm.valid) {
  //     console.log('Form Submitted:', this.companyForm.value);
  //   } else {
  //     console.error('Form is invalid');
  //   }
  // }

  onSubmit() {
    if (this.companyForm.valid && !this.logoError) {
      let companyData = this.companyForm.value;

      // Ensuring optional fields are sent as empty strings if not provided
      companyData.website = companyData.website || "";
      companyData.aboutCompany = companyData.aboutCompany || "";

      const payload: any = {
        action: this.actionType,
        data: companyData
      };

      if (this.selectedLogoFile) {
        payload.logoFile = this.selectedLogoFile;
      }

      this.formSubmitted.emit(payload);
    } else {
      console.error('Form is invalid or logo not selected');
    }
  }


  getButtonLabel(): string {
    switch (this.actionType) {
      case 'add':
        return 'Submit';
      case 'approve':
        return 'Approve';
      case 'edit':
        return 'Update';
      default:
        return 'Submit'; // Default to Submit if actionType is undefined
    }
  }




}
