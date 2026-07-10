import random

class PhishingDetector:
    @staticmethod
    def analyze_text(text: str) -> dict:
        text = text.lower()
        is_threat = "urgent" in text and "password" in text or "verify" in text
        risk_score = random.randint(70, 99) if is_threat else random.randint(0, 20)
        
        return {
            "is_threat": is_threat,
            "risk_score": risk_score,
            "threat_type": "phishing_scam" if is_threat else "none",
            "message": "Potential phishing detected in text." if is_threat else "Text appears safe."
        }

    @staticmethod
    def analyze_url(url: str) -> dict:
        url = url.lower()
        is_threat = "login" in url or "secure" in url or "update" in url
        risk_score = random.randint(80, 100) if is_threat else random.randint(0, 15)
        
        return {
            "is_threat": is_threat,
            "risk_score": risk_score,
            "threat_type": "malicious_url" if is_threat else "none",
            "message": "Suspicious URL patterns detected." if is_threat else "URL appears safe."
        }
