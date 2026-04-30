import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardShell from "../components/DashboardShell";
import {
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiPhoneCall,
  FiMessageSquare,
  FiBookOpen,
} from "react-icons/fi";
import "../styles/help-page.css";

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "How do I update my profile picture?",
        a: "Navigate to the Settings > Profile page, click on the camera icon next to your current avatar, and select a new image from your device."
      },
      {
        q: "How do I change my password?",
        a: "Go to Settings > Profile, scroll down to the Authentication section, and click on 'Security Settings' to update your password."
      }
    ]
  },
  {
    category: "Appointments",
    questions: [
      {
        q: "How do I cancel an appointment?",
        a: "On the Appointments page, click the three-dots menu icon next to the appointment you wish to cancel and select 'Cancel Appointment'."
      },
      {
        q: "How does the online consultation work?",
        a: "Online consultations are conducted via secure video calls. 10 minutes before an online appointment, the 'Join' button will turn green. Clicking it will open the video room."
      }
    ]
  },
  {
    category: "Schedule & Availability",
    questions: [
      {
        q: "How do I set my weekly availability?",
        a: "Go to the Schedule page and click 'Set Availability' in the top right. You can toggle specific days on or off and define your working hours."
      },
      {
        q: "Can I block out specific days for vacation?",
        a: "Yes. On the Set Availability page, click on 'Mark Unavailable Dates' and select the date range you will be away."
      }
    ]
  }
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaq, setOpenFaq] = useState(null); // stores "categoryIndex-questionIndex"

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // Filter FAQs based on search
  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      item => 
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <DashboardShell title="Help & Support" description="Help Center">
      <motion.div 
        className="help-page-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Search Section */}
        <motion.div className="help-hero-section" variants={itemVariants}>
          <h1>How can we help you today?</h1>
          <p>Search our knowledge base or browse frequently asked questions.</p>
          <div className="help-search-bar">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search for answers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        <div className="help-content-grid">
          {/* FAQ Section */}
          <motion.div className="faq-section" variants={itemVariants}>
            <h2>Frequently Asked Questions</h2>
            
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((cat, catIdx) => (
                <div key={cat.category} className="faq-category">
                  <h3>{cat.category}</h3>
                  <div className="faq-list">
                    {cat.questions.map((faq, qIdx) => {
                      const id = `${catIdx}-${qIdx}`;
                      const isOpen = openFaq === id;
                      return (
                        <div 
                          key={qIdx} 
                          className={`faq-item ${isOpen ? 'open' : ''}`}
                          onClick={() => toggleFaq(id)}
                        >
                          <div className="faq-question">
                            <h4>{faq.q}</h4>
                            <button className="faq-toggle-btn">
                              {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                          </div>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div 
                                className="faq-answer"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="faq-answer-inner">
                                  {faq.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results-msg">
                No results found for "{searchTerm}". Please try different keywords or contact support.
              </div>
            )}
          </motion.div>

          {/* Contact Support Section */}
          <motion.div className="support-sidebar" variants={itemVariants}>
            <div className="support-card">
              <h3>Still need help?</h3>
              <p>Our support team is available 24/7 to assist you.</p>

              <div className="support-options">
                <div className="support-option-btn">
                  <div className="support-icon-wrap blue">
                    <FiMessageSquare />
                  </div>
                  <div className="support-option-info">
                    <h4>Live Chat</h4>
                    <span>Typical reply: Under 5 mins</span>
                  </div>
                </div>

                <a href="mailto:support@sahtek.online" className="support-option-btn">
                  <div className="support-icon-wrap orange">
                    <FiMail />
                  </div>
                  <div className="support-option-info">
                    <h4>Email Support</h4>
                    <span>support@sahtek.online</span>
                  </div>
                </a>

                <a href="tel:+21321000000" className="support-option-btn">
                  <div className="support-icon-wrap green">
                    <FiPhoneCall />
                  </div>
                  <div className="support-option-info">
                    <h4>Phone Support</h4>
                    <span>+213 21 00 00 00</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="guide-card">
              <div className="guide-icon-wrap">
                <FiBookOpen />
              </div>
              <div className="guide-content">
                <h4>Doctor's User Guide</h4>
                <p>Download the complete manual for the platform.</p>
                <button className="download-guide-btn">Download PDF</button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardShell>
  );
}
