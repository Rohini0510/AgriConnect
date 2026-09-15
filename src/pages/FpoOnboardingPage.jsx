import React, { useState } from 'react';
import { CheckCircle2, UserCheck, ShieldCheck, BookOpen, ArrowRight, ArrowLeft, Upload, Award, FileText, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FpoOnboardingPage({ currentLang, setActivePage }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  // Step 1 Form
  const [fpoName, setFpoName] = useState('Sahyadri Farmer Producer Company Ltd.');
  const [regNum, setRegNum] = useState('FPO-MH-2024-889');
  const [location, setLocation] = useState('Nagpur, Maharashtra');
  const [contact, setContact] = useState('+91 98220 12345 (Ramesh Patil)');

  // Step 2 Farmers Directory List
  const [farmerList, setFarmerList] = useState([
    { name: 'Ramesh Patil', village: 'Narayangaon', crop: 'Tomato', qty: '2.5 Tonnes', harvest: '2026-09-20' },
    { name: 'Suresh Deshmukh', village: 'Katol', crop: 'Orange', qty: '3.0 Tonnes', harvest: '2026-09-22' },
    { name: 'Anand Shinde', village: 'Saoner', crop: 'Cotton', qty: '4.5 Tonnes', harvest: '2026-09-25' },
  ]);
  const [newFarmer, setNewFarmer] = useState({ name: '', village: '', crop: '', qty: '', harvest: '' });

  // Step 3 Documents & Bank
  const [bankAccount, setBankAccount] = useState('SBIN00012345678');
  const [ifsc, setIfsc] = useState('SBIN0004821');
  const [isKycUploaded, setIsKycUploaded] = useState(true);

  // Step 4 Training Modules completed status
  const [completedModules, setCompletedModules] = useState([1, 2]);

  const trainingModules = [
    { id: 1, title: '1. Produce Grading Standards (A/B/C)', duration: '12 mins', desc: 'Learn visual & moisture criteria for Grade A classification.' },
    { id: 2, title: '2. Quality Standards & Testing', duration: '15 mins', desc: 'How to conduct pesticide & freshness checks at village centers.' },
    { id: 3, title: '3. Digital Trading & Auctions', duration: '10 mins', desc: 'Step-by-step guide to setting reserve prices & winning bids.' },
    { id: 4, title: '4. Eco-friendly Packaging', duration: '8 mins', desc: 'Standard crate packing for 0% damage during shared transit.' },
    { id: 5, title: '5. Marketplace Usage & Escrow', duration: '14 mins', desc: 'Tracking shipments and receiving guaranteed 3-day payouts.' },
  ];

  const handleAddFarmer = (e) => {
    e.preventDefault();
    if (!newFarmer.name || !newFarmer.crop) return;
    setFarmerList([...farmerList, newFarmer]);
    setNewFarmer({ name: '', village: '', crop: '', qty: '', harvest: '' });
  };

  const toggleModule = (id) => {
    if (completedModules.includes(id)) {
      setCompletedModules(completedModules.filter(m => m !== id));
    } else {
      setCompletedModules([...completedModules, id]);
    }
  };

  const handleFinishOnboarding = () => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    setIsCompleted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Multilingual FPO Portal</span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">FPO Onboarding & Capacity Building</h1>
        <p className="text-xs text-slate-500 font-medium">Verify your Producer Organization, register member farmers, and complete digital trade training</p>
      </div>

      {/* Step Indicator Progress Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
          {[
            { num: 1, title: 'Step 1: FPO Info' },
            { num: 2, title: 'Step 2: Farmer Directory' },
            { num: 3, title: 'Step 3: Verification' },
            { num: 4, title: 'Step 4: Training' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`py-3 rounded-2xl border transition flex flex-col items-center gap-1 ${
                currentStep === s.num
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-extrabold'
                  : currentStep > s.num
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white/20 text-xs flex items-center justify-center font-black">
                {currentStep > s.num ? '✓' : s.num}
              </span>
              <span className="hidden sm:inline">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP CONTENT CONTAINER */}
      {!isCompleted ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          
          {/* STEP 1: FPO Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-black text-slate-900">Step 1: FPO Basic Information</h3>
                <p className="text-xs text-slate-500 font-medium">Enter your registered Farmer Producer Company / Society details</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                <div>
                  <label className="block text-slate-700 mb-1">FPO Full Registered Name</label>
                  <input
                    type="text"
                    value={fpoName}
                    onChange={(e) => setFpoName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Government Registration Number</label>
                  <input
                    type="text"
                    value={regNum}
                    onChange={(e) => setRegNum(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Headquarter Location Hub</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Lead Contact Person & Mobile Number</label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition flex items-center gap-2"
                >
                  <span>Proceed to Farmer Directory</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Farmer Directory */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-black text-slate-900">Step 2: Member Farmer Directory</h3>
                <p className="text-xs text-slate-500 font-medium">Add member farmers to digitize crop inventory and aggregated supply</p>
              </div>

              {/* Add New Farmer Form */}
              <form onSubmit={handleAddFarmer} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Add New Member Farmer</span>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Farmer Name"
                    value={newFarmer.name}
                    onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Village"
                    value={newFarmer.village}
                    onChange={(e) => setNewFarmer({ ...newFarmer, village: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Crop"
                    value={newFarmer.crop}
                    onChange={(e) => setNewFarmer({ ...newFarmer, crop: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Expected Qty (e.g. 2.5T)"
                    value={newFarmer.qty}
                    onChange={(e) => setNewFarmer({ ...newFarmer, qty: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 font-semibold"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm"
                  >
                    + Add Farmer
                  </button>
                </div>
              </form>

              {/* Registered Farmers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Farmer Name</th>
                      <th className="pb-3">Village</th>
                      <th className="pb-3">Crop</th>
                      <th className="pb-3">Expected Quantity</th>
                      <th className="pb-3">Harvest Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium text-slate-700">
                    {farmerList.map((f, i) => (
                      <tr key={i}>
                        <td className="py-3 font-bold text-slate-900">{f.name}</td>
                        <td className="py-3">{f.village}</td>
                        <td className="py-3 font-bold text-emerald-700">{f.crop}</td>
                        <td className="py-3 font-semibold">{f.qty}</td>
                        <td className="py-3 text-slate-500">{f.harvest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center gap-2"
                >
                  <span>Proceed to Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Verification */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-black text-slate-900">Step 3: Verification & Settlement Account</h3>
                <p className="text-xs text-slate-500 font-medium">Verify FPO registration certificate, tax details & bank account for 3-day escrow</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-bold">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Upload Documents</span>
                  </h4>
                  
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-white cursor-pointer hover:border-emerald-500 transition">
                    <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-600 font-bold">Click to upload FPO Incorporation Certificate & PAN</p>
                    <p className="text-[10px] text-slate-400 mt-1">PDF, JPG up to 10MB</p>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-[11px] bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Incorporation_Certificate_SahyadriFPO.pdf (Verified)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Direct Bank Escrow Details</span>
                  </h4>

                  <div>
                    <label className="block text-slate-700 mb-1">FPO Bank Account Number</label>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center gap-2"
                >
                  <span>Proceed to Multilingual Training</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Multilingual Training */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-xl font-black text-slate-900">Step 4: Multilingual Capacity Training</h3>
                <p className="text-xs text-slate-500 font-medium">Complete quick interactive modules on produce grading, packaging, and digital auctioning</p>
              </div>

              <div className="space-y-3">
                {trainingModules.map((mod) => {
                  const isDone = completedModules.includes(mod.id);
                  return (
                    <div
                      key={mod.id}
                      onClick={() => toggleModule(mod.id)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        isDone ? 'bg-emerald-50/80 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {isDone ? <Check className="w-4 h-4" /> : mod.id}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{mod.title}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">{mod.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-white px-2.5 py-1 rounded-lg border">
                        {mod.duration}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleFinishOnboarding}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-xl shadow-emerald-600/30 flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Complete FPO Registration</span>
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* SUCCESS COMPLETION STATE */
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl text-center max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">FPO Onboarding Completed!</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Sahyadri Farmer Producer Company Ltd. is officially verified on Nexora.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left text-xs space-y-1.5 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-500">Registration ID:</span>
              <span className="font-bold text-slate-900">{regNum}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Registered Farmers:</span>
              <span className="font-bold text-emerald-700">{farmerList.length} Members</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Verified Payout Bank:</span>
              <span className="font-bold text-slate-900">SBI State Bank of India</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => setActivePage('fpo-dash')}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
            >
              Open FPO Dashboard
            </button>
            <button
              onClick={() => setActivePage('auctions')}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Start First Produce Auction
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
