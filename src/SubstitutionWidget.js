import { useState, useRef } from 'react';
import './SubstitutionWidget.css';

const SubstitutionWidget = () => {
  const allSections = [
    'Monday 7-9pm',
    'Tuesday 1-3pm',
    'Tuesday 3-5pm',
    'Tuesday 7-9pm',
    'Wednesday 4-6pm',
    'Wednesday 7-9pm',
    'Thursday 1-3pm',
    'Thursday 3-5pm',
    'Thursday 7-9pm',
    'Friday 3-5pm'
  ];

  const [formData, setFormData] = useState({
    week: '',
    section: '',
    available: []
  });

  const [slackMessage, setSlackMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const messageRef = useRef(null);

  const handleTextChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvailableChange = (section) => {
    const newAvailable = [...formData.available];
    
    if (newAvailable.includes(section)) {
      // Remove if already selected
      const index = newAvailable.indexOf(section);
      newAvailable.splice(index, 1);
    } else {
      // Add if not selected
      newAvailable.push(section);
    }
    
    setFormData({
      ...formData,
      available: newAvailable
    });
  };

  const generateSlackMessage = () => {
    const availableSections = formData.available.length > 0 
      ? formData.available.join(', ')
      : 'None specified';

    const message = `📅 *OFFICE HOUR SUBSTITUTION REQUEST*
-------------------------------------
*Week:* ${formData.week}
*Section to Substitute:* ${formData.section}
*Available For:* ${availableSections}
*Status:* ❌ Not Resolved`;

    setSlackMessage(message);
    setShowMessage(true);
    
    setTimeout(() => {
      if (messageRef.current) {
        messageRef.current.select();
      }
    }, 100);
  };

  const copyToClipboard = () => {
    messageRef.current.select();
    document.execCommand('copy');
    alert('Copied to clipboard! Now you can paste it in Slack.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateSlackMessage();
  };

  return (
    <div className="widget-container">
      <h2 className="widget-title">Office Hour Substitution Request</h2>
      
      <form onSubmit={handleSubmit} className="substitution-form">
        <div className="form-group">
          <label htmlFor="week">
            Week:
          </label>
          <input
            type="text"
            id="week"
            name="week"
            placeholder="e.g., April 10-16"
            value={formData.week}
            onChange={handleTextChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="section">
            Section to Substitute:
          </label>
          <input
            type="text"
            id="section"
            name="section"
            placeholder="e.g., Monday 9-10am"
            value={formData.section}
            onChange={handleTextChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>
            Available Sections:
          </label>
          <div className="checkbox-container">
            {allSections.map((section) => (
              <div key={section} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`available-${section}`}
                  checked={formData.available.includes(section)}
                  onChange={() => handleAvailableChange(section)}
                />
                <label htmlFor={`available-${section}`} className="checkbox-label">
                  {section}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          className="submit-button"
        >
          Generate Slack Message
        </button>
      </form>

      {showMessage && (
        <div className="slack-message-container">
          <h3>Copy this message to Slack:</h3>
          <textarea 
            ref={messageRef}
            className="slack-message"
            value={slackMessage}
            readOnly
          />
          <button 
            className="copy-button"
            onClick={copyToClipboard}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default SubstitutionWidget;