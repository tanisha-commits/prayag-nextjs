export type FormId = "contact" | "dealership";

export type FieldType = "select" | "text" | "email" | "tel" | "number" | "textarea";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  id: string;
  placeholder?: string;
  required: boolean;
  requiredError?: string;
  pattern?: string;
  patternError?: string;
  serverOnlyPattern?: boolean;
  maxLength?: number;
  size?: number;
  rows?: number;
  options?: FieldOption[];
  emptyOption?: string;
  autoComplete?: string;
}

const NAME_PATTERN = "^[A-Za-z\\s]+$";
const EMAIL_PATTERN = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
const CHARS_ONLY = "Please enter characters only.";
const EMAIL_ERROR = "Please enter valid email address";
const REQ = "This Field is required";

export const DEALERSHIP_FIELDS: FieldDef[] = [
  {
    name: "enquiry_type",
    label: "Enquiry Type",
    type: "select",
    id: "edit-enquiry-type",
    required: true,
    requiredError: "This field is required",
    emptyOption: "- Select -",
    options: [
      { value: "Dealership", label: "Dealership" },
      { value: "Distributorship", label: "Distributorship" },
    ],
  },
  {
    name: "name",
    label: "Name",
    type: "text",
    id: "edit-name",
    placeholder: "Your Name",
    required: true,
    requiredError: REQ,
    pattern: NAME_PATTERN,
    patternError: CHARS_ONLY,
    maxLength: 255,
    size: 60,
  },
  {
    name: "e_mail",
    label: "E-mail",
    type: "email",
    id: "edit-e-mail",
    placeholder: "Your email",
    required: true,
    requiredError: REQ,
    pattern: EMAIL_PATTERN,
    patternError: EMAIL_ERROR,
    serverOnlyPattern: true,
    maxLength: 254,
    size: 60,
  },
  {
    name: "phone_number",
    label: "Phone Number",
    type: "tel",
    id: "edit-phone-number",
    placeholder: "Your Phone Number",
    required: true,
    requiredError: REQ,
    maxLength: 128,
    size: 30,
  },
  {
    name: "dealership_requirements",
    label: "Dealership Requirements",
    type: "select",
    id: "edit-dealership-requirements",
    required: true,
    requiredError: REQ,
    emptyOption: "Dealership Requirements",
    options: [
      { value: "CP Faucets", label: "CP Faucets" },
      { value: "PTMT", label: "PTMT" },
      { value: "Pipe & Plumbing", label: "Pipe & Plumbing" },
      { value: "Water Tank", label: "Water Tank" },
      { value: "Sanitaryware", label: "Sanitaryware" },
      { value: "All  option", label: "All  option" },
    ],
  },
  {
    name: "pincode",
    label: "Pincode",
    type: "number",
    id: "edit-pincode",
    placeholder: "Pincode",
    required: true,
    requiredError: REQ,
  },
  {
    name: "company_name",
    label: "Firm Name",
    type: "text",
    id: "edit-company-name",
    placeholder: "Firm Name",
    required: true,
    requiredError: REQ,
    pattern: NAME_PATTERN,
    patternError: CHARS_ONLY,
    maxLength: 255,
    size: 60,
  },
  {
    name: "gst_number",
    label: "GST Number",
    type: "text",
    id: "edit-gst-number",
    placeholder: "Your GST Number",
    required: true,
    requiredError: REQ,
    pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$",
    patternError: "Please enter a valid 15-digit GST number in the format: 22AAAAA0000A1Z5",
    maxLength: 255,
    size: 60,
  },
  {
    name: "alternate_mobile_no",
    label: "Alternate Mobile No",
    type: "tel",
    id: "edit-alternate-mobile-no",
    placeholder: "Alternate Mobile No",
    required: false,
    maxLength: 128,
    size: 30,
  },
  {
    name: "country",
    label: "Country",
    type: "text",
    id: "edit-country",
    placeholder: "Country",
    required: true,
    requiredError: REQ,
    pattern: NAME_PATTERN,
    patternError: CHARS_ONLY,
    maxLength: 255,
    size: 60,
  },
  { name: "state", label: "State", type: "text", id: "edit-state", placeholder: "State", required: true, maxLength: 255, size: 60 },
  { name: "district", label: "District", type: "text", id: "edit-district", placeholder: "District", required: true, maxLength: 255, size: 60 },
  { name: "city", label: "City", type: "text", id: "edit-city", placeholder: "City", required: true, maxLength: 255, size: 60 },
  { name: "address", label: "Address", type: "textarea", id: "edit-address", placeholder: "Address", required: true, rows: 5 },
  { name: "remark", label: "Remark", type: "textarea", id: "edit-remark", placeholder: "Remark", required: false, rows: 5 },
];

