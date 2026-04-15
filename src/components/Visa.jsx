import { useState } from "react";

const CheckIcon = () => (
  <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"/>
  </svg>
);

const CheckList = ({ items }) => (
  <ul className="space-y-2 mt-2">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
        <CheckIcon />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const SectionDivider = () => (
  <hr className="my-5 border-gray-200" />
);

export default function Visa() {
  
  const [activeTab, setActiveTab] = useState("letter");



  const tabs = [
    { id: "letter", label: "Dear Student Letter" },
    { id: "france", label: "France (Campus France)" },
    { id: "uk", label: "UK" },
    { id: "usa", label: "USA" },
    { id: "canada", label: "Canada" },
    { id: "australia", label: "Australia" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      

      {/* Navbar */}
      

      {/* Hero Banner */}
      <div className="relative w-full h-56 sm:h-72 md:h-80 bg-gradient-to-br from-[#0c2c52] via-[#1a4a8a] to-[#0064b0] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-32 translate-y-32"></div>
        </div>
        <div className="relative text-center px-4">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-3">Visa Assistance for Pakistani Students</h1>
          <p className="text-blue-200 text-base sm:text-lg">Professional Education Consultancy — Paris, France</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full border border-white/30">🇵🇰 Serving Pakistani Students</span>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full border border-white/30">🇫🇷 Based in Paris</span>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full border border-white/30">⭐ Since 2020</span>
          </div>
        </div>
      </div>

      {/* Awards Strip */}
      <div className="bg-[#f5f8ff] border-y border-blue-100 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 text-center">
            {[
              { icon: "🏆", label: "Best Education Consultant Pakistan 2023" },
              { icon: "⭐", label: "HEC Recognized Overseas Consultancy" },
              { icon: "🎓", label: "Top Study Abroad Advisor – Lahore 2022" },
              { icon: "🌍", label: "Excellence in Franco-Pakistani Education Links" },
              { icon: "📜", label: "Certified Campus France Partner" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-blue-100 text-sm font-medium text-[#0c2c52]">
                <span className="text-lg">{a.icon}</span>
                <span>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-0">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg border transition-colors -mb-px ${
                activeTab === tab.id
                  ? "bg-[#0c2c52] text-white border-[#0c2c52]"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-blue-50 hover:text-[#0c2c52]"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Dear Student Letter */}
        {activeTab === "letter" && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0c2c52] rounded-full flex items-center justify-center text-white font-bold">AZ</div>
                <div>
                  <div className="font-bold text-[#0c2c52] text-lg">AZ Consultations</div>
                  <div className="text-xs text-gray-500">77 Rue du Faubourg Saint-Martin, 75010 Paris, France</div>
                </div>
              </div>
              <div className="text-gray-800 space-y-4 text-sm leading-relaxed">
                <p className="font-semibold text-base text-[#0c2c52]">Dear Student,</p>
                <p>Greetings from Paris.</p>
                <p>Thank you for your interest in studying abroad. We are pleased to offer our professional educational consultancy services for students from <strong>Pakistan</strong> who wish to pursue higher education abroad.</p>

                <h2 className="text-lg font-bold text-[#0c2c52] mt-6">Our Services</h2>
                <p>We provide complete support for your admission process, including:</p>

                <div className="space-y-5">
                  <div>
                    <h3 className="font-bold text-[#0c2c52]">1. University &amp; Program Selection</h3>
                    <ul className="list-disc ml-5 space-y-1 mt-1 text-gray-700">
                      <li>We identify suitable universities and study programs (formations) based on your academic background, career goals, and budget.</li>
                      <li>University tuition fees depend on the selected formation, university, and city.</li>
                      <li>After signing our consultancy contract, we will share full details of available universities, programs, and their respective tuition fees.</li>
                      <li>University fees will be paid directly by the student to the university.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0c2c52]">2. Admission Process</h3>
                    <ul className="list-disc ml-5 space-y-1 mt-1 text-gray-700">
                      <li>We apply to universities on your behalf.</li>
                      <li>We secure your admission and provide the official Admission Letter and all related documents.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0c2c52]">3. Document Preparation</h3>
                    <ul className="list-disc ml-5 space-y-1 mt-1 text-gray-700">
                      <li>Preparation of your CV according to standards.</li>
                      <li>Writing of a professional Letter of Motivation.</li>
                      <li>Translation of documents (translation fees are extra and depend on the number and language of documents).</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0c2c52]">4. Interview Preparation</h3>
                    <ul className="list-disc ml-5 space-y-1 mt-1 text-gray-700">
                      <li>Guidance and preparation for the Campus France and visa interview.</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-[#0c2c52] mt-6">Visa Application &amp; Disclaimer</h2>
                <p>Please note that <strong>we do not sell, arrange, or guarantee visas.</strong></p>
                <p>Our responsibility is limited to preparing your academic and admission file according to university requirements and Embassy standards. Our service covers university search, admission processing, CV preparation, motivation letter, and complete file preparation. Translation fees and insurance costs are not included and must be paid separately by the student.</p>

                <h2 className="text-lg font-bold text-[#0c2c52] mt-6">Our Responsibility</h2>
                <p>We are responsible for:</p>
                <ul className="list-disc ml-5 space-y-1 text-gray-700">
                  <li>Finding suitable universities</li>
                  <li>Securing admission</li>
                  <li>Preparing your complete academic file (CV, motivation letter, documents)</li>
                </ul>

                <h2 className="text-lg font-bold text-[#0c2c52] mt-6">Office Address</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-gray-700">
                  <p className="font-semibold text-[#0c2c52]">AZ Consultations</p>
                  <p>77 Rue du Faubourg Saint-Martin, 75010 Paris, France</p>
                </div>

                <p className="mt-4">If you wish to begin your application or need further information, please feel free to contact us. We look forward to assisting you in achieving your educational goals in France.</p>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="font-semibold text-[#0c2c52]">Kind regards,</p>
                  <p className="font-bold text-lg text-[#0c2c52] mt-1">Syed Ahmad Jalal</p>
                  <p className="text-gray-600">Education Consultant – France</p>
                  <p className="text-gray-600">Office: Paris / Lahore</p>
                  <div className="mt-2 space-y-1 text-sm text-gray-700">
                    <p>📞 Office: <a href="tel:+33183965723" className="text-[#0064b0] hover:underline">+33 1 83 96 57 23</a></p>
                    <p>📱 Mobile: <a href="tel:+33676903922" className="text-[#0064b0] hover:underline">+33 6 76 90 39 22</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: France */}
        {activeTab === "france" && (
          <div>
            <h2 className="text-2xl font-bold text-[#0c2c52] mb-2">France – Campus France Visa Documents</h2>
            <p className="text-gray-600 mb-6 text-sm">We prefer a country-specific visa checklist. Below are the documents required for Pakistani students applying to study in France.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-[#0c2c52] text-lg mb-1">Campus France Procedure</h3>
                <SectionDivider />
                <CheckList items={[
                  "Valid Pakistani Passport (minimum 18 months validity)",
                  "Completed Campus France online application (Etudes en France platform)",
                  "Diplomas and transcripts from Matriculation, Intermediate/A-Levels, and Bachelor's (if applicable)",
                  "Attested/HEC verified academic documents",
                  "Language proficiency proof (French: DELF/DALF; English: IELTS/TOEFL if applicable)",
                  "Motivation Letter (prepared by AZ Consultations)",
                  "CV / Resume (prepared by AZ Consultations)",
                  "Campus France interview confirmation",
                ]} />
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-[#0c2c52] text-lg mb-1">French Consulate Visa Documents</h3>
                <SectionDivider />
                <CheckList items={[
                  "Long-stay student visa application form (online via France-Visas)",
                  "Recent passport-size photographs (white background, French standards)",
                  "Admission Letter from French university/institution",
                  "Campus France acceptance attestation",
                  "Proof of financial means (min. €615/month — bank statements, scholarship letter, or sponsor's affidavit)",
                  "Proof of accommodation in France (university residence, rental agreement, or host family letter)",
                  "Health insurance policy valid in France",
                  "Flight itinerary / booking",
                  "OFII form (filled online after visa approval for residence permit)",
                ]} />
              </div>
            </div>
          </div>
        )}

        {/* Tab: UK */}
        {activeTab === "uk" && (
          <div>
            <h2 className="text-2xl font-bold text-[#0c2c52] mb-2">UK – Student Visa Documents</h2>
            <p className="text-gray-600 mb-6 text-sm">This checklist is only an indication of the documents required; it may vary in each student's case.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-[#0c2c52] mb-3">Essential Documents Required by All Applicants</h4>
                <CheckList items={[
                  "Confirmation of Acceptance of Studies (CAS)",
                  "Immigration Health Surcharge (IHS) Reference Number",
                  "Current Valid Passport",
                  "Application Submission Cover Sheet (printed and signed after submitting Tier 4 application online)",
                  "One color passport photograph (outside the UK)",
                  "Tuberculosis (TB) Certificate (for Pakistani applicants)",
                ]} />
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-[#0c2c52] mb-3">Other Documents (may be required)</h4>
                <CheckList items={[
                  "Any previous passport/travel document used for travel to the UK",
                  "ATAS Certificate (if applicable for sensitive subjects)",
                  "Student Under-18: Legal Guardian letter for permission",
                  "Proof of parental/guardian consent (for minors)",
                  "Bank statements showing financial funds (minimum 28 days)",
                  "English language proficiency certificate (IELTS Academic)",
                  "Academic transcripts and certificates (attested/HEC verified)",
                  "Proof of accommodation (university halls or rental agreement)",
                ]} />
              </div>
            </div>
          </div>
        )}

        {/* Tab: USA */}
        {activeTab === "usa" && (
          <div>
            <h2 className="text-2xl font-bold text-[#0c2c52] mb-2">USA – F-1 Student Visa Documents</h2>
            <p className="text-gray-600 mb-6 text-sm">Documents required for Pakistani students applying for an F-1 Student Visa at the US Embassy Islamabad.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-[#0c2c52] mb-3">Documents on the Day of Biometrics / Interview</h4>
                <CheckList items={[
                  "Current Passport (valid for at least 6 months beyond intended stay)",
                  "Previous passports (if they contain a US Visa)",
                  "Appointment Confirmation page (DS-160 submission)",
                  "DS-160 Confirmation page (barcode page)",
                  "One 5×5 cm passport-size photograph (white background)",
                  "MRV Fee Payment Receipt",
                  "I-20 Form issued by the US university (SEVIS)",
                  "SEVIS fee payment receipt (I-901)",
                ]} />
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-[#0c2c52] mb-3">Supporting Financial & Academic Documents</h4>
                <CheckList items={[
                  "Original bank statements (minimum 3–6 months) showing sufficient funds",
                  "Proof of scholarship or financial aid from university",
                  "Sponsor's income proof and bank statements (if parent/guardian is sponsor)",
                  "Tax returns / salary slips of sponsor",
                  "Academic transcripts and degrees (Matric, Inter, Bachelor's) — HEC attested",
                  "IELTS / TOEFL score certificate",
                  "SAT scores (if required by institution)",
                  "Admission Letter from the US university",
                  "Evidence of ties to Pakistan (property, family, employment of parent)",
                ]} />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Canada */}
        {activeTab === "canada" && (
          <div>
            <h2 className="text-2xl font-bold text-[#0c2c52] mb-2">Canada – Study Permit Documents</h2>
            <p className="text-gray-600 mb-6 text-sm">Documents required for Pakistani students applying for a Canadian Study Permit.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-[#0c2c52] mb-3">Core Application Documents</h4>
                <CheckList items={[
                  "Valid Pakistani Passport",
                  "Letter of Acceptance from a Designated Learning Institution (DLI) in Canada",
                  "Proof of financial support (CAD 10,000+ per year in addition to tuition fees)",
                  "Bank statements (minimum 6 months — personal or sponsor)",
                  "IMM 1294 Study Permit Application Form (online via IRCC)",
                  "Digital photograph meeting IRCC specifications",
                  "Letter of Explanation (Statement of Purpose)",
                ]} />
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-[#0c2c52] mb-3">Additional Supporting Documents</h4>
                <CheckList items={[
                  "Academic transcripts and certificates (attested from HEC/IBCC)",
                  "English language test result (IELTS Academic or equivalent)",
                  "Proof of ties to Pakistan (evidence of intention to return)",
                  "Police Clearance Certificate (if required)",
                  "Medical examination results (upfront medical if applicable)",
                  "Biometrics appointment confirmation (if required)",
                  "Proof of Quebec Acceptance Certificate (CAQ) if studying in Quebec",
                ]} />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Australia */}
        {activeTab === "australia" && (
          <div>
            <h2 className="text-2xl font-bold text-[#0c2c52] mb-2">Australia – Student Visa (Subclass 500) Documents</h2>
            <p className="text-gray-600 mb-6 text-sm">Documents required for Pakistani students applying for the Australian Student Visa Subclass 500.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-[#0c2c52] mb-3">Primary Application Documents</h4>
                <CheckList items={[
                  "Valid Pakistani Passport",
                  "Confirmation of Enrolment (CoE) from an Australian university/college",
                  "Genuine Temporary Entrant (GTE) statement",
                  "Proof of financial capacity (AUD 21,041 per year + tuition + return airfare)",
                  "Bank statements (own or sponsor's — minimum 3 months)",
                  "Overseas Student Health Cover (OSHC) — purchased before visa application",
                  "English language proficiency (IELTS Academic or PTE Academic)",
                ]} />
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-[#0c2c52] mb-3">Additional Documents</h4>
                <CheckList items={[
                  "Academic transcripts (Matric, Intermediate, Bachelor's) — HEC attested",
                  "Statement of Purpose / Personal Statement",
                  "Work experience letters (if applicable)",
                  "Police Clearance Certificate from Pakistan",
                  "Medical examination (if requested by DIBP)",
                  "Form 1221 (Additional Personal Particulars Information — if required)",
                  "Guardian consent and details (for students under 18)",
                  "Proof of accommodation in Australia",
                ]} />
              </div>
            </div>
          </div>
        )}

        {/* Contact Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#0c2c52] to-[#1a4a8a] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-1">Need Help with Your Visa Application?</h3>
            <p className="text-blue-200 text-sm">Contact Syed Ahmad Jalal — Education Consultant, Paris / Lahore</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="tel:+33183965723" className="bg-white text-[#0c2c52] font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-blue-50 transition-colors text-center">
              📞 +33 1 83 96 57 23
            </a>
            <a href="https://api.whatsapp.com/send?phone=33676903922" target="_blank" rel="noreferrer"
              className="bg-[#25d366] text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-green-500 transition-colors text-center">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0c2c52] text-white mt-16 pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-white text-[#0c2c52] font-bold text-lg px-2 py-0.5 rounded">AZ</div>
              <span className="font-bold text-lg">AZ Consultations</span>
            </div>
            <p className="text-blue-300 text-sm">Professional education consultancy for Pakistani students seeking higher education in France and abroad. Est. 2020.</p>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-blue-200">Contact</h4>
            <ul className="space-y-1 text-sm text-blue-300">
              <li>📍 77 Rue du Faubourg Saint-Martin, 75010 Paris, France</li>
              <li>📞 Office: +33 1 83 96 57 23</li>
              <li>📱 Mobile: +33 6 76 90 39 22</li>
              <li>🏢 Also in: Lahore, Pakistan</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-blue-200">Quick Links</h4>
            <ul className="space-y-1 text-sm text-blue-300">
              {["Home", "About AZ Consultations", "Our Services", "Visa Assistance", "Contact Us"].map((l) => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-blue-900 text-center text-xs text-blue-400">
          © {new Date().getFullYear()} AZ Consultations. All rights reserved. | Director: Syed Ahmad Jalal
        </div>
      </footer>

      {/* Floating CTA */}
      <div className="fixed bottom-6 left-4 z-50">
        <a href="#" className="bg-[#0064b0] text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg hover:bg-[#0052a0] transition-colors">
          Request A Consultation
        </a>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <a href="https://api.whatsapp.com/send?phone=33676903922" target="_blank" rel="noreferrer"
          className="w-14 h-14 bg-[#34a94d] rounded-xl flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors animate-pulse">
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>

      {/* Left Social Icons */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-0.5">
        {[
          { icon: "f", href: "#", label: "Facebook" },
          { icon: "t", href: "#", label: "Twitter" },
          { icon: "in", href: "#", label: "LinkedIn" },
          { icon: "ig", href: "#", label: "Instagram" },
        ].map((s) => (
          <a key={s.label} href={s.href} title={s.label}
            className="w-10 h-10 bg-[#0064b0] text-white flex items-center justify-center text-xs font-bold hover:bg-[#0052a0] transition-colors">
            {s.icon}
          </a>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 24s linear infinite;
        }
      `}</style>
    </div>
  );
}