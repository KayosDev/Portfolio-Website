import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SocialFooter = () => {
  // Social media links
  const socialLinks = [
    { name: 'GitHub', icon: 'github', url: 'https://github.com/KayosDev' },
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/in/yourusername' },
    { name: 'Twitter', icon: 'twitter-x', url: 'https://twitter.com/yourusername' },
    { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/yourusername' },
    { name: 'YouTube', icon: 'youtube', url: 'https://youtube.com/c/yourusername' },
    { name: 'Discord', icon: 'discord', url: 'https://discord.gg/yourinvite' },
  ];

  return (
    <footer className="social-footer">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
            <div className="social-icons">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="social-icon"
                >
                  <i className={`bi bi-${social.icon}`}></i>
                </a>
              ))}
            </div>
            <p className="mt-3">© {new Date().getFullYear()} KayosDev. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default SocialFooter; 