export const CONTACT_FIELDS: FieldDef[] = [
  {
    name: "select_enquiry_type",
    label: "Select Enquiry Type",
    type: "select",
    id: "edit-select-enquiry-type",
    required: true,
    requiredError: REQ,
    emptyOption: "- Select -",
    options: [
      { value: "Comments and Suggestions", label: "Comments and Suggestions" },
      {
        value: "Comments and Suggestions Complaints & Grievances",
        label: "Comments and Suggestions Complaints & Grievances",
      },
    ],
  },
  {
    name: "name",
    label: "Name",
    type: "text",
    id: "edit-name--2",
    placeholder: "Name1",
    required: true,
    requiredError: REQ,
    pattern: NAME_PATTERN,
    patternError: CHARS_ONLY,
    maxLength: 255,
    size: 60,
    autoComplete: "off",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    id: "edit-email",
    placeholder: "Email",
    required: true,
    requiredError: REQ,
    pattern: EMAIL_PATTERN,
    patternError: EMAIL_ERROR,
    serverOnlyPattern: true,
    maxLength: 254,
    size: 60,
  },
  {
    name: "subject",
    label: "Phone",
    type: "tel",
    id: "edit-subject",
    placeholder: "Phone",
    required: true,
    requiredError: REQ,
    pattern: "^\\d{10}$",
    patternError: "Please enter valid phone number",
    maxLength: 128,
    size: 30,
  },
  {
    name: "city",
    label: "City",
    type: "text",
    id: "edit-city--2",
    placeholder: "City",
    required: true,
    requiredError: REQ,
    pattern: NAME_PATTERN,
    patternError: CHARS_ONLY,
    maxLength: 255,
    size: 60,
  },
  { name: "pincode", label: "Pincode", type: "number", id: "edit-pincode--2", placeholder: "Pincode", required: false },
  {
    name: "company_name",
    label: "Company Name",
    type: "text",
    id: "edit-company-name--2",
    placeholder: "Company Name",
    required: true,
    requiredError: REQ,
    pattern: NAME_PATTERN,
    patternError: CHARS_ONLY,
    maxLength: 255,
    size: 60,
  },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    id: "edit-address--2",
    placeholder: "Full Address",
    required: true,
    requiredError: REQ,
    rows: 5,
  },
  { name: "message", label: "Message", type: "textarea", id: "edit-message", placeholder: "Message", required: true, rows: 5 },
];

export const FORM_FIELDS: Record<FormId, FieldDef[]> = {
  contact: CONTACT_FIELDS,
  dealership: DEALERSHIP_FIELDS,
};

export const HONEYPOT_FIELD = "website_url";

export const ENQUIRY_FALLBACK_CONTACT = {
  tollFree: "+1 (800) 257 0304",
  enquiry: "92898 74228",
  email: "enquiry@prayagindia.in",
};

export type FieldErrors = Record<string, string>;

export type EnquiryResult =
  | { status: "success"; message: string }
  | { status: "invalid"; message: string; errors: FieldErrors }
  | { status: "pending"; message: string }
  | { status: "error"; message: string };
