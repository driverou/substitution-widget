import { useState, useRef } from 'react';
import './SubstitutionWidget.css';

const SubstitutionWidget = () => {
  // Sample sections (you would replace this with your actual sections)
  const allSections = [
    'Monday 9-10am',
    'Monday 10-11am',
    'Monday 2-3pm',
    'Tuesday 11am-12pm',
    'Tuesday 1-2pm',
    'Wednesday 9-10am',
    'Wednesday 3-4pm',
    'Thursday 10-11am',
    'Thursday 2-3pm',
    'Friday 9-10am',
    'Friday 1-2pm'
  ];

  const [formData, setFormData] = useState({
    week: '',
    section: '',
    available: [],
    resolved: false
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

  const handleResolvedChange = () => {
    setFormData({
      ...formData,
      resolved: !formData.resolved
    });
  };

  const generateSlackMessage = () => {
    const availableSections = formData.available.length > 0 
      ? formData.available.join(', ')
      : 'None specified';

    const statusEmoji = formData.resolved ? '✅' : '❌';
    const statusText = formData.resolved ? 'Resolved' : 'Not Resolved';

    const message = `📅 *OFFICE HOUR SUBSTITUTION REQUEST*
-------------------------------------
*Week:* ${formData.week}
*Section to Substitute:* ${formData.section}
*Available For:* ${availableSections}
*Status:* ${statusEmoji} ${statusText}`;

    setSlackMessage(message);
    setShowMessage(true);
    
    // Focus will be set after the component re-renders and the textarea exists
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
      
      <form onSubmit={handleSubmit}>
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
                <label htmlFor={`available-${section}`}>
                  {section}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group resolved-group">
          <label className="resolved-label">
            <input
              type="checkbox"
              checked={formData.resolved}
              onChange={handleResolvedChange}
            />
            Resolved
          </label>
          <div className="resolved-indicator">
            {formData.resolved ? 
              <span className="resolved-check">✓</span> : 
              <span className="resolved-x">✗</span>
            }
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