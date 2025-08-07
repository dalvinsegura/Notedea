import random
import string
from datetime import datetime

class TestDataGenerator:
    @staticmethod
    def generate_email():
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        random_string = ''.join(random.choices(string.ascii_lowercase, k=5))
        return f"test_{timestamp}_{random_string}@example.com"
    
    @staticmethod
    def generate_password(length=8):
        return ''.join(random.choices(string.ascii_letters + string.digits, k=length))
    
    @staticmethod
    def generate_note_title():
        titles = [
            "Mi primera idea",
            "Proyecto innovador",
            "Pensamiento creativo",
            "Nueva propuesta",
            "Concepto revolucionario"
        ]
        timestamp = datetime.now().strftime("%H%M%S")
        return f"{random.choice(titles)} {timestamp}"
    
    @staticmethod
    def generate_note_content(min_length=50):
        content_templates = [
            "Esta es una idea innovadora que podría cambiar la forma en que pensamos sobre el desarrollo de software. "
            "Incluye aspectos técnicos, metodológicos y estratégicos que pueden ser aplicados en diferentes contextos.",
            
            "El proyecto consiste en desarrollar una solución tecnológica que integre inteligencia artificial con "
            "interfaces de usuario intuitivas para mejorar la experiencia del usuario final.",
            
            "Esta propuesta busca optimizar los procesos organizacionales mediante la implementación de herramientas "
            "digitales que faciliten la colaboración y comunicación entre equipos distribuidos.",
            
            "La idea central se basa en crear un ecosistema digital que permita la gestión eficiente de recursos "
            "y la automatización de tareas repetitivas para incrementar la productividad."
        ]
        
        content = random.choice(content_templates)
        
        while len(content) < min_length:
            content += " " + random.choice(content_templates)
        
        return content
    
    @staticmethod
    def generate_short_content():
        return "Contenido muy corto"
    
    @staticmethod
    def get_invalid_emails():
        return [
            "invalid-email",
            "@domain.com",
            "user@",
            "user..name@domain.com",
            "user@domain",
            ""
        ]
    
    @staticmethod
    def get_weak_passwords():
        return [
            "",
            "123",
            "ab",
            "12345"
        ]
