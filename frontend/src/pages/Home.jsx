import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../pages/Navbar'; // Ensure path is correct

// Icons used in the component - Make sure all are imported
import {
    UserPlusIcon, // Example for potential future use
    EyeIcon,
    ScaleIcon,    // Example for potential future use
    SparklesIcon,
    BellAlertIcon,
    CheckCircleIcon,
    LightBulbIcon,
    ShieldCheckIcon,
    LockClosedIcon, // For commented-out Vault feature example
    ArrowPathIcon,  // New: For How it Works
    ChatBubbleLeftRightIcon, // New: For Testimonials
    DocumentPlusIcon, // New: For How it Works
    UserGroupIcon // New: For Testimonials (Placeholder)
} from '@heroicons/react/24/outline';

// **** Placeholder for Auth State ****
// In a real app, you'd use Context API or state management
// This variable ONLY affects the Footer links in THIS file
const isLoggedIn = false; // <-- Set to true or false to see FOOTER links change
// Example using Context (you'd need to set up AuthContext.jsx)
// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext'; // Adjust path
// const { isLoggedIn } = useContext(AuthContext);
// **** End Placeholder ****


function Home() {
    const navigate = useNavigate();

    // Features data
    const features = [
        { name: 'Shared Data Dashboard', description: 'Visually track apps holding your data. Understand your exposure with our unique Data Risk Score.', icon: EyeIcon, bgColor: 'bg-blue-100', iconColor: 'text-blue-600', path: '/dashboard' },
        { name: 'Fake Data Generator', description: 'Create realistic, temporary identities to protect your real details. Save presets for quick use.', icon: SparklesIcon, bgColor: 'bg-green-100', iconColor: 'text-green-600', path: '/generator' },
        { name: 'Breach Monitoring', description: 'Actively check if your email appears in known data breaches. Get alerts directly in your dashboard.', icon: BellAlertIcon, bgColor: 'bg-red-100', iconColor: 'text-red-600', path: '/breach-monitor' },
        // { name: 'Secure Data Vault', description: 'Optionally store sensitive notes like license keys or private info with local encryption.', icon: LockClosedIcon, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600', path: '/vault' }
    ];

    // Benefits data
    const benefits = [
        { name: "Centralized Control", description: "Manage your data permissions and tracked apps from one secure place.", icon: CheckCircleIcon },
        { name: "Proactive Awareness", description: "Stay informed about potential breaches involving your email.", icon: CheckCircleIcon },
        { name: "Enhanced Anonymity", description: "Reduce your digital footprint using generated fake data where appropriate.", icon: CheckCircleIcon },
        { name: "Peace of Mind", description: "Take concrete steps towards better digital privacy habits.", icon: CheckCircleIcon },
    ];

    // How it Works steps
    const howItWorksSteps = [
        { name: "Register Account", description: "Quickly sign up for a free PrivGuard account.", icon: DocumentPlusIcon },
        { name: "Track & Generate", description: "Log apps holding your data or create secure fake identities.", icon: SparklesIcon }, // Reusing SparklesIcon
        { name: "Monitor & Manage", description: "Check for breaches and review your tracked data easily.", icon: ShieldCheckIcon }, // Reusing ShieldCheckIcon
    ];

    // Testimonials data
    const testimonials = [
        { quote: "PrivGuard finally gave me a clear picture of where my data is. The risk score is eye-opening!", author: "Alex R.", title: "Privacy Conscious User" },
        { quote: "The fake data generator is brilliant for signing up for newsletters without using my real email.", author: "Samantha B.", title: "Freelancer" },
        { quote: "Knowing I'll get alerted about breaches gives me real peace of mind. Highly recommend!", author: "Mike T.", title: "Small Business Owner" },
    ];


    // Helper function for smooth scroll
    const smoothScrollTo = (e, targetId) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar - Its links might depend on its own internal auth logic or a shared context */}
            <Navbar />

            <main className="flex-grow">

                {/* Section 1: Hero */}
                <section className="relative bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 text-white pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
                    {/* ... (Hero content remains the same) ... */}
                     <div className="absolute inset-0 opacity-10">
                         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="a" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="scale(2) rotate(0)"><rect x="0" y="0" width="100%" height="100%" fill="hsla(0,0%,100%,1)" /><path d="M10-10 v40 M-10 10 h40" strokeWidth=".5" stroke="hsla(310, 100%, 56%, 0.1)" fill="none" /></pattern></defs><rect width="800%" height="800%" transform="translate(0,0)" fill="url(#a)" /></svg>
                     </div>
                     <div className="container mx-auto px-6 text-center relative z-10">
                         <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight">
                            Your Digital Privacy, <span className="block sm:inline">Simplified & Secured.</span>
                         </h1>
                         <p className="text-lg sm:text-xl lg:text-2xl text-indigo-100 mb-10 max-w-3xl mx-auto">
                            PrivGuard empowers you to manage shared data, generate secure aliases, and monitor breaches – reclaiming control over your online identity.
                         </p>
                         <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full sm:w-auto bg-white text-indigo-700 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-indigo-600 transition duration-300 ease-in-out text-lg transform hover:scale-105"
                            >
                                Start Protecting Now
                            </button>
                             <a // Changed to an anchor for smooth scroll example
                                href="#features"
                                onClick={(e) => smoothScrollTo(e, 'features')}
                                className="w-full sm:w-auto text-white font-medium py-3 px-8 rounded-lg hover:bg-white hover:bg-opacity-20 transition duration-300 ease-in-out text-lg border border-white border-opacity-50"
                            >
                                Learn More
                            </a>
                         </div>
                    </div>
                 </section>

                {/* Section 2: Key Features */}
                <section id="features" className="py-16 md:py-24 bg-white">
                    {/* ... (Features content remains the same) ... */}
                     <div className="container mx-auto px-6">
                        <div className="text-center mb-14">
                            <span className="text-indigo-600 font-semibold uppercase tracking-wider text-sm">Core Features</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                                Everything You Need for Privacy Oversight
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                                From tracking app permissions to staying ahead of data breaches.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature) => (
                                <div
                                    key={feature.name}
                                    onClick={() => navigate(feature.path)} // Navigation added here
                                    className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-gray-300 ${feature.bgColor} cursor-pointer group`}
                                    role="link"
                                    tabIndex="0"
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(feature.path); }}
                                >
                                    <div className="flex items-center space-x-4 mb-4">
                                         <div className={`p-3 rounded-full ${feature.bgColor.replace('100', '200') || 'bg-gray-200'}`}>
                                             <feature.icon className={`h-7 w-7 ${feature.iconColor}`} aria-hidden="true" />
                                        </div>
                                         <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                             {feature.name}
                                         </h3>
                                    </div>
                                    <p className="text-gray-700 text-base">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 3: How It Works (NEW SECTION) */}
                <section id="how-it-works" className="py-16 md:py-24 bg-gray-100">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-14">
                            <span className="text-purple-600 font-semibold uppercase tracking-wider text-sm">Get Started Easily</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                                How PrivGuard Works
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                                Three simple steps to take control of your digital privacy.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
                             {/* Connecting lines (optional visual flair) */}
                            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2" style={{width: 'calc(100% - 10rem)', left: '5rem', zIndex: 0}}></div>

                            {howItWorksSteps.map((step, index) => (
                                <div key={step.name} className="relative z-10 flex flex-col items-center text-center">
                                    <div className="mb-4 p-4 rounded-full bg-white shadow-md border border-gray-200">
                                         <step.icon className="h-10 w-10 text-indigo-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{index + 1}. {step.name}</h3>
                                     <p className="text-gray-600">{step.description}</p>
                                 </div>
                            ))}
                         </div>
                    </div>
                </section>


                {/* Section 4: Why Choose PrivGuard? (Benefits) */}
                <section className="py-16 md:py-24 bg-white"> {/* Changed background for visual separation */}
                    {/* ... (Benefits content remains the same, but changed background) ... */}
                     <div className="container mx-auto px-6">
                        <div className="text-center mb-14">
                           <span className="text-green-600 font-semibold uppercase tracking-wider text-sm">The PrivGuard Advantage</span>
                           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                                Why Users Trust PrivGuard
                            </h2>
                           <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                                Gain confidence in your online interactions with tools designed for clarity and security.
                            </p>
                       </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {benefits.map(benefit => (
                                <div key={benefit.name} className="text-center md:text-left flex flex-col items-center md:flex-row md:items-start space-y-3 md:space-y-0 md:space-x-4 p-4">
                                    <div className="flex-shrink-0">
                                        <benefit.icon className="h-8 w-8 text-green-500" /> {/* Use benefit's icon */}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">{benefit.name}</h4>
                                        <p className="text-gray-600 mt-1">{benefit.description}</p>
                                    </div>
                                </div>
                           ))}
                        </div>
                    </div>
                </section>

                {/* Section 5: Testimonials (NEW SECTION) */}
                <section id="testimonials" className="py-16 md:py-24 bg-indigo-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-14">
                            <span className="text-indigo-600 font-semibold uppercase tracking-wider text-sm">What Our Users Say</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                                Trusted by Privacy Advocates
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col">
                                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-indigo-200 mb-4" /> {/* Subtle quote icon */}
                                    <blockquote className="text-gray-700 italic flex-grow">"{testimonial.quote}"</blockquote>
                                    <footer className="mt-4 pt-4 border-t border-gray-200">
                                        <p className="font-semibold text-gray-900">{testimonial.author}</p>
                                        <p className="text-sm text-gray-500">{testimonial.title}</p>
                                    </footer>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* Section 6: Privacy Tip Showcase */}
                <section className="py-16 bg-white"> {/* Changed background back to white */}
                    {/* ... (Privacy Tip content remains the same, but changed background) ... */}
                      <div className="container mx-auto px-6">
                        <div className="bg-indigo-50 p-8 rounded-lg shadow-sm flex flex-col md:flex-row items-center md:space-x-8 border border-indigo-100"> {/* Adjusted styling slightly */}
                             <div className="flex-shrink-0 mb-6 md:mb-0 text-center md:text-left">
                                 <LightBulbIcon className="h-16 w-16 text-yellow-500 mx-auto md:mx-0" />
                             </div>
                             <div className='text-center md:text-left'>
                                <span className="text-yellow-600 font-semibold uppercase tracking-wider text-sm">Featured Privacy Tip</span>
                                 <h3 className="text-2xl font-semibold text-gray-900 mt-2 mb-3">Regularly Review App Permissions</h3>
                                 <p className="text-gray-700 mb-5">
                                    Periodically check the permissions granted to apps on your phone and computer. Do they really need access to your location, microphone, or contacts? Revoke unnecessary permissions to minimize your data exposure.
                                </p>
                                 <button onClick={() => navigate('/privacy-tips')} className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-150 ease-in-out">
                                     See More Privacy Tips →
                                </button>
                            </div>
                       </div>
                   </div>
                </section>

                {/* Section 7: Final Call to Action */}
                <section className="py-16 md:py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    {/* ... (Final CTA content remains the same) ... */}
                     <div className="container mx-auto px-6 text-center">
                         <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Elevate Your Digital Defense?</h2>
                         <p className="text-indigo-100 mb-8 text-lg max-w-xl mx-auto">Join PrivGuard today and start managing your privacy like never before.</p>
                         <button
                            onClick={() => navigate('/register')}
                            className="bg-white text-indigo-700 font-semibold py-3 px-10 rounded-lg shadow-md hover:bg-gray-200 transition duration-300 ease-in-out text-lg transform hover:scale-105"
                        >
                             Create Your Free Account
                        </button>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand/About Column */}
                        <div className="md:col-span-1 mb-6 md:mb-0">
                           <Link to="/" className="flex items-center space-x-2 mb-4">
                                <ShieldCheckIcon className="h-8 w-8 text-indigo-400" />
                                <span className="font-bold text-xl text-white">PrivGuard</span>
                            </Link>
                           <p className="text-sm">Your comprehensive solution for managing online privacy and data security.</p>
                        </div>

                       {/* Links Columns - These WILL change based on the `isLoggedIn` const above */}
                         <div>
                             <h5 className="font-semibold text-white uppercase tracking-wider mb-4 text-sm">Product</h5>
                           <ul className="space-y-2 text-sm">
                                <li><a href="#features" onClick={(e) => smoothScrollTo(e, 'features')} className="hover:text-white">Features</a></li>
                                {isLoggedIn ? ( // Conditionally show dashboard links
                                    <>
                                      <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
                                      <li><Link to="/generator" className="hover:text-white">Generator</Link></li>
                                      <li><Link to="/breach-monitor" className="hover:text-white">Breach Monitor</Link></li>
                                    </>
                                 ) : (
                                     <>
                                      <li><Link to="/login" className="hover:text-white">Login</Link></li>
                                      <li><Link to="/register" className="hover:text-white">Register</Link></li>
                                     </>
                                 )}
                             </ul>
                         </div>
                       <div>
                            <h5 className="font-semibold text-white uppercase tracking-wider mb-4 text-sm">Resources</h5>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/privacy-tips" className="hover:text-white">Privacy Tips</Link></li>
                                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                             </ul>
                         </div>
                         <div>
                             <h5 className="font-semibold text-white uppercase tracking-wider mb-4 text-sm">Company</h5>
                           <ul className="space-y-2 text-sm">
                                <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                             </ul>
                        </div>
                     </div>

                    {/* Bottom Footer */}
                    <div className="mt-10 pt-8 border-t border-gray-700 text-center text-sm">
                       © {new Date().getFullYear()} PrivGuard. All Rights Reserved.
                    </div>
                 </div>
             </footer>
        </div>
    );
}

export default Home;