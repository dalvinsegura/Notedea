from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from .base_page import BasePage

class LoginPage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)
        
        self.email_input = (By.ID, "email")
        self.password_input = (By.ID, "password")
        self.submit_button = (By.CSS_SELECTOR, "button[type='submit']")
        self.toggle_signup_button = (By.XPATH, "//button[contains(text(), 'Regístrate')]")
        self.toggle_signin_button = (By.XPATH, "//button[contains(text(), 'Inicia sesión')]")
        self.error_message = (By.CSS_SELECTOR, ".bg-red-100")
        self.form_title = (By.XPATH, "//h2[contains(text(), 'Iniciar sesión') or contains(text(), 'Crear cuenta')]")
    
    def navigate_to_login(self):
        self.navigate_to("/")
        self.wait_for_element((By.TAG_NAME, "form"), timeout=15)
    
    def fill_email(self, email):
        self.wait_for_element(self.email_input, timeout=15)
        email_element = self.driver.find_element(*self.email_input)
        email_element.clear()
        email_element.send_keys(email)
    
    def fill_password(self, password):
        self.wait_for_element(self.password_input, timeout=15)
        password_element = self.driver.find_element(*self.password_input)
        password_element.clear()
        password_element.send_keys(password)
    
    def click_submit(self):
        submit_btn = self.wait_for_clickable(self.submit_button, timeout=15)
        submit_btn.click()
    
    def toggle_to_signup(self):
        try:
            toggle_btn = self.wait_for_clickable(self.toggle_signup_button, timeout=15)
            toggle_btn.click()
            self.wait_for_element(self.form_title, timeout=10)
        except TimeoutException:
            print("Toggle button not found, checking if already in signup form...")
            if self.is_signup_form():
                print("Already in signup form")
                return
            raise
    
    def toggle_to_signin(self):
        try:
            toggle_btn = self.wait_for_clickable(self.toggle_signin_button, timeout=15)
            toggle_btn.click()
            self.wait_for_element(self.form_title, timeout=10)
        except TimeoutException:
            if self.is_signin_form():
                print("Already in signin form")
                return
            raise
    
    def get_error_message(self):
        try:
            error_element = self.wait_for_element(self.error_message, timeout=5)
            return error_element.text
        except TimeoutException:
            return None
    
    def wait_for_redirect_to_dashboard(self):
        self.wait.until(EC.url_contains("/notes"))
    
    def is_signup_form(self):
        try:
            title_element = self.wait_for_element(self.form_title, timeout=5)
            return "Crear cuenta" in title_element.text
        except TimeoutException:
            return False
    
    def is_signin_form(self):
        try:
            title_element = self.wait_for_element(self.form_title, timeout=5)
            return "Iniciar sesión" in title_element.text
        except TimeoutException:
            return False
